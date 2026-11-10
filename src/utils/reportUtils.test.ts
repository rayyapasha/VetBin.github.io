import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateReportSubmission,
  getCampusTrafficPriority,
  generateWhatsAppDispatchMessage
} from './reportUtils';

test('validateReportSubmission accepts valid submission with text only', () => {
  const result = validateReportSubmission({
    binId: 'bin-1',
    issueType: 'Bau tidak sedap',
    notes: 'Sisa makanan seafood berbau menyengat dekat wastafel'
  });
  assert.equal(result.isValid, true);
});

test('validateReportSubmission accepts valid submission with photo only', () => {
  const result = validateReportSubmission({
    binId: 'bin-5',
    issueType: 'Penuh',
    photoUrl: 'data:image/jpeg;base64,...'
  });
  assert.equal(result.isValid, true);
});

test('validateReportSubmission rejects Lainnya issue if notes are missing or too short', () => {
  const result = validateReportSubmission({
    binId: 'bin-7',
    issueType: 'Lainnya',
    notes: ''
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errorMessage?.includes('kolom teks'));
});

test('validateReportSubmission rejects if binId is empty', () => {
  const result = validateReportSubmission({
    binId: '',
    issueType: 'Penuh',
    notes: 'Ada tumpukan sampah'
  });
  assert.equal(result.isValid, false);
});

test('getCampusTrafficPriority assigns Tinggi to Kantin and Lapangan hubs', () => {
  assert.equal(getCampusTrafficPriority('Kantin Kampus'), 'Tinggi');
  assert.equal(getCampusTrafficPriority('Lapangan Utama & Basket'), 'Tinggi');
  assert.equal(getCampusTrafficPriority('Gd. Jend. Sudirman (Rektorat)'), 'Tinggi');
  assert.equal(getCampusTrafficPriority('Parkir Motor & Pintu Masuk'), 'Tinggi');
});

test('getCampusTrafficPriority assigns Sedang to academic faculties', () => {
  assert.equal(getCampusTrafficPriority('Gd. Dr. MH. Thamrin (FEB)'), 'Sedang');
  assert.equal(getCampusTrafficPriority('Gd. Dewi Sartika (FIK)'), 'Sedang');
  assert.equal(getCampusTrafficPriority('Masjid Kampus'), 'Sedang');
});

test('generateWhatsAppDispatchMessage builds formatted message', () => {
  const message = generateWhatsAppDispatchMessage({
    issueType: 'Bau tidak sedap',
    binName: 'Tong Organik',
    building: 'Kantin Kampus',
    locationDetail: 'Teras wastafel',
    notes: 'Bau menyengat',
    reporter: 'Petugas'
  });
  assert.ok(message.includes('[LAPORAN VETBIN] Tong BAU TIDAK SEDAP'));
  assert.ok(message.includes('Lokasi: Kantin Kampus'));
  assert.ok(message.includes('Catatan: "Bau menyengat"'));
});

test('generateWhatsAppDispatchMessage formats Dosen reporter properly', () => {
  const message = generateWhatsAppDispatchMessage({
    issueType: 'Penuh',
    binName: 'Dropbox Kertas',
    building: 'Gd. Dr. MH. Thamrin (FEB)',
    locationDetail: 'Ruang Dosen FEB',
    notes: 'Kardus modul ujian menumpuk',
    reporter: 'Dosen'
  });
  assert.ok(message.includes('Pelapor: Dosen'));
  assert.ok(message.includes('Kardus modul ujian menumpuk'));
});
