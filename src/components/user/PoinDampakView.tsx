import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Wine,
  Package,
  Leaf,
  Gift,
  QrCode,
  CheckCircle,
  TrendingUp,
  User,
  Coffee,
  Printer,
  Sparkles
} from 'lucide-react';
import { CampusVoucher } from '../../types';

interface PoinDampakProps {
  onOpenScanModal: () => void;
  onOpenRedeemModal: (v: CampusVoucher) => void;
  onOpenKuponSaya: () => void;
}

export const PoinDampakView: React.FC<PoinDampakProps> = ({ onOpenScanModal, onOpenRedeemModal, onOpenKuponSaya }) => {
  const { userProfile, loginUser, vouchers, redemptions } = useApp();
  const [nimInput, setNimInput] = useState(userProfile.nimOrEmail);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nimInput.trim()) {
      loginUser(nimInput.trim());
    }
  };

  const getVoucherIcon = (category: string) => {
    if (category === 'Cetak') return <Printer className="w-5 h-5 text-[#92400E]" />;
    return <Coffee className="w-5 h-5 text-[#92400E]" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Section: Points & Personal Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Poin Reward */}
        <div className="lg:col-span-5 bg-[#234629] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-4">
              <Award className="w-3.5 h-3.5" />
              Poin reward
            </div>

            <p className="text-emerald-100/80 text-xs sm:text-sm">Poin kamu saat ini</p>
            <div className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-1 text-white">
              {userProfile.points.toLocaleString('id-ID')}
            </div>

            <p className="text-xs text-emerald-200/90 mt-4 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
              Tinggal 260 poin lagi untuk Voucher Kantin Rp25.000
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={onOpenScanModal}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#CA7426] hover:bg-[#b5641c] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-200" />
              <span>Pindai QR di tong</span>
            </button>
          </div>
        </div>

        {/* Right Card: Dampak Pribadimu */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A231C]">
              Dampak pribadimu bulan ini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manfaat yang terasa nyata setiap kali kamu memilah.
            </p>

            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/70 text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                  <Wine className="w-4 h-4" />
                </div>
                <span className="text-xl sm:text-3xl font-extrabold text-[#1A231C]">
                  {userProfile.bottlesCount}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-tight">
                  botol anorganik terpilah
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/70 text-center">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center mx-auto mb-2">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xl sm:text-3xl font-extrabold text-[#1A231C]">
                  {userProfile.foodWrappersCount}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-tight">
                  bungkus makanan terpilah
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200/70 text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-xl sm:text-3xl font-extrabold text-[#1A231C]">
                  {userProfile.organicKg} kg
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-tight">
                  sisa makanan organik
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs font-semibold text-[#92400E] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#CA7426] shrink-0" />
            <span>Kamu sudah memilah 22% lebih banyak dibanding bulan lalu.</span>
          </div>
        </div>
      </div>

      {/* Section: Tukar Poinmu */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1A231C]">Tukar poinmu</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Voucher kantin dan diskon cetak dari mitra kampus
            </p>
          </div>

          <button
            onClick={onOpenKuponSaya}
            className="self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#234629] bg-[#E8EFE8] hover:bg-[#dbe6db] border border-[#234629]/20 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Gift className="w-4 h-4 text-[#234629]" />
            <span>Kupon Saya ({redemptions.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.slice(7, 10).concat(vouchers.slice(0, 3)).slice(0, 3).map(voucher => (
            <div
              key={voucher.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {voucher.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{voucher.voucherTitle}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{voucher.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="font-extrabold text-sm sm:text-base text-[#92400E]">
                  {voucher.pointCost} poin
                </span>

                <button
                  onClick={() => onOpenRedeemModal(voucher)}
                  disabled={userProfile.points < voucher.pointCost || voucher.stock <= 0}
                  className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    userProfile.points >= voucher.pointCost && voucher.stock > 0
                      ? 'bg-[#234629] text-white hover:bg-[#1b3620] shadow-xs active:scale-[0.98]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {voucher.stock <= 0 ? 'Habis' : 'Tukar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Cara Dapat Poin & Login */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cara Dapat Poin */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4">Cara dapat poin</h3>
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#234629] font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <p>Pilah dan buang sampah di tong yang tepat</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#234629] font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <p>Pindai QR yang ada di tong tersebut</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8EFE8] text-[#234629] font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <p>Poin masuk, tukar dengan voucher kapan saja</p>
            </div>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-[#F8F9F5] rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Login hanya untuk fitur poin</h3>
            <p className="text-xs text-slate-500 mt-1">
              Peta, panduan pilah, dan laporan tetap bebas dipakai tanpa daftar, termasuk oleh tamu.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3">
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="NIM atau email kampus"
                value={nimInput}
                onChange={e => setNimInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234629]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#234629] hover:bg-[#1b3620] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              Masuk untuk menukar poin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
