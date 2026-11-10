import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  let port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Support --port flag passed by npm scripts or runner
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(parsed)) port = parsed;
  }

  app.use(express.json({ limit: '20mb' }));

  // API endpoint for AI waste recognition
  app.post('/api/analyze-waste', async (req, res) => {
    try {
      const { imageBase64, fileName } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64,
                },
              },
              {
                text: `Analisis foto objek sampah ini menggunakan teknik visual recognition mirip Google Lens / Google Image Cross-Check untuk sistem pemilahan kampus VetBin.
Kembalikan JSON murni tanpa markdown dengan format:
{
  "itemName": "Nama spesifik objek sampah dan merk/tipe jika teridentifikasi (contoh: Botol Air Mineral Plastik PET 600ml, Cup Minuman Kopi Seal Press, Kardus Kemasan Modul, Kulit Buah Pisang, Baterai Alkaline AA)",
  "category": "Anorganik" | "Organik" | "Kertas" | "E-waste / Baterai",
  "binColor": "Tong kuning" | "Tong hijau" | "Tong biru" | "Dropbox merah",
  "confidence": 98,
  "icon": "bottle" | "cup" | "package" | "utensils" | "file-text" | "battery-charging" | "leaf" | "cpu",
  "tips": "Instruksi praktis 1 kalimat (contoh: Kosongkan sisa air dan remas botol sebelum dibuang ke tong kuning).",
  "visualMatch": {
    "matchedObject": "Nama objek hasil pencocokan basis data gambar visual",
    "similarityScore": 97.5,
    "material": "Bahan spesifik (contoh: Plastik PET #1, Plastik PP Cup, Kertas Kraft Dupleks, Organik Basah, Sel Lithium/Mangan)",
    "features": [
      "Fitur visual 1 yang terdeteksi (bentuk/transparansi)",
      "Fitur visual 2 (warna/tekstur)",
      "Fitur visual 3 (tutup/label/kontur)"
    ],
    "searchReference": "kata kunci pencarian referensi gambar"
  }
}`
              }
            ]
          },
          config: {
            responseMimeType: 'application/json',
          }
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        }
      }

      // If no API key is set, signal the frontend to use local vision analyzer
      return res.status(200).json({
        fallback: true,
        message: 'No Gemini API key configured, use local vision model'
      });
    } catch (err: any) {
      console.error('Error in /api/analyze-waste:', err);
      return res.status(200).json({ error: err.message, fallback: true });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
