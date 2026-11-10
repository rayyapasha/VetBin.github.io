import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CampusBin } from '../../types';
import { StatusBadge, CategoryPill } from './StatusBadge';
import { Printer, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QrCardProps {
  bin: CampusBin;
  onPrint?: (bin: CampusBin) => void;
}

export const QrCard: React.FC<QrCardProps> = ({ bin, onPrint }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { updateBin, showToast } = useApp();

  useEffect(() => {
    if (canvasRef.current) {
      // Encode deep link URL to open bin in VetBin
      const binUrl = `${window.location.origin}/?bin=${bin.id}&action=scan`;
      QRCode.toCanvas(
        canvasRef.current,
        binUrl,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#1A231C',
            light: '#FFFFFF'
          }
        },
        err => {
          if (err) console.error(err);
        }
      );
    }
  }, [bin.id]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QR-VetBin-${bin.name.replace(/\s+/g, '_')}-${bin.building}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    updateBin(bin.id, { qrPrinted: true });
    showToast('QR Berhasil Diunduh', `File PNG untuk ${bin.name} siap dicetak.`);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(bin);
    } else {
      updateBin(bin.id, { qrPrinted: true });
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex flex-col items-center">
        {/* QR Canvas */}
        <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-100 flex items-center justify-center mb-4">
          <canvas ref={canvasRef} className="rounded" />
        </div>

        {/* Info */}
        <div className="w-full text-left">
          <h4 className="font-semibold text-sm text-[#1A231C] leading-snug line-clamp-1">{bin.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{bin.building} · {bin.locationDetail.split(',')[0]}</p>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
            <CategoryPill category={bin.category} />
            <StatusBadge status={bin.qrPrinted ? 'Tercetak' : 'Belum dicetak'} size="sm" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-slate-600 hover:text-[#234629] font-medium py-1 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          Cetak
        </button>
        <button
          onClick={handleDownloadPng}
          className="flex items-center gap-1.5 text-slate-600 hover:text-[#234629] font-medium py-1 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Unduh PNG
        </button>
      </div>
    </div>
  );
};
