import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusMapCanvas } from '../common/CampusMapCanvas';
import { StatusBadge, CategoryPill } from '../common/StatusBadge';
import { Search, AlertCircle, Navigation, Map, ListFilter, HelpCircle } from 'lucide-react';
import { CampusBin } from '../../types';

interface PetaTongProps {
  onOpenRouteNav: (bin: CampusBin) => void;
}

export const PetaTongView: React.FC<PetaTongProps> = ({ onOpenRouteNav }) => {
  const { bins, selectedBinId, setSelectedBinId, setUserTab, setTargetReportBinId, setIsOnboardingOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  const filterOptions = ['Semua', 'Organik', 'Anorganik', 'Kertas', 'E-waste / Baterai'];

  const filteredBins = useMemo(() => {
    return bins.filter(bin => {
      const matchFilter = selectedFilter === 'Semua' || bin.category === selectedFilter;
      const matchSearch =
        bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.locationDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    }).sort((a, b) => a.distanceM - b.distanceM);
  }, [bins, selectedFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Tab Switcher (solves mobile layout collision) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 rounded-2xl mb-4">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'list' ? 'bg-white text-[#234629] shadow-xs' : 'text-slate-600'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Daftar Tong ({filteredBins.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'map' ? 'bg-white text-[#234629] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Peta Kampus</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar List */}
        <div className={`lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-[640px] ${
          mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="mb-3.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A231C]">Tong Terdekat</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredBins.length} titik tong di seluruh kawasan kampus
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari gedung atau jenis sampah"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234629] focus:bg-white transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
            {filterOptions.map(filter => {
              const isSelected = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#234629] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Bins List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredBins.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs sm:text-sm">
                Tidak ada tong yang sesuai kriteria pencarian.
              </div>
            ) : (
              filteredBins.map(bin => {
                const isSelected = bin.id === selectedBinId;
                return (
                  <div
                    key={bin.id}
                    onClick={() => {
                      setSelectedBinId(bin.id);
                      if (window.innerWidth < 1024) setMobileTab('map');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#234629] bg-[#F4F7F3] shadow-xs ring-1 ring-[#234629]/20'
                        : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <CategoryPill category={bin.category} size="sm" showDot={true} />
                        <StatusBadge status={bin.status} size="sm" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                        {bin.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                        <span className="font-semibold text-slate-700">{bin.building}</span> · {bin.locationDetail.split(',')[0]}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-center">
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                        {bin.distanceM} m
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Button */}
          <div className="pt-4 border-t border-slate-100 mt-2">
            <button
              onClick={() => {
                setTargetReportBinId(selectedBinId || bins[0]?.id);
                setUserTab('lapor');
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#CA7426] hover:bg-[#b5641c] shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-amber-200" />
              <span>Lapor tong penuh / rusak</span>
            </button>
          </div>
        </div>

        {/* Right Map Canvas */}
        <div className={`lg:col-span-7 sticky top-24 ${
          mobileTab === 'list' ? 'hidden lg:block' : 'block'
        }`}>
          <CampusMapCanvas
            bins={filteredBins}
            selectedBinId={selectedBinId}
            onSelectBin={bin => setSelectedBinId(bin.id)}
            onOpenRouteNav={bin => onOpenRouteNav(bin)}
            isCompact={false}
          />
        </div>
      </div>
    </div>
  );
};
