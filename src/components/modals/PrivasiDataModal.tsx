import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Award, FileText } from 'lucide-react';

interface PrivasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivasiDataModal: React.FC<PrivasiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFE8] text-[#234629] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Transparansi &amp; Keamanan Data
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Kebijakan Privasi VetBin</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dirancang dengan prinsip privasi penuh untuk seluruh civitas akademika dan tamu kampus.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/80 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-[#234629] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Tanpa Wajib Daftar &amp; Pelacakan GPS Presisi</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Peta tong dan pelaporan dapat digunakan bebas tanpa membuat akun. Lokasi tong ditentukan dari titik scan QR fisik yang terpasang di dinding gedung, bukan dari pelacakan GPS latar belakang ponselmu.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/80 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#234629] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Penggunaan Foto Laporan</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Foto yang kamu unggah saat melapor tong penuh/rusak hanya digunakan oleh petugas kebersihan kampus untuk verifikasi fisik di lapangan, tidak disimpan untuk keperluan periklanan atau pihak ketiga.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/80 flex items-start gap-3">
            <Award className="w-5 h-5 text-[#234629] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Penyimpanan Poin &amp; NIM Mahasiswa</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                NIM atau email kampus hanya digunakan secara lokal saat kamu ingin menukarkan poin reward dengan voucher kantin. Data saldo tersimpan aman dan tidak dipublikasikan ke publik.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/80 flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#234629] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Keterbukaan Data Lingkungan (SDGs 12 &amp; 9)</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Data agregat volume sampah terpilah (kilogram) dan efisiensi pengosongan tong digunakan untuk laporan keberlanjutan kampus hijau tanpa menghubungkannya dengan identitas individu.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] transition-colors cursor-pointer"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
