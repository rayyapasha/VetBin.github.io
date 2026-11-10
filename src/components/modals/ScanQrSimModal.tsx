import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, X, CheckCircle, Sparkles, MapPin } from 'lucide-react';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanQrSimModal: React.FC<ScanModalProps> = ({ isOpen, onClose }) => {
  const { bins, addPoints } = useApp();
  const [selectedBinId, setSelectedBinId] = useState(bins[0]?.id || '');
  const [wasteType, setWasteType] = useState('Botol anorganik');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    const targetBin = bins.find(b => b.id === selectedBinId);
    addPoints(30, targetBin?.category || wasteType);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8EFE8] text-[#234629] flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Pindai QR di Tong</h3>
            <p className="text-xs text-slate-500 mt-1">
              Simulasikan pemindaian QR sticker yang tertempel di tong sampah kampus untuk klaim poin reward.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Tong Sampah yang Dipindai:
                </label>
                <select
                  value={selectedBinId}
                  onChange={e => setSelectedBinId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#234629]"
                >
                  {bins.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.building} - {b.locationDetail.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jenis Sampah yang Kamu Buang:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Botol anorganik', 'Bungkus makanan', 'Kertas modul', 'Sisa makanan buah'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWasteType(type)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        wasteType === type
                          ? 'border-[#234629] bg-[#E8EFE8] text-[#234629] font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSimulateScan}
                className="flex-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs active:scale-[0.98] transition-all"
              >
                Klaim +30 Poin
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-[#234629]">+30 Poin Masuk!</h4>
            <p className="text-xs text-slate-600 mt-1">
              Sampahmu berhasil terdata di sistem VetBin. Terus memilah untuk kampus hijau!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
