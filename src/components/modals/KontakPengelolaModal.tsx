import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface KontakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KontakPengelolaModal: React.FC<KontakModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [kategori, setKategori] = useState('Saran Lokasi Tong Baru');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim()) return;
    setSubmitted(true);
    showToast('Pesan Terkirim ke Pengelola', 'Terima kasih atas masukanmu untuk kebersihan kampus!');
    setTimeout(() => {
      setSubmitted(false);
      setNama('');
      setPesan('');
      onClose();
    }, 1800);
  };

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
            <Phone className="w-3.5 h-3.5" />
            Layanan Sarana &amp; Kebersihan Kampus
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Kontak Pengelola Kampus</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hubungi posko kebersihan, lapor tumpukan sampah darurat, atau ajukan penambahan titik tong.
          </p>
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#F8F9F5] border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#234629] mb-1">
              <MessageSquare className="w-4 h-4" />
              <span className="font-bold text-xs">WhatsApp Hotline</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">+62 812-3456-7890</p>
            <p className="text-[11px] text-slate-500">Respon cepat petugas kebersihan</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9F5] border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#234629] mb-1">
              <Mail className="w-4 h-4" />
              <span className="font-bold text-xs">Email Pengelola</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">kebersihan@kampus.ac.id</p>
            <p className="text-[11px] text-slate-500">Subdit Pengelolaan Lingkungan</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9F5] border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <MapPin className="w-4 h-4 text-[#234629]" />
              <span className="font-bold text-xs">Posko Lapangan</span>
            </div>
            <p className="text-xs text-slate-800 font-medium">Gedung C, Lantai 1, R. Sarpras</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9F5] border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <Clock className="w-4 h-4 text-[#234629]" />
              <span className="font-bold text-xs">Jam Operasional</span>
            </div>
            <p className="text-xs text-slate-800 font-medium">Senin - Sabtu: 06.00 - 18.00 WIB</p>
          </div>
        </div>

        {/* Feedback form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Kirim Masukan Langsung ke Tim Sarpras:
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Pesan</label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#234629]"
              >
                <option value="Saran Lokasi Tong Baru">Saran Lokasi Tong Baru</option>
                <option value="Keluhan Bau / Tumpukan Sampah">Keluhan Bau / Tumpukan Sampah</option>
                <option value="Pengajuan Dropbox E-waste Lab">Pengajuan Dropbox E-waste Lab</option>
                <option value="Mitra Voucher Kantin Baru">Mitra Voucher Kantin Baru</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama / Identitas (Opsional)</label>
              <input
                type="text"
                placeholder="Mahasiswa / Tamu Kampus"
                value={nama}
                onChange={e => setNama(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#234629]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pesan / Masukan</label>
              <textarea
                rows={3}
                placeholder="Tuliskan lokasi spesifik atau saran untuk perbaikan tata kelola sampah kampus..."
                value={pesan}
                onChange={e => setPesan(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#234629]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Pesan ke Pengelola</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
            <h4 className="font-bold text-base text-slate-900">Pesan Berhasil Dikirim!</h4>
            <p className="text-xs text-slate-500 mt-1">Tim Sarpras akan menindaklanjuti masukanmu.</p>
          </div>
        )}
      </div>
    </div>
  );
};
