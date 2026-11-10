import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeWasteImage } from './aiVisionWasteClassifier';

test('analyzeWasteImage recognizes paper from filename keyword', async () => {
  // 1x1 transparent png data url
  const sampleDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const result = await analyzeWasteImage(sampleDataUrl, 'modul_kertas_kuliah.pdf');

  assert.equal(result.category, 'Kertas');
  assert.equal(result.icon, 'file-text');
  assert.equal(result.binColor, 'Tong biru');
});

test('analyzeWasteImage recognizes organic from filename keyword', async () => {
  const sampleDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const result = await analyzeWasteImage(sampleDataUrl, 'sisa_makanan_kantin.jpg');

  assert.equal(result.category, 'Organik');
  assert.equal(result.icon, 'utensils');
  assert.equal(result.binColor, 'Tong hijau');
});

test('analyzeWasteImage recognizes e-waste battery from filename keyword', async () => {
  const sampleDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const result = await analyzeWasteImage(sampleDataUrl, 'baterai_mouse_rusak.jpg');

  assert.equal(result.category, 'E-waste / Baterai');
  assert.equal(result.icon, 'battery-charging');
  assert.equal(result.binColor, 'Dropbox merah');
});

test('analyzeWasteImage recognizes anorganic from filename keyword', async () => {
  const sampleDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const result = await analyzeWasteImage(sampleDataUrl, 'botol_minuman_dingin.jpg');

  assert.equal(result.category, 'Anorganik');
  assert.equal(result.icon, 'bottle');
  assert.equal(result.binColor, 'Tong kuning');
});
