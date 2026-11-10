import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface KonfirmasiHapusModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemDetail?: string;
  itemBadge?: string;
  warningText?: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const KonfirmasiHapusModal: React.FC<KonfirmasiHapusModalProps> = ({
  isOpen,
  title,
  itemName,
  itemDetail,
  itemBadge,
  warningText = 'Tindakan ini tidak dapat dibatalkan. Data dan kode QR terkait akan dihapus secara permanen dari sistem.',
  confirmLabel = 'Ya, Hapus Sekarang',
  isSubmitting = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          aria-label="Tutup dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 id="confirm-delete-title" className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Konfirmasi tindakan penghapusan</p>
          </div>
        </div>

        {/* Item Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-sm text-slate-900">{itemName}</p>
              {itemDetail && <p className="text-xs text-slate-500 mt-0.5">{itemDetail}</p>}
            </div>
            {itemBadge && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 whitespace-nowrap">
                {itemBadge}
              </span>
            )}
          </div>
        </div>

        {/* Warning text */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{warningText}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Menghapus...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
