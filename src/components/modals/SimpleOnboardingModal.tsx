import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles, Award, ArrowRight, Check, X, Compass } from 'lucide-react';

interface SimpleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap?: () => void;
}

export const SimpleOnboardingModal: React.FC<SimpleOnboardingModalProps> = ({
  isOpen,
  onClose,
  onOpenMap,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Langkah 1 dari 3',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: MapPin,
      iconBg: 'bg-emerald-500 text-white',
      title: 'Peta Kampus & 20 Titik Tong Sampah',
      desc: 'Cari tong sampah terdekat di seluruh fakultas. Semua titik diletakkan di teras dan lobi gedung secara logis tanpa menghalangi jalan. Dilengkapi fitur zoom dan navigasi rute jalan kaki.',
      features: [
        'Warna kategori: Hijau (Organik), Kuning (Anorganik), Biru (Kertas), Merah (E-waste)',
        'Fitur Zoom & Pan untuk melihat denah gedung dan selasar secara detail',
        'Status tong terkini: Kosong, Penuh, atau Rusak'
      ]
    },
    {
      badge: 'Langkah 2 dari 3',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: Sparkles,
      iconBg: 'bg-blue-600 text-white',
      title: 'Pilah Cerdas dengan AI Scanner',
      desc: 'Ragu mana sampah yang bisa didaur ulang? Gunakan fitur Panduan Pilah untuk memindai foto sampah atau mengetik nama barang. AI VetBin akan memberitahu tong yang tepat dalam sekejap.',
      features: [
        'AI Scanner mendeteksi kemasan anorganik, kertas, sisa makanan, hingga e-waste',
        'Tips pemilahan cepat agar tong tidak cepat penuh dan tetap higienis',
        'Daftar referensi sampah kampus yang sering dijumpai'
      ]
    },
    {
      badge: 'Langkah 3 dari 3',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Award,
      iconBg: 'bg-amber-500 text-white',
      title: 'Lapor Kondisi Tong & Kumpulkan Poin',
      desc: 'Lihat tong yang meluap atau rusak? Kirim laporan cepat tanpa perlu login. Kumpulkan Poin Dampak dari partisipasi aktifmu dan tukarkan dengan voucher makan di Kantin Kampus!',
      features: [
        'Lapor tong penuh langsung terkirim ke jadwal rute petugas kebersihan',
        'Scan QR code di badan tong untuk mencatat kontribusi memilahmu',
        'Tukar poin dengan voucher diskon kantin, fotokopi, atau merchandise ramah lingkungan'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('vetbin_onboarded_v1', 'true');
    onClose();
    if (onOpenMap) onOpenMap();
  };

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#234629] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                Panduan Penggunaan VetBin
              </h3>
              <p className="text-xs text-slate-500">Peta &amp; Pemilahan Sampah Kampus</p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex-1">
          {/* Step Badge & Icon */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${current.badgeColor}`}>
              {current.badge}
            </span>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${current.iconBg}`}>
              <StepIcon className="w-6 h-6" />
            </div>
          </div>

          {/* Title & Description */}
          <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
            {current.desc}
          </p>

          {/* Bullet Points */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
            {current.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span className="leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-7 bg-[#234629]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ke langkah ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-3 pb-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button
            onClick={handleFinish}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Lewati
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Kembali
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#234629] hover:bg-[#1a351f] shadow-sm transition-all cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? 'Mulai Jelajah' : 'Lanjut'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
