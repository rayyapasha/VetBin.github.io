import React from 'react';
import { useApp } from '../../context/AppContext';
import { CampusMapCanvas } from '../common/CampusMapCanvas';
import {
  Compass,
  Sparkles,
  AlertCircle,
  Shield,
  Utensils,
  Wine,
  FileText,
  BatteryCharging,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const BerandaView: React.FC = () => {
  const { setUserTab, setIsAdminView, setAdminTab, bins, setSelectedBinId } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE8] text-[#234629] text-xs font-bold tracking-wide border border-[#234629]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Peta Tong Sampah Kampus Cerdas
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A231C] leading-[1.18]">
              Cari tong terdekat, <br />
              <span className="text-[#234629]">pilah sampah tanpa ragu.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              Temukan posisi tong di setiap sudut fakultas atau gunakan AI Scanner untuk mengenali jenis sampahmu secara visual. Tanpa perlu mendaftar akun.
            </p>

            {/* Direct Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setUserTab('peta')}
                className="px-6 py-3.5 rounded-2xl font-bold text-white bg-[#234629] hover:bg-[#1a351f] shadow-md active:scale-[0.98] transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>Buka Peta Kampus</span>
              </button>

              <button
                onClick={() => setUserTab('panduan')}
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs active:scale-[0.98] transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Scanner Sampah</span>
              </button>
            </div>
          </div>

          {/* Right Map Canvas Preview */}
          <div className="lg:col-span-6 relative">
            <div className="p-3 bg-white rounded-3xl shadow-sm border border-slate-200/90">
              <div className="mb-2 px-2 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Denah Lokasi Kampus
                </span>
                <span className="text-[11px] text-slate-400">Pilih titik tong untuk rute</span>
              </div>
              <CampusMapCanvas
                bins={bins}
                selectedBinId="bin-1"
                onSelectBin={(b) => {
                  setSelectedBinId(b.id);
                  setUserTab('peta');
                }}
                isCompact={true}
                isSimplified={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Kategori Tong (Interactive Quick Filter Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A231C]">
              Kenali 4 Kategori Tong Kampus
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Klik kategori untuk melihat titik tong dan panduan pemilahannya
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Organik */}
          <div
            onClick={() => setUserTab('panduan')}
            className="p-4 sm:p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] text-[#166534] flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#166534]">Organik</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">Sisa makanan, buah, daun taman</p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#166534] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              Tong Hijau
            </span>
          </div>

          {/* Anorganik */}
          <div
            onClick={() => setUserTab('panduan')}
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mb-3">
                <Wine className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#92400E]">Anorganik</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">Botol, cup minuman, plastik, kaleng</p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#92400E] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              Tong Kuning
            </span>
          </div>

          {/* Kertas */}
          <div
            onClick={() => setUserTab('panduan')}
            className="p-4 sm:p-5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#1E40AF] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#1E40AF]">Kertas</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">Kardus paket, modul, kertas ujian</p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#1E40AF] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              Tong Biru
            </span>
          </div>

          {/* E-waste */}
          <div
            onClick={() => setUserTab('panduan')}
            className="p-4 sm:p-5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mb-3">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#991B1B]">E-waste</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">Baterai, charger, kabel elektronik</p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-[#991B1B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              Dropbox Merah
            </span>
          </div>
        </div>
      </section>

      {/* 3 Langkah Cepat & Lapor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setUserTab('peta')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E8EFE8] text-[#234629] font-black text-sm flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#234629] transition-colors">
              Pindai QR / Buka Peta
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Langsung terbuka di browser tanpa unduh aplikasi. Peta menampilkan titik tong terdekat.
            </p>
          </div>

          <div
            onClick={() => setUserTab('panduan')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#92400E] font-black text-sm flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#92400E] transition-colors">
              Cek Jenis Sampah dengan AI
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Foto sampahmu dan AI mengenali objek secara visual lalu mengarahkan ke warna tong yang tepat.
            </p>
          </div>

          <div
            onClick={() => setUserTab('lapor')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] text-[#991B1B] font-black text-sm flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#991B1B] transition-colors">
              Lapor Kondisi Tong Penuh / Rusak
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Kirim laporan dengan foto atau catatan teks. Notifikasi otomatis terkirim ke petugas kebersihan.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#234629] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              Akses Pengelola Kampus
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Dashboard Admin &amp; Sarpras Kampus
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-lg">
              Kelola titik tong, cetak label QR siap tempel, dan pantau rekap laporan sarpras kampus.
            </p>
          </div>

          <button
            onClick={() => {
              setIsAdminView(true);
              setAdminTab('ringkasan');
            }}
            className="px-5 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xs active:scale-[0.98] transition-all text-xs sm:text-sm cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0"
          >
            <span>Masuk Dashboard Admin</span>
            <ArrowRight className="w-4 h-4 text-[#234629]" />
          </button>
        </div>
      </section>
    </div>
  );
};
