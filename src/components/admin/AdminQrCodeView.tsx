import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCard } from '../common/QrCodeView';
import {
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  QrCode,
  TrendingUp,
  FileDown
} from 'lucide-react';
import { CampusBin } from '../../types';

interface AdminQrCodeProps {
  onOpenLembarCetak?: () => void;
}

export const AdminQrCodeView: React.FC<AdminQrCodeProps> = ({ onOpenLembarCetak }) => {
  const { bins, showToast, updateBin } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filterOptions = [
    'Semua',
    'Belum dicetak',
    'Anorganik',
    'Organik',
    'Kertas',
    'E-waste / Baterai'
  ];

  const sudahDicetakCount = bins.filter(b => b.qrPrinted).length;
  const belumDicetakCount = bins.filter(b => !b.qrPrinted).length;

  const filteredBins = useMemo(() => {
    return bins.filter(bin => {
      let matchCat = true;
      if (selectedFilter === 'Belum dicetak') {
        matchCat = !bin.qrPrinted;
      } else if (selectedFilter !== 'Semua') {
        matchCat = bin.category === selectedFilter;
      }

      const matchSearch =
        bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [bins, selectedFilter, searchQuery]);

  const totalPages = Math.ceil(filteredBins.length / itemsPerPage) || 1;
  const paginatedBins = filteredBins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrintAll = () => {
    if (onOpenLembarCetak) {
      onOpenLembarCetak();
    } else {
      bins.forEach(b => updateBin(b.id, { qrPrinted: true }));
      showToast('Mencetak Seluruh Stiker QR', 'Dialog print browser terbuka...');
      setTimeout(() => {
        window.print();
      }, 400);
    }
  };

  const handleDownloadPdf = () => {
    if (onOpenLembarCetak) {
      onOpenLembarCetak();
    } else {
      bins.forEach(b => updateBin(b.id, { qrPrinted: true }));
      showToast('Ekspor Lembar Stiker PDF', 'Mempersiapkan lembar stiker cetak kampus...');
      setTimeout(() => {
        window.print();
      }, 400);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A231C]">QR Code</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cetak QR untuk setiap tong agar mahasiswa bisa memindai dan melapor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Unduh semua (PDF)</span>
          </button>

          <button
            onClick={handlePrintAll}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>Cetak semua QR</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (exact Figma Page 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">QR aktif</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">{bins.length}</div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Satu per titik tong</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Sudah dicetak</p>
          <div className="text-3xl font-extrabold text-[#166534] mt-1">{sudahDicetakCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{Math.round((sudahDicetakCount / Math.max(1, bins.length)) * 100)}% dari total</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Belum dicetak</p>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{belumDicetakCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Perlu dicetak</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Dipindai minggu ini</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">1.186</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% minggu ini</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari QR atau lokasi…"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#234629] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterOptions.map(opt => {
            const isSelected = selectedFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  setSelectedFilter(opt);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#234629] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 8 QR Cards (exact Page 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedBins.map(bin => (
          <QrCard key={bin.id} bin={bin} />
        ))}
      </div>

      {/* Pagination (Page 12) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <span>
          Menampilkan {paginatedBins.length} dari {filteredBins.length} QR Code
        </span>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === p
                  ? 'bg-[#234629] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            Berikutnya
          </button>
        </div>
      </div>

      {/* Bottom Advice Banner (exact Page 12) */}
      <div className="p-4 rounded-2xl bg-[#E8EFE8] border border-[#234629]/20 flex items-start gap-3 text-xs text-[#1E3A23]">
        <QrCode className="w-5 h-5 text-[#234629] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Setiap QR berisi tautan unik ke satu titik tong. Jika tong dipindah, cukup ubah lokasinya di menu <strong>Titik Tong</strong> — QR tidak perlu dicetak ulang.
        </p>
      </div>
    </div>
  );
};
