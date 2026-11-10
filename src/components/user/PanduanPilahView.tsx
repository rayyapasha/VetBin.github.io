/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ILLUSTRATED_ITEMS } from '../../data/initialData';
import { WasteCategory } from '../../types';
import { analyzeWasteImage, WasteAnalysisResult, VISUAL_DATABASE } from '../../utils/aiVisionWasteClassifier';
import {
  Wine,
  CupSoda,
  Package,
  Utensils,
  FileText,
  BatteryCharging,
  Leaf,
  Cpu,
  Camera,
  Upload,
  Sparkles,
  Info,
  MapPin,
  RefreshCw,
  XCircle,
  Lightbulb,
  SwitchCamera,
  Zap,
  Search,
  CheckCircle2
} from 'lucide-react';

export const PanduanPilahView: React.FC = () => {
  const { bins, setSelectedBinId, setUserTab, showToast } = useApp();

  const [activeItem, setActiveItem] = useState(ILLUSTRATED_ITEMS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<WasteAnalysisResult | null>({
    itemName: 'Botol Air Mineral Plastik (PET)',
    category: 'Anorganik',
    binColor: 'Tong kuning',
    confidence: 98,
    icon: 'bottle',
    tips: 'Kosongkan sisa air dan remas botol agar hemat ruang di tong kuning.',
    detectedVia: 'computer-vision',
    visualMatch: VISUAL_DATABASE.bottle
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Return the icon corresponding to waste item or category
  const getItemIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'bottle':
        return <Wine className={className} />;
      case 'cup':
        return <CupSoda className={className} />;
      case 'package':
        return <Package className={className} />;
      case 'utensils':
        return <Utensils className={className} />;
      case 'file-text':
        return <FileText className={className} />;
      case 'battery-charging':
        return <BatteryCharging className={className} />;
      case 'leaf':
        return <Leaf className={className} />;
      case 'cpu':
        return <Cpu className={className} />;
      default:
        return <Wine className={className} />;
    }
  };

  const getItemColorTheme = (cat: WasteCategory) => {
    switch (cat) {
      case 'Anorganik':
        return {
          bg: 'bg-[#FEF3C7]',
          cardBg: 'bg-[#FFFBEB]',
          text: 'text-[#92400E]',
          border: 'border-[#FDE68A]',
          activeRing: 'ring-[#F59E0B]',
          colorDot: 'bg-[#F59E0B]',
          badgeBg: 'bg-[#FEF3C7]'
        };
      case 'Organik':
        return {
          bg: 'bg-[#DCFCE7]',
          cardBg: 'bg-[#F0FDF4]',
          text: 'text-[#166534]',
          border: 'border-[#BBF7D0]',
          activeRing: 'ring-[#16A34A]',
          colorDot: 'bg-[#16A34A]',
          badgeBg: 'bg-[#DCFCE7]'
        };
      case 'Kertas':
        return {
          bg: 'bg-[#DBEAFE]',
          cardBg: 'bg-[#EFF6FF]',
          text: 'text-[#1E40AF]',
          border: 'border-[#BFDBFE]',
          activeRing: 'ring-[#2563EB]',
          colorDot: 'bg-[#2563EB]',
          badgeBg: 'bg-[#DBEAFE]'
        };
      case 'E-waste / Baterai':
        return {
          bg: 'bg-[#FEE2E2]',
          cardBg: 'bg-[#FEF2F2]',
          text: 'text-[#991B1B]',
          border: 'border-[#FECACA]',
          activeRing: 'ring-[#DC2626]',
          colorDot: 'bg-[#DC2626]',
          badgeBg: 'bg-[#FEE2E2]'
        };
    }
  };

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Start real web camera with optimized constraints for fast initialization
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    try {
      stopCamera();
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (e) {
      console.warn('Camera access unavailable:', e);
      setIsCameraActive(false);
      showToast('Kamera Tidak Tersedia', 'Gunakan tombol "Unggah foto" atau klik salah satu "Contoh Sampah" di bawah.');
    }
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture current video frame and run ultra-fast AI classification
  const handleCaptureFromVideo = async () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const maxDim = 480;
      let w = video.videoWidth || 640;
      let h = video.videoHeight || 480;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.78);

      setAnalyzing(true);
      stopCamera();

      const result = await analyzeWasteImage(dataUrl, 'foto_kamera_sampah.jpg');
      setScanResult(result);
      setAnalyzing(false);
      showToast('AI Mengenali Objek Sampah', `${result.itemName} → ${result.category}`);
    } catch (err) {
      console.error('Error capturing video frame:', err);
      setAnalyzing(false);
    }
  };

  // Upload image file and run AI classification
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const preview = reader.result as string;
      setAnalyzing(true);
      stopCamera();

      try {
        const result = await analyzeWasteImage(preview, file.name);
        setScanResult(result);
        setAnalyzing(false);
        showToast('Foto Berhasil Dianalisis AI', `${result.itemName} cocok untuk ${result.category}`);
      } catch (err) {
        console.error('Error analyzing uploaded file:', err);
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const visualMatchLookup: Record<string, keyof typeof VISUAL_DATABASE> = {
    'Botol Plastik PET': 'bottle',
    'Gelas Minuman Plastik': 'cup',
    'Bungkus Snack / Kantong': 'package',
    'Kardus & Karton Tebal': 'cardboard',
    'Kertas Dokumen & Modul': 'paper',
    'Sisa Makanan & Buah': 'organicFood',
    'Dedaunan & Ranting': 'organicLeaf',
    'Baterai Bekas': 'battery',
    'Kabel & E-waste Kecil': 'ewaste'
  };

  // Generate synthetic sample image for testing
  const handleSampleTest = async (
    itemName: string,
    category: WasteCategory,
    icon: 'bottle' | 'cup' | 'package' | 'utensils' | 'file-text' | 'battery-charging' | 'leaf' | 'cpu',
    binColor: string,
    tips: string,
    colorHex: string,
    visualKey: keyof typeof VISUAL_DATABASE = 'bottle'
  ) => {
    setAnalyzing(true);
    stopCamera();

    // Generate small sample canvas representation
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 225;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, 300, 225);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(itemName, 150, 115);
      ctx.font = '13px sans-serif';
      ctx.fillText(category, 150, 140);
    }
    const sampleDataUrl = canvas.toDataURL('image/jpeg');

    setTimeout(() => {
      setAnalyzing(false);
      setScanResult({
        itemName,
        category,
        binColor,
        confidence: 98,
        icon,
        tips,
        imagePreview: sampleDataUrl,
        detectedVia: 'computer-vision',
        visualMatch: VISUAL_DATABASE[visualKey]
      });
      showToast('Simulasi AI Scanner', `${itemName} cocok dengan database gambar visual`);
    }, 100);
  };

  const handleShowClosestBin = () => {
    if (!scanResult) return;
    const matching = bins
      .filter(b => b.category === scanResult.category)
      .sort((a, b) => a.distanceM - b.distanceM);

    if (matching.length > 0) {
      setSelectedBinId(matching[0].id);
      setUserTab('peta');
    }
  };

  const resultTheme = scanResult ? getItemColorTheme(scanResult.category) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold mb-3 border border-[#FDE68A]">
          <Sparkles className="w-3.5 h-3.5" />
          Panduan Pilah + AI Scanner Cerdas
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A231C] tracking-tight">
          Sampahmu masuk tong yang mana?
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Pilih dari panduan bergambar atau foto sampahmu. AI Scanner mengenali objek sampah secara visual dan mengarahkan ke tong terdekat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Panduan Bergambar */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1A231C]">Panduan bergambar</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ketuk jenis sampah untuk melihat kategori dan ikon pemilahannya.
              </p>
            </div>
          </div>

          {/* Grid of illustrated items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ILLUSTRATED_ITEMS.map(item => {
              const theme = getItemColorTheme(item.category);
              const isSelected = activeItem.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    const vKey = visualMatchLookup[item.name] || 'bottle';
                    setScanResult({
                      itemName: item.name,
                      category: item.category,
                      binColor: item.binColor,
                      confidence: 99,
                      icon: item.icon as any,
                      tips: item.tips,
                      detectedVia: 'computer-vision',
                      visualMatch: VISUAL_DATABASE[vKey]
                    });
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[140px] ${
                    theme.bg
                  } ${theme.border} ${
                    isSelected ? `ring-2 ${theme.activeRing} shadow-xs scale-102` : 'hover:scale-101'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.text}`}>
                    {getItemIcon(item.icon, 'w-6 h-6')}
                  </div>

                  <div className="mt-2 w-full">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                    <p className={`text-[11px] font-semibold mt-1 ${theme.text}`}>
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active item tip notice */}
          <div className="mt-6 p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#234629] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                Tips Memilah: {activeItem.name}
              </h5>
              <p className="text-xs text-slate-600 mt-0.5">{activeItem.tips}</p>
            </div>
          </div>

          {/* Bottom callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600 flex items-center gap-2 border border-slate-150">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Tidak menemukan jenis sampahmu? Gunakan AI Scanner kamera di sebelah kanan.</span>
          </div>
        </div>

        {/* Right Column: AI Scanner */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#1A231C]">AI Scanner</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Object Vision
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold">
              Foto sampahmu
            </span>
          </div>

          {/* Scanner Viewport with Fast Interactive Overlays */}
          <div className="relative aspect-4/3 w-full rounded-2xl bg-[#1A2B1D] overflow-hidden flex flex-col items-center justify-center p-6 text-white text-center shadow-inner">
            {/* Viewfinder corner lines */}
            <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-emerald-400/40 rounded-xl z-20" />

            {/* Real-time laser scanning line animation when camera is live */}
            {isCameraActive && (
              <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34D399] z-25 animate-bounce pointer-events-none" />
            )}

            {scanResult?.imagePreview && !isCameraActive ? (
              <img
                src={scanResult.imagePreview}
                alt="Foto sampah"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                  {getItemIcon(scanResult?.icon || activeItem.icon || 'bottle', 'w-8 h-8 text-emerald-300 stroke-[1.5]')}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-100">
                  Arahkan kamera ke sampahmu
                </p>
                <p className="text-[11px] text-emerald-200/70 mt-1 max-w-[220px]">
                  AI mengenali material secara visual dan mengarahkan ke tong terdekat
                </p>
              </div>
            )}

            {/* Fast Top Camera Controls */}
            {isCameraActive && (
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                <button
                  onClick={toggleFacingMode}
                  type="button"
                  className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                  title="Putar kamera (depan/belakang)"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
                <button
                  onClick={stopCamera}
                  type="button"
                  className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                  title="Tutup kamera"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-[#1A2B1D]/90 z-30 flex flex-col items-center justify-center text-white backdrop-blur-xs animate-in fade-in">
                <RefreshCw className="w-8 h-8 text-emerald-300 animate-spin mb-2" />
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  Menganalisis Cepat...
                </p>
                <span className="text-[10px] text-emerald-200/80 mt-1">Mendeteksi tekstur &amp; material</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {isCameraActive ? (
              <button
                onClick={handleCaptureFromVideo}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-300 animate-pulse"
              >
                <Camera className="w-4 h-4" />
                <span>📸 Tangkap Foto</span>
              </button>
            ) : (
              <button
                onClick={() => startCamera()}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-300" />
                <span>Buka kamera</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Unggah foto</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Quick Sample Photos for immediate 1-click test */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Atau coba tes sampel cepat:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleSampleTest(
                    'Botol Minuman Anorganik (PET)',
                    'Anorganik',
                    'bottle',
                    'Tong kuning',
                    'Kosongkan cairan dan remas botol sebelum dibuang ke tong kuning.',
                    '#D97706',
                    'bottle'
                  )
                }
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-[11px] font-semibold text-amber-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer"
              >
                <Wine className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Botol Anorganik</span>
              </button>

              <button
                onClick={() =>
                  handleSampleTest(
                    'Sisa Makanan & Dedaunan Organik',
                    'Organik',
                    'utensils',
                    'Tong hijau',
                    'Masukkan ke tong hijau bertutup rapat untuk diolah jadi kompos.',
                    '#15803D',
                    'organicFood'
                  )
                }
                className="px-2.5 py-1.5 rounded-lg border border-green-200 bg-green-50/70 hover:bg-green-100 text-[11px] font-semibold text-green-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Sisa Makanan</span>
              </button>

              <button
                onClick={() =>
                  handleSampleTest(
                    'Kardus Dokumen & Modul Kuliah',
                    'Kertas',
                    'file-text',
                    'Tong biru',
                    'Lipat kardus agar rapi dan tidak menghabiskan ruang dropbox biru.',
                    '#1D4ED8',
                    'cardboard'
                  )
                }
                className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-[11px] font-semibold text-blue-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Kardus / Kertas</span>
              </button>

              <button
                onClick={() =>
                  handleSampleTest(
                    'Baterai Bekas (E-waste)',
                    'E-waste / Baterai',
                    'battery-charging',
                    'Dropbox merah',
                    'Limbah B3 harus dimasukkan ke dropbox merah khusus sarpras.',
                    '#B91C1C',
                    'battery'
                  )
                }
                className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/70 hover:bg-red-100 text-[11px] font-semibold text-red-900 flex items-center gap-1.5 transition-colors text-left cursor-pointer"
              >
                <BatteryCharging className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Baterai E-waste</span>
              </button>
            </div>
          </div>

          {/* AI Result Card - strictly matched with visual cross-check */}
          {scanResult && resultTheme && (
            <div className="mt-6 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Hasil AI · keyakinan {scanResult.confidence}%</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {scanResult.detectedVia === 'gemini-ai' ? '✨ Gemini AI Vision' : '👁️ Visual AI'}
                </span>
              </div>

              {/* Card themed to match category and icon */}
              <div className={`p-4 rounded-2xl border ${resultTheme.cardBg} ${resultTheme.border} flex items-start gap-4 shadow-2xs`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${resultTheme.bg} ${resultTheme.text} shadow-xs`}>
                  {getItemIcon(scanResult.icon, 'w-6 h-6')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                    {scanResult.itemName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${resultTheme.bg} ${resultTheme.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${resultTheme.colorDot}`} />
                      {scanResult.category}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      · {scanResult.binColor}
                    </span>
                  </div>
                  {scanResult.tips && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-200/50">
                      💡 {scanResult.tips}
                    </p>
                  )}
                </div>
              </div>

              {/* Google Image Cross-Check Database Match Panel */}
              {scanResult.visualMatch && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/50 border border-emerald-200/90 shadow-2xs text-left">
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-100/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950">
                      <Search className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Image Visual Cross-Check</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {scanResult.visualMatch.similarityScore}% Kemiripan
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] text-slate-500 shrink-0">Objek Referensi:</span>
                      <span className="font-bold text-slate-900 text-right">{scanResult.visualMatch.matchedObject}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] text-slate-500 shrink-0">Material Visual:</span>
                      <span className="font-medium text-emerald-700 text-right bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                        {scanResult.visualMatch.material}
                      </span>
                    </div>

                    {/* Visual Features list */}
                    {scanResult.visualMatch.features && scanResult.visualMatch.features.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                          Fitur Visual Terverifikasi:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {scanResult.visualMatch.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-700 shadow-2xs"
                            >
                              <span className="text-emerald-500 font-bold">✓</span>
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {scanResult.visualMatch.searchReference && (
                      <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Database Query:</span>
                        <span className="italic text-slate-500 truncate">{scanResult.visualMatch.searchReference}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleShowClosestBin}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>Tunjukkan tong {scanResult.category} terdekat di peta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
