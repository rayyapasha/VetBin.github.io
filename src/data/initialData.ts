import { CampusBin, CampusVoucher, UserReport, RedemptionRecord, UserImpactProfile } from '../types';

export const INITIAL_BINS: CampusBin[] = [
  {
    id: 'bin-1',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Kantin Kampus',
    locationDetail: 'Teras depan pintu lobi kantin',
    distanceM: 35,
    status: 'Kosong',
    capacityKg: 50,
    lastEmptied: 'Hari ini 07.30',
    qrPrinted: true,
    coordinates: { x: 46, y: 64 }, // Koridor depan pintu kantin, di atas teks
    description: 'Tong kuning kapasitas besar di teras depan loket makanan kantin'
  },
  {
    id: 'bin-2',
    name: 'Tong Organik',
    category: 'Organik',
    building: 'Kantin Kampus',
    locationDetail: 'Selasar area cuci tangan outdoor kantin',
    distanceM: 45,
    status: 'Kosong',
    capacityKg: 60,
    lastEmptied: 'Hari ini 06.45',
    qrPrinted: true,
    coordinates: { x: 50, y: 91 }, // Koridor bawah kantin, di bawah teks
    description: 'Tong hijau berpenutup rapat anti-bau untuk sisa makanan'
  },
  {
    id: 'bin-3',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Jend. Sudirman (Rektorat)',
    locationDetail: 'Selasar samping pintu aula lobi utama',
    distanceM: 55,
    status: 'Kosong',
    capacityKg: 40,
    lastEmptied: 'Hari ini 07.10',
    qrPrinted: true,
    coordinates: { x: 24, y: 20 }, // Menempel selasar aula Sudirman
    description: 'Tong kuning ramping di selasar masuk aula rektorat'
  },
  {
    id: 'bin-4',
    name: 'Dropbox Kertas',
    category: 'Kertas',
    building: 'Gd. Dr. MH. Thamrin (FEB)',
    locationDetail: 'Lobi barat samping ruang fotokopi FEB',
    distanceM: 75,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Kemarin 16.10',
    qrPrinted: true,
    coordinates: { x: 27, y: 27 }, // Menempel lobi barat FEB
    description: 'Dropbox biru dokumen, modul, dan kertas fotokopi'
  },
  {
    id: 'bin-5',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Lapangan Basket',
    locationDetail: 'Selasar pinggir tribun barat basket',
    distanceM: 95,
    status: 'Penuh',
    capacityKg: 45,
    lastEmptied: 'Kemarin 10.20',
    reportedMinutesAgo: 12,
    qrPrinted: true,
    coordinates: { x: 64, y: 59 }, // Menempel pinggir tribun basket
    description: 'Tong kuning sering penuh botol air mineral setelah olahraga'
  },
  {
    id: 'bin-6',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Masjid Kampus',
    locationDetail: 'Selasar samping rak sepatu pintu masuk',
    distanceM: 110,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Hari ini 08.05',
    qrPrinted: true,
    coordinates: { x: 71.5, y: 59 }, // Menempel selasar masuk masjid
    description: 'Tong kuning bersih untuk jamaah & mahasiswa'
  },
  {
    id: 'bin-7',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Pos Masuk Barat',
    locationDetail: 'Selasar pos keamanan gerbang barat',
    distanceM: 115,
    status: 'Rusak',
    capacityKg: 40,
    lastEmptied: 'Kemarin 15.00',
    qrPrinted: false,
    coordinates: { x: 8, y: 55 }, // Menempel pos keamanan barat
    description: 'Tutup pedal patah akibat desakan jam sibuk pagi'
  },
  {
    id: 'bin-8',
    name: 'Dropbox E-waste',
    category: 'E-waste / Baterai',
    building: 'Gd. Dewi Sartika (FIK)',
    locationDetail: 'Lobi depan Lab Jaringan & IoT FIK 2',
    distanceM: 135,
    status: 'Kosong',
    capacityKg: 20,
    lastEmptied: '3 hari lalu',
    qrPrinted: true,
    coordinates: { x: 66, y: 81 }, // Menempel lobi depan FIK 2
    description: 'Dropbox merah aman baterai, kabel rusak, dan komponen PCB'
  },
  {
    id: 'bin-9',
    name: 'Dropbox Kertas & Formulir',
    category: 'Kertas',
    building: 'Gd. Dr. Soepomo (Fak. Ekonomi & Bisnis)',
    locationDetail: 'Selasar samping pintu masuk lobi FEB',
    distanceM: 70,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Hari ini 08.10',
    qrPrinted: true,
    coordinates: { x: 32, y: 31 }, // Menempel pintu masuk FEB Soepomo
    description: 'Dropbox biru berkas formulir dan modul kuliah FEB'
  },
  {
    id: 'bin-10',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Yos Sudarso (Fak. Hukum)',
    locationDetail: 'Teras lobi depan Fak. Hukum',
    distanceM: 140,
    status: 'Kosong',
    capacityKg: 45,
    lastEmptied: 'Hari ini 07.00',
    qrPrinted: true,
    coordinates: { x: 73, y: 30 }, // Menempel teras depan Fak. Hukum
    description: 'Tong kuning kapasitas sedang untuk mahasiswa hukum'
  },
  {
    id: 'bin-11',
    name: 'Dropbox Kertas & Arsip',
    category: 'Kertas',
    building: 'Gd. RA. Kartini (Pusbabimkar)',
    locationDetail: 'Teras depan loket bimbingan karir',
    distanceM: 65,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Hari ini 06.30',
    qrPrinted: true,
    coordinates: { x: 38, y: 52 }, // Menempel teras depan RA Kartini di jalur pedestrian
    description: 'Dropbox biru berkas formulir dan administrasi mahasiswa'
  },
  {
    id: 'bin-12',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Dr. Wahidin (Fak. Kedokteran)',
    locationDetail: 'Teras lobi pintu utama FK',
    distanceM: 60,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Hari ini 08.15',
    qrPrinted: true,
    coordinates: { x: 37, y: 31 }, // Menempel teras lobi FK
    description: 'Tong kuning higienis area fakultas kedokteran'
  },
  {
    id: 'bin-13',
    name: 'Dropbox Kertas & Modul',
    category: 'Kertas',
    building: 'Gd. Dr. Moh. Yamin (FISIP)',
    locationDetail: 'Selasar samping pintu masuk BEM FISIP',
    distanceM: 85,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Hari ini 08.30',
    qrPrinted: true,
    coordinates: { x: 26, y: 14 }, // Menempel selasar FISIP
    description: 'Dropbox biru untuk lembar ujian dan modul mahasiswa'
  },
  {
    id: 'bin-14',
    name: 'Tong Organik Taman',
    category: 'Organik',
    building: 'Lapangan Utama',
    locationDetail: 'Sudut bangku taman upacara & olahraga',
    distanceM: 70,
    status: 'Kosong',
    capacityKg: 50,
    lastEmptied: 'Hari ini 06.15',
    qrPrinted: true,
    coordinates: { x: 54.5, y: 29 }, // Menempel sudut bangku lapangan
    description: 'Tong hijau daun taman dan sisa makanan ringan'
  },
  {
    id: 'bin-15',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Ki Hajar Dewantoro (FIK)',
    locationDetail: 'Lobi barat pintu masuk FIK 1',
    distanceM: 125,
    status: 'Kosong',
    capacityKg: 40,
    lastEmptied: 'Hari ini 07.45',
    qrPrinted: true,
    coordinates: { x: 81.5, y: 59 }, // Menempel lobi FIK 1
    description: 'Tong kuning anorganik botol kemasan untuk mahasiswa praktikum komputer'
  },
  {
    id: 'bin-16',
    name: 'Dropbox E-waste & Baterai Lab',
    category: 'E-waste / Baterai',
    building: 'Gd. Cipto Mangunkusumo',
    locationDetail: 'Selasar samping pintu Lab Skill FK',
    distanceM: 150,
    status: 'Kosong',
    capacityKg: 25,
    lastEmptied: '2 hari lalu',
    qrPrinted: true,
    coordinates: { x: 75, y: 22 }, // Menempel selasar Lab Skill FK
    description: 'Dropbox khusus baterai alat medik dan komponen sirkuit'
  },
  {
    id: 'bin-17',
    name: 'Tong Organik Ramah Lingkungan',
    category: 'Organik',
    building: 'Gd. Soetomo (Perpustakaan)',
    locationDetail: 'Teras depan lobi perpustakaan kampus',
    distanceM: 90,
    status: 'Kosong',
    capacityKg: 40,
    lastEmptied: 'Hari ini 08.00',
    qrPrinted: true,
    coordinates: { x: 58.5, y: 52 }, // Menempel teras pintu utama perpustakaan pusat
    description: 'Tong hijau higienis untuk pengunjung perpustakaan pusat kampus'
  },
  {
    id: 'bin-18',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Dewi Sartika (FIK)',
    locationDetail: 'Selasar sayap timur lobi FIK 2',
    distanceM: 120,
    status: 'Kosong',
    capacityKg: 45,
    lastEmptied: 'Hari ini 07.20',
    qrPrinted: true,
    coordinates: { x: 74, y: 84 }, // Dipindahkan dari gerbang timur ke sayap timur FIK 2
    description: 'Tong kuning anorganik botol anorganik dan kaleng minuman mahasiswa FIK'
  },
  {
    id: 'bin-19',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Abd. Rahman Saleh',
    locationDetail: 'Lobi barat depan Lab Terpadu',
    distanceM: 110,
    status: 'Kosong',
    capacityKg: 35,
    lastEmptied: 'Hari ini 08.20',
    qrPrinted: true,
    coordinates: { x: 55.5, y: 19 }, // Menempel lobi barat Lab Saleh
    description: 'Tong anorganik higienis untuk pengunjung Lab Terpadu'
  },
  {
    id: 'bin-20',
    name: 'Tong Anorganik',
    category: 'Anorganik',
    building: 'Gd. Pratama',
    locationDetail: 'Teras depan pintu masuk Gd. Pratama',
    distanceM: 50,
    status: 'Kosong',
    capacityKg: 30,
    lastEmptied: 'Hari ini 07.50',
    qrPrinted: true,
    coordinates: { x: 23, y: 52 }, // Menempel teras Gd. Pratama samping RA Kartini
    description: 'Tong anorganik di samping pintu masuk Gd. Pratama'
  }
];

export const INITIAL_REPORTS: UserReport[] = [
  {
    id: 'rep-1',
    binId: 'bin-5',
    binName: 'Tong Anorganik',
    category: 'Anorganik',
    location: 'Lapangan Utama & Basket · Selasar tribun',
    issueType: 'Penuh',
    timestamp: '2026-11-09T04:43:00Z',
    timeAgoText: '2 mnt lalu',
    reporter: 'Mahasiswa',
    status: 'Baru',
    notes: 'Banyak botol anorganik dan cup es teh meluap ke lantai seusai pertandingan basket.'
  },
  {
    id: 'rep-2',
    binId: 'bin-2',
    binName: 'Tong Organik',
    category: 'Organik',
    location: 'Kantin Kampus · Teras wastafel',
    issueType: 'Bau tidak sedap',
    timestamp: '2026-11-09T04:27:00Z',
    timeAgoText: '18 mnt lalu',
    reporter: 'Petugas',
    status: 'Baru',
    notes: 'Sisa makanan seafood dan kuah mulai berbau menyengat, perlu segera diangkut dan disemprot disinfektan.'
  },
  {
    id: 'rep-3',
    binId: 'bin-7',
    binName: 'Tong Anorganik',
    category: 'Anorganik',
    location: 'Pos Masuk Barat · Pos palang masuk',
    issueType: 'Tutup macet',
    timestamp: '2026-11-09T03:45:00Z',
    timeAgoText: '1 jam lalu',
    reporter: 'Mahasiswa',
    status: 'Diproses',
    notes: 'Pedal injak bawah tersangkut batu dan penutup miring tidak mau terbuka.'
  },
  {
    id: 'rep-4',
    binId: 'bin-9',
    binName: 'Tong Organik',
    category: 'Organik',
    location: 'Gd. Graha Adya Wicaksana · Selasar aula barat',
    issueType: 'Penuh',
    timestamp: '2026-11-09T02:45:00Z',
    timeAgoText: '2 jam lalu',
    reporter: 'Dosen',
    status: 'Diproses',
    notes: 'Kotak modul kertas dan kardus konsumsi rapat dosen meluap keluar tong.'
  },
  {
    id: 'rep-5',
    binId: 'bin-1',
    binName: 'Tong Anorganik',
    category: 'Anorganik',
    location: 'Kantin Kampus · Lorong kuliner depan stan minuman es',
    issueType: 'Sampah berserakan',
    timestamp: '2026-11-09T01:45:00Z',
    timeAgoText: '3 jam lalu',
    reporter: 'Mahasiswa',
    status: 'Selesai',
    notes: 'Cup anorganik berceceran di lantai, sudah disapu bersih oleh petugas piket.'
  },
  {
    id: 'rep-6',
    binId: 'bin-8',
    binName: 'Dropbox E-waste',
    category: 'E-waste / Baterai',
    location: 'Gd. Dewi Sartika (FIK) · Lobi Lab',
    issueType: 'Label salah',
    timestamp: '2026-11-08T15:00:00Z',
    timeAgoText: 'Kemarin',
    reporter: 'Petugas',
    status: 'Selesai',
    notes: 'Label petunjuk baterai lithium telah diperbarui dengan stiker anti-air.'
  },
  {
    id: 'rep-7',
    binId: 'bin-3',
    binName: 'Tong Anorganik',
    category: 'Anorganik',
    location: 'Gd. Jend. Sudirman (Rektorat) · Lobi lantai 1',
    issueType: 'Penuh',
    timestamp: '2026-11-08T12:00:00Z',
    timeAgoText: 'Kemarin',
    reporter: 'Mahasiswa',
    status: 'Selesai',
    notes: 'Sudah dikosongkan shift sore.'
  },
  {
    id: 'rep-8',
    binId: 'bin-4',
    binName: 'Dropbox Kertas',
    category: 'Kertas',
    location: 'Gd. Dr. MH. Thamrin (FEB) · Lantai 1',
    issueType: 'Rusak',
    timestamp: '2026-11-07T10:00:00Z',
    timeAgoText: '2 hari lalu',
    reporter: 'Petugas',
    status: 'Selesai',
    notes: 'Kait engsel penutup sudah diperbaiki teknisi sarpras.'
  }
];

export const INITIAL_VOUCHERS: CampusVoucher[] = [
  {
    id: 'vouc-1',
    partnerName: 'Kantin Bu Ani',
    voucherTitle: 'Diskon 10% semua menu',
    category: 'Kantin',
    pointCost: 150,
    stock: 120,
    redeemedCount: 86,
    status: 'Aktif',
    description: 'Berlaku untuk paket nasi rames dan aneka lauk di Kantin Bu Ani.'
  },
  {
    id: 'vouc-2',
    partnerName: 'Kopi Kampus',
    voucherTitle: 'Gratis es teh manis',
    category: 'Kantin',
    pointCost: 100,
    stock: 80,
    redeemedCount: 54,
    status: 'Aktif',
    description: 'Nikmati es teh manis dingin segar gratis saat makan siang.'
  },
  {
    id: 'vouc-3',
    partnerName: 'Fotokopi Jaya',
    voucherTitle: 'Potongan Rp3.000 fotokopi',
    category: 'Cetak',
    pointCost: 120,
    stock: 200,
    redeemedCount: 41,
    status: 'Aktif',
    description: 'Potongan langsung biaya jilid dan fotokopi materi kuliah.'
  },
  {
    id: 'vouc-4',
    partnerName: 'Toko Buku Pelita',
    voucherTitle: 'Diskon 15% alat tulis',
    category: 'Alat Tulis',
    pointCost: 200,
    stock: 45,
    redeemedCount: 19,
    status: 'Aktif',
    description: 'Diskon alat tulis pena, binder, map, dan sticky notes.'
  },
  {
    id: 'vouc-5',
    partnerName: 'Koperasi Mahasiswa',
    voucherTitle: 'Tumbler VetBin',
    category: 'Merchandise',
    pointCost: 500,
    stock: 12,
    redeemedCount: 7,
    status: 'Aktif',
    description: 'Tumbler stainless edisi terbatas VetBin ramah lingkungan.'
  },
  {
    id: 'vouc-6',
    partnerName: 'Warung Hijau',
    voucherTitle: 'Gratis 1 porsi salad',
    category: 'Kantin',
    pointCost: 250,
    stock: 0,
    redeemedCount: 12,
    status: 'Habis',
    description: 'Salad sayur organik lokal kampus dengan saus wijen sangrai.'
  },
  {
    id: 'vouc-7',
    partnerName: 'Kopi Kampus',
    voucherTitle: 'Diskon 20% kopi susu',
    category: 'Kantin',
    pointCost: 180,
    stock: 60,
    redeemedCount: 0,
    status: 'Nonaktif',
    description: 'Kopi susu gula aren andalan mahasiswa.'
  },
  {
    id: 'vouc-8',
    partnerName: 'Kantin Utama',
    voucherTitle: 'Voucher Kantin Rp10.000',
    category: 'Kantin',
    pointCost: 500,
    stock: 50,
    redeemedCount: 28,
    status: 'Aktif',
    description: 'Berlaku di semua stan kantin kampus tanpa syarat minimum pembelian.'
  },
  {
    id: 'vouc-9',
    partnerName: 'Fotokopi Jaya',
    voucherTitle: 'Diskon Cetak 20%',
    category: 'Cetak',
    pointCost: 300,
    stock: 75,
    redeemedCount: 35,
    status: 'Aktif',
    description: 'Untuk layanan cetak laporan praktikum dan fotokopi skripsi.'
  },
  {
    id: 'vouc-10',
    partnerName: 'Kantin Teras',
    voucherTitle: 'Es Teh Gratis',
    category: 'Kantin',
    pointCost: 200,
    stock: 100,
    redeemedCount: 62,
    status: 'Aktif',
    description: 'Tukar di kantin mitra pilihan.'
  }
];

export const INITIAL_REDEMPTIONS: RedemptionRecord[] = [
  {
    id: 'red-1',
    voucherId: 'vouc-2',
    voucherTitle: 'Gratis es teh manis',
    partnerName: 'Kopi Kampus',
    userName: 'Rani A.',
    pointsSpent: 100,
    timeAgoText: '3 mnt lalu',
    redeemCode: 'VETBIN-TEH-8821',
    timestamp: '2026-11-09T04:42:00Z'
  },
  {
    id: 'red-2',
    voucherId: 'vouc-1',
    voucherTitle: 'Diskon 10% semua menu',
    partnerName: 'Kantin Bu Ani',
    userName: 'Dimas P.',
    pointsSpent: 150,
    timeAgoText: '21 mnt lalu',
    redeemCode: 'VETBIN-ANI-4412',
    timestamp: '2026-11-09T04:24:00Z'
  },
  {
    id: 'red-3',
    voucherId: 'vouc-3',
    voucherTitle: 'Potongan Rp3.000 fotokopi',
    partnerName: 'Fotokopi Jaya',
    userName: 'Salsa N.',
    pointsSpent: 120,
    timeAgoText: '1 jam lalu',
    redeemCode: 'VETBIN-FC-9011',
    timestamp: '2026-11-09T03:45:00Z'
  },
  {
    id: 'red-4',
    voucherId: 'vouc-5',
    voucherTitle: 'Tumbler VetBin',
    partnerName: 'Koperasi Mahasiswa',
    userName: 'Bagas R.',
    pointsSpent: 500,
    timeAgoText: '3 jam lalu',
    redeemCode: 'VETBIN-TMB-1123',
    timestamp: '2026-11-09T01:45:00Z'
  }
];

export const ILLUSTRATED_ITEMS = [
  {
    id: 'item-1',
    name: 'Botol anorganik',
    category: 'Anorganik' as const,
    binColor: 'Tong kuning',
    icon: 'bottle',
    tips: 'Kosongkan sisa air dan remas sebelum dibuang di tong kuning anorganik.'
  },
  {
    id: 'item-2',
    name: 'Gelas minuman',
    category: 'Anorganik' as const,
    binColor: 'Tong kuning',
    icon: 'cup',
    tips: 'Lepaskan sedotan anorganik atau buang bersama di tong kuning anorganik.'
  },
  {
    id: 'item-3',
    name: 'Bungkus makanan',
    category: 'Anorganik' as const,
    binColor: 'Tong kuning',
    icon: 'package',
    tips: 'Bungkus snack, mika anorganik, dan kantong kemasan kering.'
  },
  {
    id: 'item-4',
    name: 'Sisa makanan',
    category: 'Organik' as const,
    binColor: 'Tong hijau',
    icon: 'utensils',
    tips: 'Nasi, sayur, tulang ayam, dan sisa lauk makan siang.'
  },
  {
    id: 'item-5',
    name: 'Kertas dan kardus',
    category: 'Kertas' as const,
    binColor: 'Tong biru',
    icon: 'file-text',
    tips: 'Lipat kardus kemasan, kertas dokumen, modul, dan buku bekas.'
  },
  {
    id: 'item-6',
    name: 'Baterai bekas',
    category: 'E-waste / Baterai' as const,
    binColor: 'Dropbox merah',
    icon: 'battery-charging',
    tips: 'Baterai jam, remote, atau aki kecil. Jangan campur dengan sampah basah.'
  },
  {
    id: 'item-7',
    name: 'Daun dan ranting',
    category: 'Organik' as const,
    binColor: 'Tong hijau',
    icon: 'leaf',
    tips: 'Guguran daun taman kampus dan ranting kecil untuk bahan kompos.'
  },
  {
    id: 'item-8',
    name: 'Kabel dan charger',
    category: 'E-waste / Baterai' as const,
    binColor: 'Dropbox merah',
    icon: 'cpu',
    tips: 'Charger rusak, kabel USB putus, earphone mati, dan PCB elektronik.'
  }
];
