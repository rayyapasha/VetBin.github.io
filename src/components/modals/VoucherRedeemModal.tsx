import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusVoucher } from '../../types';
import { Gift, X, CheckCircle2, Copy, Check } from 'lucide-react';

interface VoucherRedeemModalProps {
  voucher: CampusVoucher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherRedeemModal: React.FC<VoucherRedeemModalProps> = ({ voucher, isOpen, onClose }) => {
  const { userProfile, redeemVoucher } = useApp();
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !voucher) return null;

  const handleRedeem = () => {
    const res = redeemVoucher(voucher.id);
    if (res.success && res.code) {
      setIssuedCode(res.code);
    }
  };

  const handleCopy = () => {
    if (issuedCode) {
      navigator.clipboard.writeText(issuedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setIssuedCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!issuedCode ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mb-4">
              <Gift className="w-6 h-6" />
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {voucher.category} · {voucher.partnerName}
            </span>

            <h3 className="text-xl font-bold text-slate-900 mt-2">{voucher.voucherTitle}</h3>
            <p className="text-xs text-slate-600 mt-1">{voucher.description}</p>

            <div className="mt-5 p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Biaya Poin:</span>
                <span className="font-bold text-[#92400E]">{voucher.pointCost} poin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poin Kamu Saat Ini:</span>
                <span className="font-semibold text-slate-800">{userProfile.points} poin</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">Sisa Poin Setelah Tukar:</span>
                <span className="font-bold text-slate-900">{userProfile.points - voucher.pointCost} poin</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRedeem}
                disabled={userProfile.points < voucher.pointCost}
                className="flex-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Konfirmasi Tukar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Penukaran Berhasil!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tunjukkan kode ini ke kasir <strong>{voucher.partnerName}</strong> saat memesan.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <span className="font-mono text-base font-extrabold tracking-wider text-slate-800">
                {issuedCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full mt-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1b3620]"
            >
              Tutup &amp; Gunakan Nanti
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
