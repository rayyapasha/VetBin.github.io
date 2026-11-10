import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusBin, WasteCategory, BinStatus } from '../../types';
import { X, Trash2 } from 'lucide-react';
import { KonfirmasiHapusModal } from './KonfirmasiHapusModal';

interface EditTongModalProps {
  bin: CampusBin | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTongModal: React.FC<EditTongModalProps> = ({ bin, isOpen, onClose }) => {
  const { updateBin, deleteBin } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<WasteCategory>('Anorganik');
  const [building, setBuilding] = useState('Gedung A');
  const [locationDetail, setLocationDetail] = useState('');
  const [capacityKg, setCapacityKg] = useState(40);
  const [status, setStatus] = useState<BinStatus>('Kosong');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (bin) {
      setName(bin.name);
      setCategory(bin.category);
      setBuilding(bin.building);
      setLocationDetail(bin.locationDetail);
      setCapacityKg(bin.capacityKg);
      setStatus(bin.status);
    }
  }, [bin]);

  if (!isOpen || !bin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBin(bin.id, {
      name,
      category,
      building,
      locationDetail,
      capacityKg,
      status
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Edit Titik Tong</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ubah data dan status tong sampah kampus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Titik Tong
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as WasteCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              >
                <option value="Anorganik">Anorganik</option>
                <option value="Organik">Organik</option>
                <option value="Kertas">Kertas</option>
                <option value="E-waste / Baterai">E-waste / Baterai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gedung / Area
              </label>
              <select
                value={building}
                onChange={e => setBuilding(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              >
                <option value="Kantin Kampus">Kantin Kampus</option>
                <option value="Indomaret Point">Indomaret Point</option>
                <option value="Gd. Jend. Sudirman (Rektorat)">Gd. Jend. Sudirman (Rektorat)</option>
                <option value="Gd. Dr. Moh. Yamin (FISIP)">Gd. Dr. Moh. Yamin (FISIP)</option>
                <option value="Gd. Dr. MH. Thamrin (FEB)">Gd. Dr. MH. Thamrin (FEB)</option>
                <option value="Gd. Dr. Soepomo (Fak. Ekonomi & Bisnis)">Gd. Dr. Soepomo (Fak. Ekonomi &amp; Bisnis)</option>
                <option value="Gd. Dr. Wahidin (Fak. Kedokteran)">Gd. Dr. Wahidin (Fak. Kedokteran)</option>
                <option value="Gd. Yos Sudarso (Fak. Hukum)">Gd. Yos Sudarso (Fak. Hukum)</option>
                <option value="Gd. Soetomo (Perpustakaan)">Gd. Soetomo (Perpustakaan)</option>
                <option value="Lapangan Utama">Lapangan Utama</option>
                <option value="Lapangan Basket">Lapangan Basket</option>
                <option value="Masjid Kampus">Masjid Kampus</option>
                <option value="Gd. Dewi Sartika (FIK)">Gd. Dewi Sartika (FIK)</option>
                <option value="Gd. Ki Hajar Dewantoro (FIK)">Gd. Ki Hajar Dewantoro (FIK)</option>
                <option value="Gd. RA. Kartini (Pusbabimkar)">Gd. RA. Kartini (Pusbabimkar)</option>
                <option value="Gd. Pratama">Gd. Pratama</option>
                <option value="Gd. Abd. Rahman Saleh">Gd. Abd. Rahman Saleh</option>
                <option value="Parkir Motor & Pos Masuk">Parkir Motor &amp; Pos Masuk</option>
                <option value="Taman Kampus">Taman Kampus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detail Lokasi
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={e => setLocationDetail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kapasitas (kg)
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={capacityKg}
                onChange={e => setCapacityKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status Saat Ini
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as BinStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              >
                <option value="Kosong">Kosong</option>
                <option value="Penuh">Penuh</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Titik Ini</span>
            </button>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs transition-all cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <KonfirmasiHapusModal
        isOpen={showConfirmDelete}
        title="Hapus Titik Tong?"
        itemName={bin.name}
        itemDetail={`${bin.building} · ${bin.locationDetail}`}
        itemBadge={bin.category}
        warningText="Titik tong ini dan status pemantauannya akan dihapus dari peta kampus. Kode QR yang terpasang pada tong tidak akan lagi dapat diakses pengguna."
        confirmLabel="Ya, Hapus Tong Ini"
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          deleteBin(bin.id);
          setShowConfirmDelete(false);
          onClose();
        }}
      />
    </div>
  );
};
