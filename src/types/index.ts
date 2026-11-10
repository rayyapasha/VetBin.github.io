export type WasteCategory = 'Anorganik' | 'Organik' | 'Kertas' | 'E-waste / Baterai';

export type BinStatus = 'Kosong' | 'Penuh' | 'Rusak';

export interface CampusBin {
  id: string;
  name: string;
  category: WasteCategory;
  building: string;
  locationDetail: string;
  distanceM: number;
  status: BinStatus;
  capacityKg: number;
  lastEmptied: string;
  reportedMinutesAgo?: number;
  qrPrinted: boolean;
  coordinates: { x: number; y: number }; // Percentage 0-100 on campus map
  description?: string;
}

export type ReportIssueType =
  | 'Penuh'
  | 'Rusak'
  | 'Tong rusak'
  | 'Label salah'
  | 'Bau tidak sedap'
  | 'Tutup macet'
  | 'Sampah berserakan'
  | 'Salah pilah'
  | 'Lainnya';
export type ReportStatus = 'Baru' | 'Diproses' | 'Selesai';
export type ReporterRole = 'Mahasiswa' | 'Dosen' | 'Petugas' | 'Tamu';

export interface UserReport {
  id: string;
  binId: string;
  binName: string;
  category: WasteCategory;
  location: string;
  issueType: ReportIssueType;
  photoUrl?: string;
  timestamp: string;
  timeAgoText: string;
  reporter: ReporterRole;
  status: ReportStatus;
  notes?: string;
}

export type VoucherCategory = 'Kantin' | 'Cetak' | 'Alat Tulis' | 'Merchandise';
export type VoucherStatus = 'Aktif' | 'Habis' | 'Nonaktif';

export interface CampusVoucher {
  id: string;
  partnerName: string;
  voucherTitle: string;
  category: VoucherCategory;
  pointCost: number;
  stock: number;
  redeemedCount: number;
  status: VoucherStatus;
  description: string;
}

export interface RedemptionRecord {
  id: string;
  voucherId: string;
  voucherTitle: string;
  partnerName: string;
  userName: string;
  pointsSpent: number;
  timeAgoText: string;
  redeemCode: string;
  timestamp: string;
}

export interface UserImpactProfile {
  nimOrEmail: string;
  isLoggedIn: boolean;
  points: number;
  bottlesCount: number;
  foodWrappersCount: number;
  organicKg: number;
  improvementPercent: number;
}
