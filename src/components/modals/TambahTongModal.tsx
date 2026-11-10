import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, BinStatus } from '../../types';
import { X, QrCode } from 'lucide-react';

interface TambahTongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TambahTongModal: React.FC<TambahTongModalProps> = ({ isOpen, onClose }) => {
  const { addBin } = useApp();

  const [name, setName] = useState('Tong Anorganik Kantin Teras');
  const [category, setCategory] = useState<WasteCategory>('Anorganik');
  const [building, setBuilding] = useState('Kantin');
  const [locationDetail, setLocationDetail] = useState('Teras, dekat pintu masuk');
  const [capacityKg, setCapacityKg] = useState(40);
  const [status, setStatus] = useState<BinStatus>('Kosong');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Coordinate estimation based on building (always in open walkways)
    let coords = { x: 50, y: 50 };
    if (building.includes('Kantin')) coords = { x: 40, y: 76 };
    else if (building.includes('Sudirman')) coords = { x: 31, y: 53 };
    else if (building.includes('Thamrin')) coords = { x: 38, y: 25 };
    else if (building.includes('Wahidin')) coords = { x: 50, y: 54 };
    else if (building.includes('Lapangan')) coords = { x: 65, y: 55 };
    else if (building.includes('Masjid')) coords = { x: 72, y: 65 };
    else if (building.includes('Dewi Sartika')) coords = { x: 65, y: 85 };
    else if (building.includes('Yos Sudarso')) coords = { x: 74, y: 35 };
    else if (building.includes('Parkir')) coords = { x: 27, y: 65 };
    else if (building.includes('Pratama')) coords = { x: 23, y: 52 };
    else if (building.includes('Graha')) coords = { x: 6, y: 31 };

    addBin({
      name,
      category,
      building,
      locationDetail,
      capacityKg,
      status,
      lastEmptied: 'Hari ini',
      qrPrinted: false,
      coordinates: coords
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tambah titik tong</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Isi detail tong. QR Code dibuat otomatis setelah disimpan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Nama & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama titik tong
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tong Anorganik Kantin Teras"
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

          {/* Row 2: Gedung / area & Detail Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gedung / area
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
                Detail lokasi
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={e => setLocationDetail(e.target.value)}
                placeholder="Teras, dekat pintu masuk"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>
          </div>

          {/* Row 3: Kapasitas & Status awal */}
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
                Status awal
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

          {/* QR Notice Banner (exact Page 11 UI) */}
          <div className="p-3.5 rounded-2xl bg-[#F8F9F5] border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
            <QrCode className="w-5 h-5 text-[#234629] shrink-0" />
            <span>QR Code unik dibuat otomatis dan siap dicetak setelah titik tong disimpan.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs active:scale-[0.98] transition-all"
            >
              Simpan titik tong
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
