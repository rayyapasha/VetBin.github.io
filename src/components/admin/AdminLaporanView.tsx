import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserReport, ReportStatus, ReportIssueType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Download,
  CheckCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingDown,
  FileSpreadsheet
} from 'lucide-react';

interface LaporanProps {
  onOpenReportDetail: (report: UserReport) => void;
}

export const AdminLaporanView: React.FC<LaporanProps> = ({ onOpenReportDetail }) => {
  const { reports, updateReportStatus, exportCsv, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);

  const filterOptions = [
    'Semua',
    'Penuh',
    'Rusak',
    'Bau tidak sedap',
    'Tutup macet',
    'Sampah berserakan',
    'Baru',
    'Diproses',
    'Selesai'
  ];

  const belumDitanganiCount = reports.filter(r => r.status === 'Baru' || r.status === 'Diproses').length;
  const selesaiCount = reports.filter(r => r.status === 'Selesai').length;

  const getIssueDotColor = (issue: ReportIssueType) => {
    switch (issue) {
      case 'Penuh':
        return 'bg-red-500';
      case 'Rusak':
      case 'Tong rusak':
        return 'bg-orange-500';
      case 'Bau tidak sedap':
        return 'bg-amber-500';
      case 'Tutup macet':
        return 'bg-purple-500';
      case 'Sampah berserakan':
        return 'bg-rose-500';
      case 'Salah pilah':
        return 'bg-indigo-500';
      case 'Label salah':
        return 'bg-blue-500';
      default:
        return 'bg-slate-500';
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      let matchFilter = true;
      if (['Penuh', 'Rusak', 'Tong rusak', 'Label salah', 'Bau tidak sedap', 'Tutup macet', 'Sampah berserakan', 'Salah pilah', 'Lainnya'].includes(selectedFilter)) {
        matchFilter = rep.issueType === selectedFilter;
      } else if (['Baru', 'Diproses', 'Selesai'].includes(selectedFilter)) {
        matchFilter = rep.status === selectedFilter;
      }

      const matchSearch =
        rep.binName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.issueType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [reports, selectedFilter, searchQuery]);

  const toggleSelectReport = (id: string) => {
    setSelectedReportIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMarkSelectedDone = () => {
    if (selectedReportIds.length === 0) {
      showToast('Pilih Laporan Dulu', 'Centang minimal satu laporan untuk ditandai selesai.', 'info');
      return;
    }
    selectedReportIds.forEach(id => updateReportStatus(id, 'Selesai'));
    setSelectedReportIds([]);
    showToast('Laporan Diselesaikan', `${selectedReportIds.length} laporan berhasil ditandai Selesai.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A231C]">Laporan pengguna</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Laporan dari mahasiswa, dosen, tamu, dan petugas tentang kondisi titik tong
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handleMarkSelectedDone}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-300" />
            <span>Tandai terpilih selesai</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (exact Figma Page 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Laporan minggu ini</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">{reports.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>8% lebih sedikit</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Belum ditangani</p>
          <div className="text-3xl font-extrabold text-red-600 mt-1">{belumDitanganiCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mt-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Perlu tindak lanjut</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Rata-rata respon</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">18 mnt</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>4 mnt lebih cepat</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Terselesaikan</p>
          <div className="text-3xl font-extrabold text-[#166534] mt-1">{selesaiCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{Math.round((selesaiCount / Math.max(1, reports.length)) * 100)}% dari total</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Laporan Menurut Jenis & Status Laporan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Laporan Menurut Jenis */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-slate-900">Laporan menurut jenis</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              7 hari
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Tong penuh</span>
                <span className="font-bold text-slate-900">14 laporan</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#CA7426]" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Label salah</span>
                <span className="font-bold text-slate-900">5 laporan</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#16A34A]" style={{ width: '35%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Tong rusak</span>
                <span className="font-bold text-slate-900">4 laporan</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#3B82F6]" style={{ width: '28%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status Laporan */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-4">Status laporan</h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    Baru
                  </span>
                  <span className="text-slate-600">Menunggu petugas</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">4</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                    Diproses
                  </span>
                  <span className="text-slate-600">Sedang ditangani</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">2</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                    Selesai
                  </span>
                  <span className="text-slate-600">Sudah ditutup</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">17</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari titik tong…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#234629] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterOptions.map(opt => {
            const isSelected = selectedFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => setSelectedFilter(opt)}
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

      {/* Table: Laporan Masuk */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Laporan masuk</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredReports.length} laporan
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">Tidak ada laporan yang sesuai kriteria</p>
            <p className="text-xs text-slate-400 mt-1">Coba ganti filter status atau pencarian kata kunci.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('Semua');
              }}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#234629] bg-[#E8EFE8] hover:bg-[#dce6dc] rounded-xl cursor-pointer"
            >
              <span>Reset Filter</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredReports.map(rep => (
                <div key={rep.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedReportIds.includes(rep.id)}
                        onChange={() => toggleSelectReport(rep.id)}
                        className="rounded text-[#234629] focus:ring-[#234629] mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${getIssueDotColor(rep.issueType)}`} />
                          <h4 className="font-bold text-sm text-slate-900 capitalize">{rep.issueType}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{rep.binName} · {rep.location}</p>
                      </div>
                    </div>
                    <StatusBadge status={rep.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 py-1 pl-6">
                    <span>Pelapor: <strong className="text-slate-600">{rep.reporter}</strong></span>
                    <span>{rep.timeAgoText}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 mt-2 pl-6">
                    <button
                      onClick={() => onOpenReportDetail(rep)}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                    >
                      Detail
                    </button>
                    {rep.status !== 'Selesai' && (
                      <button
                        onClick={() => updateReportStatus(rep.id, 'Selesai')}
                        className="py-1.5 px-3 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                      >
                        Selesai
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAFBF9] border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-8">
                      <input
                        type="checkbox"
                        checked={selectedReportIds.length === filteredReports.length && filteredReports.length > 0}
                        onChange={e => {
                          if (e.target.checked) setSelectedReportIds(filteredReports.map(r => r.id));
                          else setSelectedReportIds([]);
                        }}
                        className="rounded text-[#234629] focus:ring-[#234629]"
                      />
                    </th>
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Jenis</th>
                    <th className="py-3.5 px-4">Titik tong</th>
                    <th className="py-3.5 px-4">Pelapor</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={selectedReportIds.includes(rep.id)}
                          onChange={() => toggleSelectReport(rep.id)}
                          className="rounded text-[#234629] focus:ring-[#234629]"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{rep.timeAgoText}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${getIssueDotColor(rep.issueType)}`} />
                          <span className="capitalize">{rep.issueType}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {rep.category.split('/')[0]} · {rep.location}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rep.reporter}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={rep.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          <button
                            onClick={() => onOpenReportDetail(rep)}
                            className="text-slate-600 hover:text-[#234629] font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Detail
                          </button>

                          {rep.status !== 'Selesai' && (
                            <button
                              onClick={() => updateReportStatus(rep.id, 'Selesai')}
                              className="text-emerald-700 hover:text-emerald-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                              Tandai selesai
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
