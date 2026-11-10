import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusBin, WasteCategory } from '../../types';
import { StatusBadge, CategoryPill } from '../common/StatusBadge';
import {
  Plus,
  Printer,
  Search,
  Trash2,
  Edit2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { KonfirmasiHapusModal } from '../modals/KonfirmasiHapusModal';

interface TitikTongProps {
  onOpenTambahTong: () => void;
  onEditBin: (bin: CampusBin) => void;
}

export const AdminTitikTongView: React.FC<TitikTongProps> = ({ onOpenTambahTong, onEditBin }) => {
  const { bins, deleteBin, setAdminTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [binToDelete, setBinToDelete] = useState<CampusBin | null>(null);
  const itemsPerPage = 8;

  const filterOptions = ['Semua', 'Anorganik', 'Organik', 'Kertas', 'E-waste / Baterai'];

  const kosongCount = bins.filter(b => b.status === 'Kosong').length;
  const penuhCount = bins.filter(b => b.status === 'Penuh').length;
  const rusakCount = bins.filter(b => b.status === 'Rusak').length;

  const filteredBins = useMemo(() => {
    return bins.filter(bin => {
      const matchCat = selectedFilter === 'Semua' || bin.category === selectedFilter;
      const matchSearch =
        bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [bins, selectedFilter, searchQuery]);

  const totalPages = Math.ceil(filteredBins.length / itemsPerPage) || 1;
  const paginatedBins = filteredBins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A231C]">Titik tong</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola semua tong dan dropbox sampah terpilah di kampus
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

      {/* 4 KPI Cards (exact Figma Page 10 values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total titik tong</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">{bins.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3 bulan ini</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Tong kosong</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">{kosongCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{Math.round((kosongCount / Math.max(1, bins.length)) * 100)}% dari total</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Tong penuh</p>
          <div className="text-3xl font-extrabold text-red-600 mt-1">{penuhCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mt-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Perlu dikosongkan</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Perlu perbaikan</p>
          <div className="text-3xl font-extrabold text-orange-600 mt-1">{rusakCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Dari laporan pengguna</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama tong atau lokasi…"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#234629] focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
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

      {/* Main Content Area: Responsive Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Semua titik tong</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola status, jadwal pengosongan, dan kode QR</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredBins.length} titik
          </span>
        </div>

        {filteredBins.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">Tidak ada titik tong yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('Semua');
              }}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#234629] bg-[#E8EFE8] hover:bg-[#dce6dc] rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. MOBILE CARD VIEW (< md screens) */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedBins.map(bin => (
                <div key={bin.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{bin.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{bin.building} · {bin.locationDetail.split(',')[0]}</span>
                      </p>
                    </div>
                    <StatusBadge status={bin.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 pb-3">
                    <CategoryPill category={bin.category} />
                    <span className="text-[11px] text-slate-400">
                      Dikosongkan: <strong className="text-slate-600 font-semibold">{bin.lastEmptied}</strong>
                    </span>
                  </div>

                  {/* Mobile Action Buttons Bar with generous tap targets */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onEditBin(bin)}
                      className="py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('qrcode')}
                      className="py-2 px-2.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>QR</span>
                    </button>

                    <button
                      onClick={() => setBinToDelete(bin)}
                      className="py-2 px-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DESKTOP TABLE VIEW (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAFBF9] border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nama</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Lokasi</th>
                    <th className="py-3.5 px-4">Terakhir dikosongkan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBins.map(bin => (
                    <tr key={bin.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{bin.name}</td>
                      <td className="py-3.5 px-4">
                        <CategoryPill category={bin.category} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {bin.building} · {bin.locationDetail.split(',')[0]}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{bin.lastEmptied}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={bin.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          <button
                            onClick={() => onEditBin(bin)}
                            className="text-slate-600 hover:text-[#234629] font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setAdminTab('qrcode')}
                            className="text-slate-600 hover:text-[#234629] font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Cetak QR
                          </button>
                          <button
                            onClick={() => setBinToDelete(bin)}
                            className="text-red-600 hover:text-red-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center gap-1"
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
          </>
        )}

        {/* Pagination (Page 10) */}
        {filteredBins.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan {Math.min(1, filteredBins.length)}–{Math.min(currentPage * itemsPerPage, filteredBins.length)} dari {filteredBins.length} titik tong
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
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
