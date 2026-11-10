import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { CampusBin } from '../../types';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { StatusBadge, CategoryPill } from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';

interface LembarCetakModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
}

const StickerQrItem: React.FC<{ bin: CampusBin }> = ({ bin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        `${window.location.origin}/?bin=${bin.id}&action=scan`,
        {
          width: 100,
          margin: 1,
          color: {
            dark: '#1A231C',
            light: '#FFFFFF'
          }
        }
      );
    }
  }, [bin.id]);

  let borderTheme = 'border-amber-300 bg-amber-50/40';
  let badgeColor = 'bg-amber-100 text-amber-800';
  if (bin.category === 'Organik') {
    borderTheme = 'border-emerald-300 bg-emerald-50/40';
    badgeColor = 'bg-emerald-100 text-emerald-800';
  } else if (bin.category === 'Kertas') {
    borderTheme = 'border-blue-300 bg-blue-50/40';
    badgeColor = 'bg-blue-100 text-blue-800';
  } else if (bin.category === 'E-waste / Baterai') {
    borderTheme = 'border-red-300 bg-red-50/40';
    badgeColor = 'bg-red-100 text-red-800';
  }

  return (
    <div className={`p-3.5 rounded-2xl border-2 ${borderTheme} flex items-center gap-3 bg-white shadow-2xs`}>
      <div className="p-1 bg-white border border-slate-200 rounded-xl shrink-0">
        <canvas ref={canvasRef} className="rounded" />
      </div>
      <div className="overflow-hidden">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {bin.category}
        </span>
        <h5 className="font-bold text-xs text-slate-900 mt-1 truncate">{bin.name}</h5>
        <p className="text-[11px] text-slate-500 truncate">{bin.building} · {bin.locationDetail.split(',')[0]}</p>
        <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {bin.id.toUpperCase()}</p>
      </div>
    </div>
  );
};

export const LembarCetakQrModal: React.FC<LembarCetakModalProps> = ({ isOpen, onClose, bins }) => {
  const { updateBin, showToast } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    bins.forEach(b => updateBin(b.id, { qrPrinted: true }));
    showToast('Mencetak Lembar Stiker', 'Semua stiker telah ditandai Tercetak.');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
        {/* Top modal header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pratinjau Lembar Stiker QR (A4 Sheet)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Format siap cetak stiker tempel fisik tong sampah kampus ({bins.length} stiker)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Stiker Sheet Grid */}
        <div className="flex-1 overflow-y-auto py-5 pr-1">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-700">VETBIN — LEMBAR STIKER RESMI KAMPUS</span>
              <span>STANDAR UKURAN STIKER: 90 x 55 mm</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {bins.map(bin => (
                <StickerQrItem key={bin.id} bin={bin} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
