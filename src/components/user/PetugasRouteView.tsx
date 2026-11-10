import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusMapCanvas } from '../common/CampusMapCanvas';
import {
  Truck,
  CheckCircle2,
  Navigation,
  Check,
  Wine,
  Utensils,
  FileText,
  BatteryCharging,
  ListFilter,
  Map,
  CheckCircle
} from 'lucide-react';
import { WasteCategory } from '../../types';

export const PetugasRouteView: React.FC = () => {
  const { bins, emptyBin } = useApp();
  const [emptiedCountToday, setEmptiedCountToday] = useState(12);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [selectedUrgentBinId, setSelectedUrgentBinId] = useState<string | null>(null);

  // Urgent bins needing cleaner action (Penuh / Rusak), sorted by distance
  const urgentBins = bins
    .filter(b => b.status === 'Penuh' || b.status === 'Rusak')
    .sort((a, b) => a.distanceM - b.distanceM);

  const getCategoryIcon = (category: WasteCategory) => {
    switch (category) {
      case 'Anorganik':
        return <Wine className="w-5 h-5 text-[#92400E]" />;
      case 'Organik':
        return <Utensils className="w-5 h-5 text-[#166534]" />;
      case 'Kertas':
        return <FileText className="w-5 h-5 text-[#1E40AF]" />;
      case 'E-waste / Baterai':
        return <BatteryCharging className="w-5 h-5 text-[#991B1B]" />;
    }
  };

  const getCategoryTheme = (cat: WasteCategory) => {
    switch (cat) {
      case 'Anorganik':
        return 'bg-[#FFFBEB] border-[#FDE68A]';
      case 'Organik':
        return 'bg-[#ECFDF5] border-[#A7F3D0]';
      case 'Kertas':
        return 'bg-[#EFF6FF] border-[#BFDBFE]';
      case 'E-waste / Baterai':
        return 'bg-[#FEF2F2] border-[#FECACA]';
    }
  };

  const handleEmpty = (binId: string) => {
    emptyBin(binId);
    setEmptiedCountToday(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE8] text-[#234629] text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5" />
            Petugas kebersihan · Shift pagi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A231C] tracking-tight">Rute pengosongan</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Tong penuh diurutkan dari yang terdekat dengan posisimu.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 self-start sm:self-auto shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Notifikasi terhubung ke WhatsApp</span>
        </div>
      </div>

      {/* Mobile Tab Switcher (matches PetaTongView) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 rounded-2xl mb-4">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'list' ? 'bg-white text-[#234629] shadow-xs' : 'text-slate-600'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Daftar Tugas ({urgentBins.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'map' ? 'bg-white text-[#234629] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Peta Rute Kampus</span>
        </button>
      </div>

      {/* Identical 5 / 7 Column Layout Structure matching PetaTongView */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Urgent Bins List & Stats (5 cols, h-[640px]) */}
        <div className={`lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-[640px] ${
          mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-xl sm:text-2xl font-extrabold text-[#1A231C]">{urgentBins.length}</span>
              <p className="text-[10px] text-slate-500 font-medium">Tong penuh</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
              <span className="text-xl sm:text-2xl font-extrabold text-[#166534]">{emptiedCountToday}</span>
              <p className="text-[10px] text-emerald-700 font-medium">Dikosongkan</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
              <span className="text-xl sm:text-2xl font-extrabold text-[#CA7426]">{Math.max(5, urgentBins.length * 4)}m</span>
              <p className="text-[10px] text-amber-800 font-medium">Estimasi rute</p>
            </div>
          </div>

          {/* Subheader */}
          <div className="my-3 flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800">
              Antrean Tong Perlu Tindakan ({urgentBins.length})
            </h3>
            <span className="text-[11px] text-slate-400">Urut terdekat</span>
          </div>

          {/* Scrollable Urgent Bins List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {urgentBins.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Semua Tong Bersih &amp; Kosong!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Tidak ada tong penuh atau rusak yang memerlukan tindakan saat ini.
                </p>
              </div>
            ) : (
              urgentBins.map((bin, index) => {
                const theme = getCategoryTheme(bin.category);
                const isSelected = (selectedUrgentBinId || urgentBins[0]?.id) === bin.id;
                return (
                  <div
                    key={bin.id}
                    onClick={() => {
                      setSelectedUrgentBinId(bin.id);
                      if (window.innerWidth < 1024) setMobileTab('map');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#234629] bg-[#F4F7F3] ring-1 ring-[#234629]/20 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Priority Badge */}
                      <div className="w-7 h-7 rounded-full bg-[#1A231C] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${theme}`}>
                        {getCategoryIcon(bin.category)}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {bin.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {bin.building} · {bin.locationDetail.split(',')[0]}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 font-bold">
                            {bin.status}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-medium">
                            {bin.distanceM} m
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmpty(bin.id);
                        }}
                        className="py-1.5 px-3 rounded-xl font-bold text-xs text-white bg-[#234629] hover:bg-[#1b3620] shadow-2xs active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Sudah dikosongkan
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom helper tip */}
          <div className="pt-3 border-t border-slate-100 mt-2 text-[11px] text-[#92400E] bg-[#FFFBEB] p-2.5 rounded-xl border border-[#FDE68A] flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-[#CA7426] shrink-0 mt-0.5" />
            <span>
              Tekan <strong>"Sudah dikosongkan"</strong> untuk mengembalikan status tong menjadi bersih.
            </span>
          </div>
        </div>

        {/* Right Column: Full CampusMapCanvas matching PetaTongView shape & height */}
        <div className={`lg:col-span-7 sticky top-24 ${
          mobileTab === 'list' ? 'hidden lg:block' : 'block'
        }`}>
          <CampusMapCanvas
            bins={bins}
            showRouteLine={true}
            routeBins={urgentBins}
            isCompact={false}
            selectedBinId={selectedUrgentBinId || urgentBins[0]?.id}
            onSelectBin={(b) => setSelectedUrgentBinId(b.id)}
          />
        </div>
      </div>
    </div>
  );
};
