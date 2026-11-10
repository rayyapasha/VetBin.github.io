import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VoucherCategory } from '../../types';
import { X, Gift } from 'lucide-react';

interface TambahMitraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TambahMitraModal: React.FC<TambahMitraModalProps> = ({ isOpen, onClose }) => {
  const { addVoucher } = useApp();

  const [partnerName, setPartnerName] = useState('');
  const [voucherTitle, setVoucherTitle] = useState('');
  const [category, setCategory] = useState<VoucherCategory>('Kantin');
  const [pointCost, setPointCost] = useState(150);
  const [stock, setStock] = useState(50);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !voucherTitle.trim()) return;

    addVoucher({
      partnerName,
      voucherTitle,
      category,
      pointCost,
      stock,
      status: 'Aktif',
      description: description || `Voucher ${voucherTitle} dari mitra ${partnerName}.`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mb-3">
            <Gift className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tambah Mitra / Voucher</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambahkan voucher baru yang dapat ditukar mahasiswa menggunakan poin pilah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Mitra Kampus
              </label>
              <input
                type="text"
                placeholder="Contoh: Kopi Nusantara"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Mitra
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as VoucherCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              >
                <option value="Kantin">Kantin</option>
                <option value="Cetak">Cetak &amp; Fotokopi</option>
                <option value="Alat Tulis">Alat Tulis</option>
                <option value="Merchandise">Merchandise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judul Voucher / Reward
            </label>
            <input
              type="text"
              placeholder="Contoh: Diskon 25% Semua Minuman"
              value={voucherTitle}
              onChange={e => setVoucherTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Biaya Poin
              </label>
              <input
                type="number"
                min={20}
                max={5000}
                value={pointCost}
                onChange={e => setPointCost(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Stok Awal Voucher
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi &amp; Ketentuan
            </label>
            <textarea
              rows={2}
              placeholder="Berlaku untuk pemesanan dine-in maupun takeaway..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620]"
            >
              Simpan Mitra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
