import React from 'react';
import { CampusBin } from '../../types';
import { StatusBadge, CategoryPill } from '../common/StatusBadge';
import {
  X,
  Navigation,
  Footprints,
  Clock,
  Compass,
  Accessibility,
  ArrowRight,
  AlertCircle,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavigasiRuteModalProps {
  bin: CampusBin | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NavigasiRuteModal: React.FC<NavigasiRuteModalProps> = ({ bin, isOpen, onClose }) => {
  const { setUserTab, setTargetReportBinId } = useApp();

  if (!isOpen || !bin) return null;

  const walkingMinutes = Math.max(1, Math.round(bin.distanceM / 60));

  const steps = [
    {
      title: 'Mulai dari posisimu di Selasar Tengah Kampus',
      desc: 'Berdiri di persimpangan koridor antara Gd. MH. Thamrin dan Kantin Kampus.',
      distance: '0 m'
    },
    {
      title: `Berjalan lurus melewati koridor penghubung ke ${bin.building}`,
      desc: 'Ikuti jalur pejalan kaki berkanopi ramah cuaca dan bebas hambatan.',
      distance: `${Math.round(bin.distanceM * 0.45)} m`
    },
    {
      title: `Dekati area ${bin.locationDetail.split(',')[0]}`,
      desc: 'Perhatikan papan petunjuk arah hijau VetBin di dinding koridor.',
      distance: `${Math.round(bin.distanceM * 0.85)} m`
    },
    {
      title: `Tiba di ${bin.name}`,
      desc: `Tong ${bin.category} berwarna ${bin.category === 'Organik' ? 'Hijau' : bin.category === 'Kertas' ? 'Biru' : bin.category === 'E-waste / Baterai' ? 'Merah' : 'Kuning'} berada tepat di samping pintu masuk.`,
      distance: `${bin.distanceM} m`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-[#E8EFE8] text-[#234629]">
            <Navigation className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Rute Menuju Tong</h2>
            <p className="text-xs text-slate-500">Navigasi jalan kaki dalam kampus</p>
          </div>
        </div>

        {/* Bin Highlight Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-[#F8F9F5] border border-slate-200 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{bin.name}</h3>
              <StatusBadge status={bin.status} size="sm" />
            </div>
            <p className="text-xs text-slate-600">
              {bin.building} · {bin.locationDetail}
            </p>
            <div className="mt-2">
              <CategoryPill category={bin.category} />
            </div>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px]">
              <Footprints className="w-3.5 h-3.5" />
              <span>Jarak</span>
            </div>
            <p className="font-bold text-sm text-slate-800 mt-0.5">{bin.distanceM} m</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>Estimasi</span>
            </div>
            <p className="font-bold text-sm text-slate-800 mt-0.5">~{walkingMinutes} menit</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px]">
              <Accessibility className="w-3.5 h-3.5" />
              <span>Akses</span>
            </div>
            <p className="font-bold text-xs text-emerald-700 mt-0.5">Ramah Difabel</p>
          </div>
        </div>

        {/* Step by step route list */}
        <div className="mt-5 space-y-3">
          <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
            Panduan Jalur Jalan Kaki:
          </h4>

          <div className="space-y-3">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#234629] text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900">{st.title}</h5>
                    <span className="text-[11px] font-semibold text-slate-400">{st.distance}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setTargetReportBinId(bin.id);
              setUserTab('lapor');
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Lapor Kondisi Tong</span>
          </button>

          <button
            onClick={() => {
              setUserTab('panduan');
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#234629] hover:bg-[#1b3620] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Panduan Pilah Sampah</span>
          </button>
        </div>
      </div>
    </div>
  );
};
