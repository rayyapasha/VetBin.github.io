import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, CategoryPill } from '../common/StatusBadge';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Printer,
  Clock,
  ArrowRight,
  Trash2,
  MapPin,
  Edit2
} from 'lucide-react';
import { CampusBin } from '../../types';
import { KonfirmasiHapusModal } from '../modals/KonfirmasiHapusModal';

interface RingkasanProps {
  onOpenTambahTong: () => void;
  onEditBin: (bin: CampusBin) => void;
}

export const AdminRingkasanView: React.FC<RingkasanProps> = ({ onOpenTambahTong, onEditBin }) => {
  const { bins, reports, setAdminTab, deleteBin } = useApp();
  const [binToDelete, setBinToDelete] = useState<CampusBin | null>(null);

  const frequentFullBins = [
    { name: 'Anorganik · Kantin Kampus', count: 14, color: 'bg-[#F59E0B]' },
    { name: 'Organik · Kantin Kampus', count: 11, color: 'bg-[#16A34A]' },
    { name: 'Anorganik · Gd. Jend. Sudirman', count: 9, color: 'bg-[#F59E0B]' },
    { name: 'Kertas · Gd. MH. Thamrin', count: 6, color: 'bg-[#2563EB]' },
    { name: 'E-waste · Gd. Dewi Sartika', count: 3, color: 'bg-[#DC2626]' },
  ];

  const recentReports = reports.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A231C]">Ringkasan kampus</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Data 7 hari terakhir · diperbarui dari laporan pengguna
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminTab('qrcode')}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak QR Code</span>
          </button>

          <button
            onClick={onOpenTambahTong}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Tambah titik tong</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (exact Figma numbers and tags) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total titik tong</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">{bins.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3 bulan ini</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Laporan minggu ini</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">23</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>8% lebih sedikit</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Volume terpilah</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">1.240 kg</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% minggu ini</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Rata-rata respon</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">18 mnt</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>4 mnt lebih cepat</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Tong Paling Sering Penuh & Laporan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar chart: Tong Paling Sering Penuh */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-slate-900">Tong paling sering penuh</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              7 hari
            </span>
          </div>

          <div className="space-y-4">
            {frequentFullBins.map(item => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-bold text-slate-900">{item.count} laporan</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${(item.count / 14) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List: Laporan Terbaru */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Laporan terbaru</h3>
              <button
                onClick={() => setAdminTab('laporan')}
                className="text-xs font-semibold text-[#234629] hover:underline flex items-center gap-1"
              >
                Lihat semua
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentReports.map(rep => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-slate-900">{rep.issueType}</h5>
                      <p className="text-slate-500">{rep.location}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">{rep.timeAgoText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Titik Tong */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Titik tong</h3>
            <p className="text-xs text-slate-500">Daftar tong sampah terpasang di kampus</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {bins.length} titik
          </span>
        </div>

        {/* Mobile View: Quick cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {bins.slice(0, 5).map(bin => (
            <div key={bin.id} className="py-3.5 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{bin.name}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{bin.building} · {bin.locationDetail.split(',')[0]}</span>
                  </p>
                </div>
                <StatusBadge status={bin.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 pb-2">
                <CategoryPill category={bin.category} />
                <span className="text-[11px] text-slate-400">{bin.lastEmptied}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onEditBin(bin)}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setAdminTab('qrcode')}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer className="w-3 h-3 text-emerald-600" />
                  <span>QR</span>
                </button>
                <button
                  onClick={() => setBinToDelete(bin)}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Lokasi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bins.slice(0, 5).map(bin => (
                <tr key={bin.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{bin.name}</td>
                  <td className="py-3 px-3">
                    <CategoryPill category={bin.category} />
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {bin.building} · {bin.locationDetail.split(',')[0]}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={bin.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditBin(bin)}
                        className="text-xs font-medium text-slate-600 hover:text-[#234629] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setAdminTab('qrcode')}
                        className="text-xs font-medium text-slate-600 hover:text-[#234629] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Cetak QR
                      </button>
                      <button
                        onClick={() => setBinToDelete(bin)}
                        className="text-xs font-medium text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <KonfirmasiHapusModal
        isOpen={!!binToDelete}
        title="Hapus Titik Tong?"
        itemName={binToDelete?.name || ''}
        itemDetail={binToDelete ? `${binToDelete.building} · ${binToDelete.locationDetail}` : undefined}
        itemBadge={binToDelete?.category}
        warningText="Titik tong ini dan status pemantauannya akan dihapus dari peta kampus. Kode QR yang terpasang pada tong tidak akan lagi dapat diakses pengguna."
        confirmLabel="Ya, Hapus Tong Ini"
        onClose={() => setBinToDelete(null)}
        onConfirm={() => {
          if (binToDelete) {
            deleteBin(binToDelete.id);
            setBinToDelete(null);
          }
        }}
      />
    </div>
  );
};
