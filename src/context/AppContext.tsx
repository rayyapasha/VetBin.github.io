import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CampusBin,
  CampusVoucher,
  UserReport,
  RedemptionRecord,
  UserImpactProfile,
  BinStatus,
  ReportStatus,
  ReportIssueType,
  ReporterRole
} from '../types';
import {
  INITIAL_BINS,
  INITIAL_REPORTS,
  INITIAL_VOUCHERS,
  INITIAL_REDEMPTIONS
} from '../data/initialData';

export type UserTab = 'beranda' | 'peta' | 'panduan' | 'lapor' | 'poin' | 'petugas';
export type AdminTab = 'ringkasan' | 'titik-tong' | 'qrcode' | 'mitra' | 'laporan';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  userTab: UserTab;
  setUserTab: (tab: UserTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Selected bin / Quick Action context
  selectedBinId: string | null;
  setSelectedBinId: (id: string | null) => void;
  targetReportBinId: string | null;
  setTargetReportBinId: (id: string | null) => void;

  // Bins Database
  bins: CampusBin[];
  addBin: (bin: Omit<CampusBin, 'id' | 'distanceM'>) => CampusBin;
  updateBin: (id: string, updates: Partial<CampusBin>) => void;
  deleteBin: (id: string) => void;
  emptyBin: (id: string) => void;
  markBinReported: (id: string, status: BinStatus) => void;

  // Reports Database
  reports: UserReport[];
  addReport: (reportData: {
    binId: string;
    issueType: ReportIssueType;
    photoUrl?: string;
    notes?: string;
    reporter?: ReporterRole;
  }) => UserReport;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  exportCsv: () => void;

  // Vouchers & Rewards
  vouchers: CampusVoucher[];
  addVoucher: (v: Omit<CampusVoucher, 'id' | 'redeemedCount'>) => void;
  updateVoucherStock: (id: string, newStock: number) => void;
  toggleVoucherStatus: (id: string) => void;
  deleteVoucher: (id: string) => void;
  redeemVoucher: (voucherId: string) => { success: boolean; message: string; code?: string };
  redemptions: RedemptionRecord[];

  // User Profile / Points
  userProfile: UserImpactProfile;
  loginUser: (nimOrEmail: string) => void;
  addPoints: (amount: number, wasteType?: string) => void;

  // Simple Onboarding Modal
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (val: boolean) => void;

  // Toast notifications
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Reset to default sample
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BINS: 'vetbin_bins_db_v5',
  REPORTS: 'vetbin_reports_db_v5',
  VOUCHERS: 'vetbin_vouchers_db_v5',
  REDEMPTIONS: 'vetbin_redemptions_db',
  USER_PROFILE: 'vetbin_user_profile'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [userTab, setUserTab] = useState<UserTab>('beranda');
  const [adminTab, setAdminTab] = useState<AdminTab>('ringkasan');

  // Onboarding Modal (closed by default, zero popup obstruction)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Selected bin cross-linking
  const [selectedBinId, setSelectedBinId] = useState<string | null>('bin-1');
  const [targetReportBinId, setTargetReportBinId] = useState<string | null>('bin-1');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persistent Bins (Sanitized to strictly Anorganik)
  const [bins, setBins] = useState<CampusBin[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BINS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          return parsed.map((b: CampusBin) => ({
            ...b,
            category: (b.category as string) === 'Plastik / Anorganik' || (b.category as string) === 'Plastik' ? 'Anorganik' : b.category,
            name: b.name.replace(/Plastik \/ /gi, '').replace(/Plastik/gi, 'Anorganik'),
            description: b.description ? b.description.replace(/plastik/gi, 'anorganik') : b.description
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BINS;
  });

  // Persistent Reports
  const [reports, setReports] = useState<UserReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REPORTS;
  });

  // Persistent Vouchers
  const [vouchers, setVouchers] = useState<CampusVoucher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VOUCHERS;
  });

  // Persistent Redemptions
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REDEMPTIONS;
  });

  // Persistent User Profile
  const [userProfile, setUserProfile] = useState<UserImpactProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      nimOrEmail: '21051204018@kampus.ac.id',
      isLoggedIn: true,
      points: 1240,
      bottlesCount: 86,
      foodWrappersCount: 32,
      organicKg: 14,
      improvementPercent: 22
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BINS, JSON.stringify(bins));
    } catch (e) {
      console.error(e);
    }
  }, [bins]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
    } catch (e) {
      console.error(e);
    }
  }, [vouchers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
    } catch (e) {
      console.error(e);
    }
  }, [redemptions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Actions
  const addBin = (binData: Omit<CampusBin, 'id' | 'distanceM'>): CampusBin => {
    const newId = `bin-${Date.now().toString().slice(-4)}`;
    const randomDistance = Math.floor(Math.random() * 200) + 30;
    const newBin: CampusBin = {
      ...binData,
      id: newId,
      distanceM: randomDistance
    };
    setBins(prev => [newBin, ...prev]);
    showToast('Titik Tong Ditambahkan', `${newBin.name} (${newBin.building}) berhasil disimpan dan QR Code siap dicetak.`);
    return newBin;
  };

  const updateBin = (id: string, updates: Partial<CampusBin>) => {
    setBins(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Titik Tong Diperbarui', 'Perubahan data tong berhasil disimpan.');
  };

  const deleteBin = (id: string) => {
    const target = bins.find(b => b.id === id);
    setBins(prev => prev.filter(b => b.id !== id));
    showToast('Titik Tong Dihapus', `${target?.name || 'Tong'} telah dihapus dari sistem.`, 'info');
  };

  const emptyBin = (id: string) => {
    setBins(prev =>
      prev.map(b =>
        b.id === id
          ? {
              ...b,
              status: 'Kosong',
              lastEmptied: 'Baru saja',
              reportedMinutesAgo: undefined
            }
          : b
      )
    );
    // Also mark related reports as Selesai
    setReports(prev =>
      prev.map(r =>
        r.binId === id && r.issueType === 'Penuh'
          ? { ...r, status: 'Selesai' }
          : r
      )
    );
    showToast('Tong Dikosongkan', 'Status tong kembali Kosong dan hilang dari rute tugas pengosongan.');
  };

  const markBinReported = (id: string, status: BinStatus) => {
    setBins(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, status, reportedMinutesAgo: 1 }
          : b
      )
    );
  };

  const addReport = (data: {
    binId: string;
    issueType: ReportIssueType;
    photoUrl?: string;
    notes?: string;
    reporter?: ReporterRole;
  }): UserReport => {
    const bin = bins.find(b => b.id === data.binId) || bins[0];
    const newReport: UserReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      binId: bin.id,
      binName: bin.name,
      category: bin.category,
      location: `${bin.building} · ${bin.locationDetail}`,
      issueType: data.issueType,
      photoUrl: data.photoUrl,
      timestamp: new Date().toISOString(),
      timeAgoText: 'Baru saja',
      reporter: data.reporter || 'Mahasiswa',
      status: 'Baru',
      notes: data.notes || `Laporan ${data.issueType.toLowerCase()} pada ${bin.name}`
    };

    setReports(prev => [newReport, ...prev]);

    // Update bin status
    if (data.issueType === 'Penuh') {
      markBinReported(bin.id, 'Penuh');
    } else if (data.issueType === 'Rusak') {
      markBinReported(bin.id, 'Rusak');
    }

    showToast('Laporan Terkirim!', `Pesan notifikasi WhatsApp berhasil dikirim ke petugas kebersihan kampus.`);
    return newReport;
  };

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
    showToast('Status Laporan Diperbarui', `Laporan ditandai sebagai: ${status}`);
  };

  const exportCsv = () => {
    const headers = 'ID,Waktu,Jenis Masalah,Titik Tong,Kategori,Lokasi,Pelapor,Status,Catatan\n';
    const rows = reports.map(r =>
      `"${r.id}","${r.timeAgoText}","${r.issueType}","${r.binName}","${r.category}","${r.location}","${r.reporter}","${r.status}","${r.notes || ''}"`
    );
    const csvContent = headers + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vetbin_laporan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ekspor Berhasil', 'File laporan CSV berhasil diunduh.');
  };

  const addVoucher = (v: Omit<CampusVoucher, 'id' | 'redeemedCount'>) => {
    const newV: CampusVoucher = {
      ...v,
      id: `vouc-${Date.now().toString().slice(-4)}`,
      redeemedCount: 0
    };
    setVouchers(prev => [newV, ...prev]);
    showToast('Mitra / Voucher Ditambahkan', `${newV.voucherTitle} dari ${newV.partnerName} aktif.`);
  };

  const updateVoucherStock = (id: string, newStock: number) => {
    setVouchers(prev =>
      prev.map(v =>
        v.id === id
          ? {
              ...v,
              stock: newStock,
              status: newStock === 0 ? 'Habis' : v.status === 'Habis' ? 'Aktif' : v.status
            }
          : v
      )
    );
    showToast('Stok Diperbarui', 'Stok voucher berhasil diperbarui.');
  };

  const toggleVoucherStatus = (id: string) => {
    setVouchers(prev =>
      prev.map(v => {
        if (v.id === id) {
          const next = v.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          return { ...v, status: next };
        }
        return v;
      })
    );
  };

  const deleteVoucher = (id: string) => {
    const target = vouchers.find(v => v.id === id);
    setVouchers(prev => prev.filter(v => v.id !== id));
    showToast('Voucher Dihapus', `${target?.voucherTitle || 'Voucher'} berhasil dihapus dari sistem.`, 'info');
  };

  const redeemVoucher = (voucherId: string) => {
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return { success: false, message: 'Voucher tidak ditemukan' };
    if (voucher.stock <= 0) return { success: false, message: 'Stok voucher telah habis' };
    if (userProfile.points < voucher.pointCost) {
      showToast('Poin Tidak Cukup', `Kamu butuh ${voucher.pointCost} poin. Poin kamu saat ini ${userProfile.points}.`, 'error');
      return { success: false, message: 'Poin tidak mencukupi' };
    }

    const code = `VETBIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Deduct points
    setUserProfile(prev => ({
      ...prev,
      points: prev.points - voucher.pointCost
    }));

    // Deduct stock & increment redeemed
    setVouchers(prev =>
      prev.map(v =>
        v.id === voucherId
          ? {
              ...v,
              stock: v.stock - 1,
              redeemedCount: v.redeemedCount + 1,
              status: v.stock - 1 === 0 ? 'Habis' : v.status
            }
          : v
      )
    );

    // Add to redemptions
    const newRedemption: RedemptionRecord = {
      id: `red-${Date.now().toString().slice(-4)}`,
      voucherId: voucher.id,
      voucherTitle: voucher.voucherTitle,
      partnerName: voucher.partnerName,
      userName: userProfile.nimOrEmail.split('@')[0] || 'Mahasiswa',
      pointsSpent: voucher.pointCost,
      timeAgoText: 'Baru saja',
      redeemCode: code,
      timestamp: new Date().toISOString()
    };
    setRedemptions(prev => [newRedemption, ...prev]);

    showToast('Voucher Berhasil Ditukar!', `Gunakan kode ${code} di kasir ${voucher.partnerName}.`);
    return { success: true, message: 'Berhasil ditukar', code };
  };

  const loginUser = (nimOrEmail: string) => {
    setUserProfile(prev => ({
      ...prev,
      nimOrEmail,
      isLoggedIn: true
    }));
    showToast('Berhasil Masuk', `Selamat datang kembali, ${nimOrEmail}!`);
  };

  const addPoints = (amount: number, wasteType?: string) => {
    setUserProfile(prev => {
      let b = prev.bottlesCount;
      let w = prev.foodWrappersCount;
      let o = prev.organicKg;

      if (wasteType?.includes('Anorganik') || wasteType?.includes('Plastik') || wasteType?.includes('Botol')) {
        b += 1;
      } else if (wasteType?.includes('Bungkus') || wasteType?.includes('Makanan')) {
        w += 1;
      } else if (wasteType?.includes('Organik')) {
        o += 0.5;
      } else {
        b += 1;
      }

      return {
        ...prev,
        points: prev.points + amount,
        bottlesCount: b,
        foodWrappersCount: w,
        organicKg: Math.round(o * 10) / 10
      };
    });
    showToast(`+${amount} Poin Berhasil Ditambahkan!`, `Terima kasih sudah memilah sampah di tong yang tepat!`);
  };

  const resetDatabase = () => {
    setBins(INITIAL_BINS);
    setReports(INITIAL_REPORTS);
    setVouchers(INITIAL_VOUCHERS);
    setRedemptions(INITIAL_REDEMPTIONS);
    setUserProfile({
      nimOrEmail: '21051204018@kampus.ac.id',
      isLoggedIn: true,
      points: 1240,
      bottlesCount: 86,
      foodWrappersCount: 32,
      organicKg: 14,
      improvementPercent: 22
    });
    localStorage.clear();
    showToast('Database Direset', 'Semua data telah dikembalikan ke standar bawaan Figma.');
  };

  return (
    <AppContext.Provider
      value={{
        isAdminView,
        setIsAdminView,
        userTab,
        setUserTab,
        adminTab,
        setAdminTab,
        selectedBinId,
        setSelectedBinId,
        targetReportBinId,
        setTargetReportBinId,
        bins,
        addBin,
        updateBin,
        deleteBin,
        emptyBin,
        markBinReported,
        reports,
        addReport,
        updateReportStatus,
        exportCsv,
        vouchers,
        addVoucher,
        updateVoucherStock,
        toggleVoucherStatus,
        deleteVoucher,
        redeemVoucher,
        redemptions,
        userProfile,
        loginUser,
        addPoints,
        toasts,
        showToast,
        dismissToast,
        resetDatabase,
        isOnboardingOpen,
        setIsOnboardingOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
