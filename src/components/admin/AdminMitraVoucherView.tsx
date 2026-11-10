import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusVoucher } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Plus,
  History,
  Search,
  TrendingUp,
  Gift,
  Coins,
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Edit2,
  RotateCcw
} from 'lucide-react';
import { KonfirmasiHapusModal } from '../modals/KonfirmasiHapusModal';

interface MitraVoucherProps {
  onOpenTambahMitra: () => void;
  onEditVoucher: (v: CampusVoucher) => void;
}

export const AdminMitraVoucherView: React.FC<MitraVoucherProps> = ({ onOpenTambahMitra, onEditVoucher }) => {
  const { vouchers, redemptions, toggleVoucherStatus, updateVoucherStock, deleteVoucher, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<CampusVoucher | null>(null);

  const filterOptions = ['Semua', 'Aktif', 'Nonaktif', 'Stok menipis'];

  const frequentRedeemed = [
    { title: 'Diskon 10% semua menu', count: 86 },
    { title: 'Gratis es teh manis', count: 54 },
    { title: 'Potongan Rp3.000 fotokopi', count: 41 },
    { title: 'Diskon 15% alat tulis', count: 19 },
    { title: 'Tumbler VetBin', count: 7 },
  ];

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      let matchFilter = true;
      if (selectedFilter === 'Aktif') matchFilter = v.status === 'Aktif';
      else if (selectedFilter === 'Nonaktif') matchFilter = v.status === 'Nonaktif';
      else if (selectedFilter === 'Stok menipis') matchFilter = v.stock <= 20;

      const matchSearch =
        v.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.voucherTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [vouchers, selectedFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A231C]">Mitra voucher</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola mitra dan voucher yang bisa ditukar mahasiswa dengan poin
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Riwayat penukaran</span>
          </button>

          <button
            onClick={onOpenTambahMitra}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Tambah mitra</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (exact Figma Page 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Mitra aktif</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">12</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 bulan ini</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Voucher aktif</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">27</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+5 bulan ini</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Ditukar minggu ini</p>
          <div className="text-3xl font-extrabold text-[#1A231C] mt-1">164</div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% minggu ini</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Poin beredar</p>
          <div className="text-3xl font-extrabold text-[#92400E] mt-1">38.450</div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Dari setoran sampah</p>
        </div>
      </div>

      {/* Middle Row: Voucher Paling Sering Ditukar & Penukaran Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-slate-900">Voucher paling sering ditukar</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              7 hari
            </span>
          </div>

          <div className="space-y-4">
            {frequentRedeemed.map(item => (
              <div key={item.title} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>{item.title}</span>
                  <span className="font-bold text-slate-900">{item.count} tukar</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#16A34A] transition-all duration-500"
                    style={{ width: `${(item.count / 86) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Penukaran Terbaru Live Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Penukaran terbaru</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {redemptions.slice(0, 4).map(red => (
                <div
                  key={red.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-slate-900">{red.voucherTitle}</h5>
                      <p className="text-slate-500">
                        {red.userName} · {red.partnerName}
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">{red.timeAgoText}</span>
                </div>
              ))}
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
            placeholder="Cari mitra atau voucher…"
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

      {/* Content Area: Responsive Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Voucher mitra</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola kuota, status aktif, dan daftar reward mahasiswa</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredVouchers.length} voucher
          </span>
        </div>

        {filteredVouchers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">Tidak ada voucher yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan pencarian atau filter status.</p>
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
            {/* 1. Mobile Cards (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredVouchers.map(v => (
                <div key={v.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {v.partnerName} · {v.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{v.voucherTitle}</h4>
                    </div>
                    <StatusBadge status={v.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="font-bold text-[#92400E] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {v.pointCost} poin
                    </span>
                    <span className="text-slate-500 text-xs">
                      Stok: <strong className="text-slate-800">{v.stock}</strong> · Ditukar: <strong className="text-slate-800">{v.redeemedCount}</strong>
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onEditVoucher(v)}
                      className="py-2 px-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    {v.status === 'Habis' ? (
                      <button
                        onClick={() => {
                          updateVoucherStock(v.id, 50);
                          showToast('Stok Ditambahkan', `Stok ${v.voucherTitle} ditambah +50.`);
                        }}
                        className="py-2 px-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>+50 Stok</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleVoucherStatus(v.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          v.status === 'Aktif'
                            ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                            : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold'
                        }`}
                      >
                        <span>{v.status === 'Aktif' ? 'Nonaktif' : 'Aktifkan'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setVoucherToDelete(v)}
                      className="py-2 px-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAFBF9] border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Mitra</th>
                    <th className="py-3.5 px-4">Voucher</th>
                    <th className="py-3.5 px-4">Biaya poin</th>
                    <th className="py-3.5 px-4">Stok</th>
                    <th className="py-3.5 px-4">Ditukar</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVouchers.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{v.partnerName}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{v.voucherTitle}</td>
                      <td className="py-3.5 px-4 font-bold text-[#92400E]">{v.pointCost} poin</td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">{v.stock}</td>
                      <td className="py-3.5 px-4 text-slate-500">{v.redeemedCount}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={v.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          <button
                            onClick={() => onEditVoucher(v)}
                            className="text-slate-600 hover:text-[#234629] font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>

                          {v.status === 'Habis' ? (
                            <button
                              onClick={() => {
                                updateVoucherStock(v.id, 50);
                                showToast('Stok Ditambahkan', `Stok ${v.voucherTitle} ditambah +50.`);
                              }}
                              className="text-emerald-700 hover:text-emerald-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                              Tambah stok
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleVoucherStatus(v.id)}
                              className={`font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                                v.status === 'Aktif' ? 'text-slate-600' : 'text-emerald-700 font-semibold'
                              }`}
                            >
                              {v.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                          )}

                          <button
                            onClick={() => setVoucherToDelete(v)}
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
      </div>

      {/* Delete Voucher Confirmation Modal */}
      <KonfirmasiHapusModal
        isOpen={!!voucherToDelete}
        title="Hapus Voucher Mitra?"
        itemName={voucherToDelete?.voucherTitle || ''}
        itemDetail={voucherToDelete ? `Mitra: ${voucherToDelete.partnerName} · Biaya: ${voucherToDelete.pointCost} poin` : undefined}
        itemBadge={voucherToDelete?.status}
        warningText="Voucher ini akan dihapus dari katalog penukaran mahasiswa. Riwayat penukaran yang telah terjadi sebelumnya tetap tersimpan."
        confirmLabel="Ya, Hapus Voucher"
        onClose={() => setVoucherToDelete(null)}
        onConfirm={() => {
          if (voucherToDelete) {
            deleteVoucher(voucherToDelete.id);
            setVoucherToDelete(null);
          }
        }}
      />

      {/* Redemption History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Riwayat Penukaran Mahasiswa</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {redemptions.map(r => (
                <div key={r.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <h5 className="font-bold text-slate-900">{r.voucherTitle}</h5>
                    <p className="text-slate-500 text-xs">
                      {r.userName} · {r.partnerName} · Kode: <span className="font-mono font-bold text-slate-700">{r.redeemCode}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#92400E]">-{r.pointsSpent} poin</span>
                    <p className="text-[11px] text-slate-400">{r.timeAgoText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
