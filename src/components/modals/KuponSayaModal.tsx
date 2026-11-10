import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gift, Check, Copy, Tag, Calendar, Coffee, Printer, ShoppingBag } from 'lucide-react';

interface KuponSayaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KuponSayaModal: React.FC<KuponSayaModalProps> = ({ isOpen, onClose }) => {
  const { redemptions, vouchers } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-[#FEF3C7] text-[#92400E]">
            <Gift className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dompet Kupon Saya</h2>
            <p className="text-xs text-slate-500">Voucher hasil penukaran poin pilah sampah</p>
          </div>
        </div>

        <div className="mt-5 space-y-3.5">
          {redemptions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Belum ada voucher yang ditukar. Tukar poinmu di halaman Poin &amp; Dampak!
            </div>
          ) : (
            redemptions.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[#FAFBF9] border border-slate-200 shadow-2xs hover:border-[#234629]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
                      <Tag className="w-3 h-3" />
                      {r.partnerName}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{r.voucherTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Ditukar {r.timeAgoText} (-{r.pointsSpent} poin)</p>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Siap Pakai
                  </span>
                </div>

                {/* Voucher Code Box */}
                <div className="mt-3.5 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Kode Penukaran di Kasir:</p>
                    <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-[#1A231C]">
                      {r.redeemCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(r.id, r.redeemCode)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer"
                  >
                    {copiedId === r.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === r.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 italic">
                  *Tunjukkan layar ini atau sebutkan kode voucher di kasir mitra kampus.
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
