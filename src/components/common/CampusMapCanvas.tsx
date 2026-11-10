import React, { useState, useRef, useCallback } from 'react';
import { CampusBin, WasteCategory } from '../../types';
import { StatusBadge } from './StatusBadge';
import {
  Navigation2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LocateFixed,
  Layers,
  X,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CampusMapProps {
  bins: CampusBin[];
  selectedBinId?: string | null;
  onSelectBin?: (bin: CampusBin) => void;
  onOpenRouteNav?: (bin: CampusBin) => void;
  showRouteLine?: boolean;
  routeBins?: CampusBin[];
  isCompact?: boolean;
  isSimplified?: boolean;
  showUserPosition?: boolean;
}

export const CampusMapCanvas: React.FC<CampusMapProps> = ({
  bins,
  selectedBinId,
  onSelectBin,
  onOpenRouteNav,
  showRouteLine = false,
  routeBins = [],
  isCompact = false,
  isSimplified = false,
  showUserPosition = true,
}) => {
  const { setUserTab, setTargetReportBinId } = useApp();
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Zoom & Pan Interactive State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showLegend, setShowLegend] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // User position at central corridor walkway (in front of Wahidin & Soetomo)
  const userPos = { x: 35, y: 52 };

  const getPinColor = (cat: WasteCategory | string) => {
    switch (cat) {
      case 'Anorganik':
        return '#F59E0B'; // Amber
      case 'Organik':
        return '#16A34A'; // Green
      case 'Kertas':
        return '#2563EB'; // Blue
      case 'E-waste / Baterai':
        return '#DC2626'; // Red
      default:
        return '#F59E0B';
    }
  };

  // If simplified mode (for Beranda preview), show a curated clean set of pins without overwhelming the card
  const displayBins = isSimplified
    ? bins.filter(b => ['bin-1', 'bin-3', 'bin-8', 'bin-9', 'bin-14'].includes(b.id))
    : bins;

  const selectedBin = displayBins.find(b => b.id === selectedBinId);

  // Zoom Handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCenterOnUser = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetZoom = Math.max(zoom, 1.4);
    setZoom(targetZoom);

    const targetX = (0.5 - userPos.x / 100) * rect.width * targetZoom;
    const targetY = (0.5 - userPos.y / 100) * rect.height * targetZoom;

    const maxPanX = (rect.width * (targetZoom - 1)) / 1.8;
    const maxPanY = (rect.height * (targetZoom - 1)) / 1.8;

    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, targetX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, targetY)),
    });
  };

  // Drag / Pan mouse & touch interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxPanX = (rect.width * (zoom - 1)) / 1.8 + (zoom > 1 ? 40 : 0);
    const maxPanY = (rect.height * (zoom - 1)) / 1.8 + (zoom > 1 ? 40 : 0);

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    if (zoom > 1) {
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxPanX = (rect.width * (zoom - 1)) / 1.8 + 30;
    const maxPanY = (rect.height * (zoom - 1)) / 1.8 + 30;

    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;

    if (zoom > 1) {
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || isCompact) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  // Double click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.bin-pin')) {
      return;
    }
    if (zoom > 1) {
      handleResetView();
    } else {
      setZoom(1.5);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }}
      className={`relative w-full overflow-hidden rounded-3xl bg-[#FCFDFB] border-2 border-slate-300 shadow-sm select-none transition-shadow ${
        isCompact ? 'h-72 sm:h-92' : 'h-[460px] sm:h-[580px] lg:h-[720px]'
      } ${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'}`}
    >
      {/* ========================================================
          ZOOM & PAN CONTROLS (Top Left Floating Toolbar)
         ======================================================== */}
      {!isSimplified && (
        <div className="absolute top-3 left-3 z-40 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-200 shadow-md">
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2.5}
            title="Perbesar peta (+)"
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-bold text-slate-700 px-1 min-w-[36px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            title="Perkecil peta (-)"
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />

          <button
            onClick={handleResetView}
            title="Reset tampilan (100%)"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {showUserPosition && (
            <button
              onClick={handleCenterOnUser}
              title="Pusatkan ke Posisiku"
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#234629] text-[11px] font-bold transition-colors cursor-pointer"
            >
              <LocateFixed className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Posisiku</span>
            </button>
          )}
        </div>
      )}

      {/* Top Right: Toggleable Clean Legend (Never Blocks Buildings) */}
      {!isSimplified && (
        <div className="absolute top-3 right-3 z-40 flex flex-col items-end">
          <button
            onClick={() => setShowLegend(prev => !prev)}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 shadow-md text-slate-700 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#234629]" />
            <span>Legenda ({bins.length} Tong)</span>
          </button>

          {showLegend && (
            <div className="mt-2 w-60 sm:w-68 bg-white/98 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-200 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-extrabold text-slate-800">Kategori Tong Sampah</span>
                <button
                  onClick={() => setShowLegend(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
                    <span>Organik (Kantin &amp; Taman)</span>
                  </div>
                  <span className="font-bold text-slate-500">
                    {bins.filter(b => b.category === 'Organik').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                    <span>Anorganik</span>
                  </div>
                  <span className="font-bold text-slate-500">
                    {bins.filter(b => b.category === 'Anorganik').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0" />
                    <span>Kertas / Modul Mahasiswa</span>
                  </div>
                  <span className="font-bold text-slate-500">
                    {bins.filter(b => b.category === 'Kertas').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shrink-0" />
                    <span>E-waste / Baterai Lab</span>
                  </div>
                  <span className="font-bold text-slate-500">
                    {bins.filter(b => b.category === 'E-waste / Baterai').length}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-[#FEF3C7] border border-[#D97706] shrink-0" />
                    <span>Kantin Kampus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs border border-slate-400 shrink-0" style={{ background: 'repeating-linear-gradient(45deg, #FFF, #FFF 2px, #CBD5E1 2px, #CBD5E1 4px)' }} />
                    <span>Area Parkir Kampus</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zoom Drag Hint Badge (Shows when zoomed in) */}
      {zoom > 1 && (
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none bg-slate-900/80 text-white text-[10px] sm:text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Geser peta untuk menjelajah</span>
        </div>
      )}

      {/* ========================================================
          TRANSFORMED MAP LAYER (Scales & Pans Smoothly)
         ======================================================== */}
      <div
        className="absolute inset-0 w-full h-full origin-center transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      >
        {/* SVG Perimeter Walls & Pedestrian Dashed Corridors (Exact Blueprint) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* 1. Outer Campus Boundary Wall Lines (Matches Sketch) */}
          <path
            d="
              M 4,12
              L 12,12
              L 12,3
              L 14,3
              L 14,2
              L 49.5,2
              L 49.5,9
              L 53,9
              L 53,10
              L 94,10
              L 94,23
              L 99,23
              L 99,28
              L 98,28
              L 98,75
              L 83,75
              L 83,92
              L 26,92
              L 26,96
              L 4,96
              L 4,53
              L 2.5,53
              L 2.5,49
              L 4,49
              L 4,17
              L 2.5,17
              L 2.5,13
              L 4,13
              Z
            "
            fill="#F8FAF7"
            stroke="#64748B"
            strokeWidth="0.45"
            strokeLinejoin="round"
          />

          {/* 2. Walkway Dashed Lines (Passing around buildings, never cutting through) */}
          {/* West Gate to Central Area Corridor */}
          <line x1="8" y1="15" x2="11.5" y2="15" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />
          <line x1="8" y1="51" x2="11.5" y2="51" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />
          <line x1="9" y1="23" x2="9" y2="45" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* North Path above Thamrin & between Yamin and Thamrin */}
          <line x1="14" y1="16" x2="49.5" y2="16" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Path between Soepomo and Wahidin */}
          <line x1="34" y1="31" x2="34" y2="46" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Central Arterial East-West Walkway (Clear corridor below Sudirman/Wahidin/Lapangan/FT) */}
          <line x1="12.5" y1="52" x2="26" y2="52" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.8 1.2" />
          <line x1="28" y1="52" x2="49.5" y2="52" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.8 1.2" />
          <line x1="53.5" y1="52" x2="70" y2="52" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.8 1.2" />
          <line x1="72" y1="52" x2="96.5" y2="52" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.8 1.2" />

          {/* Path between Wahidin and Lapangan */}
          <line x1="52.5" y1="29" x2="52.5" y2="47" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Path above Lapangan */}
          <line x1="55" y1="23.5" x2="69" y2="23.5" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Path between Lapangan and FT Yos Sudarso */}
          <line x1="71" y1="28" x2="71" y2="47" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Path leading to Gerbang Timur Atas & Parkir Timur */}
          <line x1="71.5" y1="25" x2="96.5" y2="25" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.5 1" />
          <line x1="86" y1="26" x2="86" y2="46" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Path beside Kantin */}
          <line x1="45" y1="76" x2="45" y2="88" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Indikator jalanan antara Pos Keamanan & Gd. Pratama menuju Kantin Vertikal */}
          <line x1="14" y1="56" x2="14" y2="74" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.6 1" />
          <line x1="14" y1="74" x2="45" y2="74" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.6 1" />
          <line x1="45" y1="74" x2="45" y2="89" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="1.6 1" />

          {/* Path between Soetomo, Lap. Basket, and Masjid */}
          <line x1="63.5" y1="58" x2="63.5" y2="73" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />
          <line x1="71" y1="58" x2="71" y2="73" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />
          <line x1="80.5" y1="58" x2="80.5" y2="73" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Walkway in front of Dewi Sartika */}
          <line x1="64" y1="76" x2="82" y2="76" stroke="#3B82F6" strokeWidth="0.45" strokeDasharray="1.2 0.9" />

          {/* Route line for cleaners if enabled */}
          {showRouteLine && routeBins.length > 1 && (
            <polyline
              points={routeBins.map(b => `${b.coordinates.x},${b.coordinates.y}`).join(' ')}
              fill="none"
              stroke="#CA7426"
              strokeWidth="0.8"
              strokeDasharray="2 1.2"
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* ========================================================
            BUILDINGS & FACILITIES (EXACT TO BLUEPRINT SKETCH)
           ======================================================== */}

        {/* 1. POS KEAMANAN 1 (Atas Kiri) */}
        <div
          className="absolute top-[3.5%] left-[4.5%] w-[6.5%] h-[6%] bg-white rounded-md border border-slate-400 flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 shadow-2xs"
          title="Pos Keamanan Gerbang Keluar"
        >
          <span className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-slate-700 leading-none">
            POS
          </span>
          <span className="text-[5px] sm:text-[6px] font-medium text-slate-500">
            KEAMANAN
          </span>
        </div>

        {/* PINTU KELUAR */}
        <div className="absolute top-[13.5%] left-[4%] px-1.5 py-0.5 bg-slate-800 text-white text-[6px] sm:text-[8px] font-bold rounded-sm pointer-events-none z-10 shadow-2xs">
          Pintu Keluar ←
        </div>

        {/* 2. GD. JEND. SUDIRMAN (REKTORAT & AULA) (Blue Box) */}
        <div
          className="absolute top-[18%] left-[12.5%] w-[11%] h-[32%] bg-[#B8D7F9] rounded-lg border-2 border-[#3B82F6] shadow-xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Jend. Sudirman (Rektorat & Aula Utama)"
        >
          <span className="text-[8px] sm:text-[10px] md:text-[11px] font-black text-blue-950 leading-tight">
            Gd. JEND. SUDIRMAN
          </span>
          <span className="text-[7px] sm:text-[8px] text-blue-900 font-bold mt-1">
            (REKTORAT &amp; AULA)
          </span>
        </div>

        {/* PINTU MASUK */}
        <div className="absolute top-[49.5%] left-[4%] px-1.5 py-0.5 bg-emerald-800 text-white text-[6px] sm:text-[8px] font-bold rounded-sm pointer-events-none z-10 shadow-2xs">
          Pintu Masuk →
        </div>

        {/* POS KEAMANAN 2 (Bawah Kiri) */}
        <div
          className="absolute top-[55.5%] left-[4.5%] w-[6%] h-[5.5%] bg-white rounded-md border border-slate-400 flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 shadow-2xs"
          title="Pos Keamanan Gerbang Masuk"
        >
          <span className="text-[6px] sm:text-[7px] font-bold text-slate-700 leading-none">
            POS
          </span>
          <span className="text-[5px] sm:text-[6px] font-medium text-slate-500">
            KEAMANAN
          </span>
        </div>

        {/* 4. GD. DR. SOEPOMO (FAK. EKONOMI & BISNIS) (Vertical White Box) */}
        <div
          className="absolute top-[28%] left-[24.5%] w-[8%] h-[21%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Dr. Soepomo (Fakultas Ekonomi & Bisnis)"
        >
          <span className="text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-bold text-slate-900 leading-tight">
            GD. DR.
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-bold text-slate-900 leading-tight">
            SOEPOMO
          </span>
          <span className="text-[5.5px] sm:text-[6.5px] text-slate-600 font-semibold mt-0.5 leading-tight text-center">
            (FEB)
          </span>
        </div>

        {/* 5. GD. DR. MOH. YAMIN (FISIP) (Wider Top Blue Box - Extended Left to Avoid Empty Space) */}
        <div
          className="absolute top-[3%] left-[14%] w-[35.5%] h-[11%] bg-[#B8D7F9] rounded-md border-2 border-[#3B82F6] shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Dr. Moh. Yamin (Fakultas Ilmu Sosial & Ilmu Politik - FISIP)"
        >
          <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-blue-950 leading-tight">
            GD. DR. MOH. YAMIN
          </span>
          <span className="text-[7px] sm:text-[8px] md:text-[9px] text-blue-900 font-bold mt-0.5">
            (FAK. ILMU SOSIAL &amp; ILMU POLITIK - FISIP)
          </span>
        </div>

        {/* 6. GD. DR. MH. THAMRIN (FAK. EKONOMI & BISNIS) (Horizontal White Box) */}
        <div
          className="absolute top-[18%] left-[27%] w-[22.5%] h-[8.5%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Dr. MH. Thamrin (Fakultas Ekonomi & Bisnis)"
        >
          <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-slate-900 leading-tight">
            GD. DR. MH. THAMRIN
          </span>
          <span className="text-[6px] sm:text-[7px] text-slate-600 font-medium mt-0.5">
            (FAK. EKONOMI &amp; BISNIS)
          </span>
        </div>

        {/* 7. GD. DR. WAHIDIN SUDIRO HUSODO (FAK. KEDOKTERAN) (Central Blue Box) */}
        <div
          className="absolute top-[29%] left-[37.5%] w-[12%] h-[19%] bg-[#B8D7F9] rounded-lg border-2 border-[#3B82F6] shadow-xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Dr. Wahidin Sudiro Husodo (Fakultas Kedokteran)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-blue-950 leading-tight text-center">
            GD. DR. WAHIDIN
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] md:text-[8px] font-black text-blue-950 leading-tight text-center">
            SUDIRO HUSODO
          </span>
          <span className="text-[6px] sm:text-[7px] text-blue-900 font-bold mt-0.5 text-center leading-tight">
            (FAK. KEDOKTERAN)
          </span>
        </div>

        {/* 8. GD. ABD. RAHMAN SALEH (Upper Blue Box) */}
        <div
          className="absolute top-[11%] left-[56%] w-[18%] h-[8%] bg-[#B8D7F9] rounded-md border-2 border-[#3B82F6] shadow-2xs flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Abd. Rahman Saleh (Lab Riset Terpadu)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-blue-950 leading-tight">
            Gd. Abd. Rahman Saleh
          </span>
          <span className="text-[6px] sm:text-[7px] text-blue-800 font-semibold mt-0.5">
            (Lab Riset Terpadu)
          </span>
        </div>

        {/* 9. GEDUNG CIPTO MANGUNKUSUMO (Upper Right Blue Box) */}
        <div
          className="absolute top-[11%] left-[75.5%] w-[17.5%] h-[11%] bg-[#B8D7F9] rounded-md border-2 border-[#3B82F6] shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gedung Cipto Mangunkusumo (Lab Skill Fak. Kedokteran)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-blue-950 leading-tight">
            Gd. Cipto Mangunkusumo
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] text-blue-900 font-bold mt-0.5 leading-tight">
            LAB SKILL FAK. KEDOKTERAN
          </span>
        </div>

        {/* 10. LAPANGAN (Center Right Large Open Box) */}
        <div
          className="absolute top-[27%] left-[55%] w-[14%] h-[19%] bg-[#F0FDF4] rounded-md border border-[#86EFAC] shadow-inner flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Lapangan Kampus (Upacara & Olahraga)"
        >
          <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-emerald-950 tracking-wider">
            LAPANGAN
          </span>
        </div>

        {/* 11. GD. YOS SUDARSO (FAKULTAS HUKUM) (Blue Box) */}
        <div
          className="absolute top-[28%] left-[73.5%] w-[11.5%] h-[17%] bg-[#B8D7F9] rounded-lg border-2 border-[#3B82F6] shadow-xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Yos Sudarso (Fakultas Hukum)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-blue-950 leading-tight">
            GD. YOS SUDARSO
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] text-blue-900 font-bold mt-1">
            (FAKULTAS HUKUM)
          </span>
        </div>

        {/* PARKIR TIMUR (Sebelah Kanan GD. Yos Sudarso) */}
        <div
          className="absolute top-[28%] left-[86.5%] w-[9.5%] h-[17%] rounded-md border border-slate-400 flex flex-col items-center justify-center p-1 pointer-events-none z-10 overflow-hidden shadow-2xs"
          style={{
            background: 'repeating-linear-gradient(45deg, #FFFFFF, #FFFFFF 5px, #CBD5E1 5px, #CBD5E1 10px)'
          }}
          title="Area Parkir Timur (Dosen & Mahasiswa Fakultas Hukum)"
        >
          <div className="bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-400 text-center shadow-2xs">
            <span className="text-[6.5px] sm:text-[7.5px] font-black text-slate-800 block leading-tight">
              PARKIR
            </span>
            <span className="text-[6px] sm:text-[7px] font-bold text-slate-700 block leading-tight">
              TIMUR
            </span>
          </div>
        </div>

        {/* GERBANG TIMUR UTAMA */}
        <div className="absolute top-[23%] right-[1%] px-1.5 py-0.5 bg-slate-800 text-white text-[6px] sm:text-[8px] font-bold rounded-sm pointer-events-none z-10 shadow-2xs">
          Gerbang →
        </div>

        {/* 12. GD. PRATAMA (Pindah ke sebelah kiri GD. RA. Kartini) */}
        <div
          className="absolute top-[56%] left-[18%] w-[10%] h-[9%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Pratama Kampus"
        >
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-black text-slate-900 leading-tight">
            GD. PRATAMA
          </span>
        </div>

        {/* 13. GD. RA. KARTINI (Horizontal White Box) */}
        <div
          className="absolute top-[56%] left-[29.5%] w-[23%] h-[9%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. RA. Kartini (Pusbabimkar & Pascasarjana FEB)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-slate-900 leading-tight">
            GD. RA. KARTINI
          </span>
          <span className="text-[5.5px] sm:text-[6.5px] md:text-[7px] text-slate-600 font-medium mt-0.5">
            (PUSBABIMKAR &amp; PASCASARJANA FEB)
          </span>
        </div>

        {/* 14. INDOMARET (Di samping kiri Kantin Utama) */}
        <div
          className="absolute top-[67%] left-[29.5%] w-[8.5%] h-[8.5%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Indomaret Point Kampus"
        >
          <div className="flex items-center justify-center gap-0.5 leading-none">
            <span className="text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-black text-blue-700 tracking-tight">INDO</span>
            <span className="text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-black text-red-600 tracking-tight">MARET</span>
          </div>
          <span className="text-[5px] sm:text-[5.5px] font-bold text-amber-700 bg-amber-50 px-1 rounded mt-0.5 border border-amber-200">
            MINIMARKET
          </span>
        </div>

        {/* 15. KANTIN (Horizontal) */}
        <div
          className="absolute top-[67%] left-[39.5%] w-[13.5%] h-[8.5%] bg-[#FEF3C7] rounded-md border border-[#D97706] shadow-2xs flex items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Kantin Kampus"
        >
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-black text-amber-950">
            KANTIN
          </span>
        </div>

        {/* 16. KANTIN (Vertikal) */}
        <div
          className="absolute top-[76.5%] left-[46.5%] w-[6.5%] h-[12.5%] bg-[#FEF3C7] rounded-md border border-[#D97706] shadow-2xs flex items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Kantin Kampus"
        >
          <span className="text-[6.5px] sm:text-[7.5px] md:text-[8px] font-black text-amber-950">
            KANTIN
          </span>
        </div>

        {/* 16b. AREA PARKIR BARAT (Di sebelah kiri Kantin Vertikal sampai Border Peta Bawah) */}
        <div
          className="absolute top-[76.5%] left-[28.5%] w-[16.5%] h-[18.5%] rounded-md border border-slate-400 flex flex-col items-center justify-center p-1 pointer-events-none z-10 overflow-hidden shadow-2xs"
          style={{
            background: 'repeating-linear-gradient(45deg, #FFFFFF, #FFFFFF 5px, #CBD5E1 5px, #CBD5E1 10px)'
          }}
          title="Area Parkir Barat (Sebelah Kiri Kantin Vertikal sampai Border Peta)"
        >
          <div className="bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-400 text-center shadow-2xs">
            <span className="text-[6.5px] sm:text-[7.5px] font-black text-slate-800 block leading-tight">
              PARKIR BARAT
            </span>
            <span className="text-[5.5px] sm:text-[6.5px] font-bold text-slate-600 block leading-tight">
              MOTOR &amp; MOBIL
            </span>
          </div>
        </div>

        {/* 16c. AREA PARKIR BARAT SUDUT (Sudut Barat Bawah sampai Border Peta) */}
        <div
          className="absolute top-[76.5%] left-[4.5%] w-[22%] h-[18.5%] rounded-md border border-slate-400 flex flex-col items-center justify-center p-1 pointer-events-none z-10 overflow-hidden shadow-2xs"
          style={{
            background: 'repeating-linear-gradient(45deg, #FFFFFF, #FFFFFF 5px, #CBD5E1 5px, #CBD5E1 10px)'
          }}
          title="Area Parkir Barat (Sudut Bawah Barat sampai Border Peta)"
        >
          <div className="bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-400 text-center shadow-2xs">
            <span className="text-[6.5px] sm:text-[7.5px] font-black text-slate-800 block leading-tight">
              PARKIR BARAT
            </span>
            <span className="text-[5.5px] sm:text-[6.5px] font-bold text-slate-600 block leading-tight">
              (POS MASUK)
            </span>
          </div>
        </div>

        {/* 17. GD. SOETOMO (PERPUSTAKAAN) (Lebar cukup agar teks PERPUSTAKAAN tidak terpotong) */}
        <div
          className="absolute top-[56%] left-[53.5%] w-[10%] h-[33%] bg-[#B8D7F9] rounded-lg border-2 border-[#3B82F6] shadow-xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Soetomo (Perpustakaan Pusat Kampus)"
        >
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-black text-blue-950 leading-tight text-center">
            GD. SOETOMO
          </span>
          <span className="text-[6px] sm:text-[7px] md:text-[7.5px] text-blue-900 font-bold mt-1 text-center leading-tight tracking-tight px-0.5">
            (PERPUSTAKAAN)
          </span>
        </div>

        {/* 18. LAPANGAN BASKET (Soft Orange Vertical Box) */}
        <div
          className="absolute top-[56%] left-[64%] w-[6%] h-[16%] bg-[#FFEDD5] rounded-md border border-[#FB923C] shadow-2xs flex flex-col items-center justify-center p-0.5 text-center pointer-events-none z-10 overflow-hidden"
          title="Lapangan Basket Kampus"
        >
          <span className="text-[6.5px] sm:text-[7.5px] font-bold text-orange-950 leading-tight">
            Lap.
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] font-bold text-orange-950 leading-tight mt-0.5">
            Basket
          </span>
        </div>

        {/* 19. MASJID (Hanya Tulisan Sesuai Permintaan) */}
        <div
          className="absolute top-[56%] left-[71.5%] w-[7.5%] h-[16%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Masjid Kampus"
        >
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-bold text-slate-900 leading-tight">
            MASJID
          </span>
        </div>

        {/* PINTU KELUAR MENUJU KANAN DI ATAS GD. DR. KI HAJAR */}
        <div className="absolute top-[50%] left-[82.5%] px-2 py-0.5 bg-slate-800 text-white text-[6.5px] sm:text-[7.5px] md:text-[8px] font-bold rounded-sm pointer-events-none z-10 shadow-2xs flex items-center gap-1 border border-slate-700">
          <span>Pintu Keluar</span>
          <span>→</span>
        </div>

        {/* 20. GD. DR. KI HAJAR DEWANTORO (FAK. ILMU KOMPUTER 1) */}
        <div
          className="absolute top-[56%] left-[81%] w-[13.5%] h-[16%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Dr. Ki Hajar Dewantoro (Fak. Ilmu Komputer)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-slate-900 leading-tight">
            GD. DR. KI HAJAR DEWANTORO
          </span>
          <span className="text-[6px] sm:text-[7px] text-slate-600 font-medium mt-0.5">
            (FAK. ILMU KOMPUTER)
          </span>
        </div>

        {/* 21. GD. DEWI SARTIKA (FAK. ILMU KOMPUTER 2) (Bottom White Box) */}
        <div
          className="absolute top-[78%] left-[66%] w-[16%] h-[12%] bg-white rounded-md border border-slate-400 shadow-2xs flex flex-col items-center justify-center p-1 text-center pointer-events-none z-10 overflow-hidden"
          title="Gd. Dewi Sartika (Fak. Ilmu Komputer 2)"
        >
          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-slate-900 leading-tight">
            GD. DEWI SARTIKA
          </span>
          <span className="text-[6px] sm:text-[7px] text-slate-600 font-medium mt-0.5">
            (FAK. ILMU KOMPUTER)
          </span>
        </div>

        {/* ========================================================
            USER POSITION INDICATOR ("Anda di sini")
           ======================================================== */}
        {showUserPosition && (
          <div
            className="absolute z-25 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-7 h-7 rounded-full bg-blue-500/30 animate-ping" />
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md z-10" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-full bg-[#1A231C]/90 text-white text-[7px] sm:text-[9px] font-semibold whitespace-nowrap shadow-sm backdrop-blur-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Anda di sini
            </span>
          </div>
        )}

        {/* ========================================================
            RENDER BINS PINS (Positioned LOGICALLY on building walls/porches, NOT in the middle of roads)
           ======================================================== */}
        {displayBins.map((bin) => {
          const isSelected = bin.id === selectedBinId;
          const isHovered = bin.id === activeHoverId;
          const color = getPinColor(bin.category);
          const routeIdx = routeBins.findIndex(rb => rb.id === bin.id);

          return (
            <div
              key={bin.id}
              className={`bin-pin absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                isSelected ? 'scale-125 z-40' : 'hover:scale-120'
              }`}
              style={{ left: `${bin.coordinates.x}%`, top: `${bin.coordinates.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBin && onSelectBin(bin);
              }}
              onMouseEnter={() => setActiveHoverId(bin.id)}
              onMouseLeave={() => setActiveHoverId(null)}
            >
              {/* Numbered badge if in cleaner route mode */}
              {showRouteLine && routeIdx !== -1 ? (
                <div className="relative flex items-center justify-center">
                  <span className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#234629] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                    {routeIdx + 1}
                  </span>
                  {bin.status === 'Penuh' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <div
                    className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-md transition-all flex items-center justify-center ring-1 ring-black/20"
                    style={{ backgroundColor: color }}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                  </div>

                  {/* Pulse ring for full bins */}
                  {bin.status === 'Penuh' && (
                    <span className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                  )}

                  {/* Tooltip on mouse hover */}
                  {isHovered && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1A231C]/95 text-white text-[11px] px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-xl pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xs animate-in fade-in zoom-in-95">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-bold">{bin.category.split('/')[0]}</span>
                      <span className="text-slate-300">· {bin.building}</span>
                      <span className="text-emerald-300 font-semibold">({bin.distanceM} m)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ========================================================
            BOTTOM BLUEPRINT LEGEND (Matches image_f37d0c44.png)
           ======================================================== */}
        {!isSimplified && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-1 rounded-lg border border-slate-300 shadow-2xs pointer-events-none z-10 flex items-center gap-4 text-[8px] sm:text-[9px] text-slate-700 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#B8D7F9] border border-[#3B82F6]" />
              <span className="font-semibold">= Gedung Utama Kampus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-white border border-slate-400" />
              <span className="font-semibold">= Gedung Layanan &amp; Penunjang</span>
            </div>
          </div>
        )}
      </div>

      {/* Simplified overlay action for Beranda and other preview cards */}
      {isSimplified && (
        <div className="absolute bottom-3 left-3 right-3 z-35 flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-xs font-bold text-slate-800">
              Peta Kampus Interaktif
            </span>
            <span className="hidden sm:inline text-slate-400 text-xs">· {bins.length} Titik Tong</span>
          </div>
          <button
            onClick={() => setUserTab('peta')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#234629] hover:bg-[#1a351f] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <span>Buka Peta Penuh</span>
            <Navigation2 className="w-3 h-3 text-emerald-300 rotate-90" />
          </button>
        </div>
      )}

      {/* ========================================================
          ACTIVE PIN BOTTOM CARD (Details & Route Button)
         ======================================================== */}
      {!isCompact && selectedBin && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-[440px] bg-white/98 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200 z-35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getPinColor(selectedBin.category) }}
              />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {selectedBin.name}
              </h4>
              <StatusBadge status={selectedBin.status} size="sm" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 truncate">
              <strong className="text-slate-800">{selectedBin.building}</strong> · {selectedBin.locationDetail}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
              Jarak: <span className="font-bold text-[#234629]">{selectedBin.distanceM} m</span> · Kapasitas: {selectedBin.capacityKg} kg
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onOpenRouteNav ? onOpenRouteNav(selectedBin) : null}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#234629] hover:bg-[#1a351f] shadow-xs transition-colors cursor-pointer"
            >
              <Navigation2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Rute</span>
            </button>
            <button
              onClick={() => {
                setTargetReportBinId(selectedBin.id);
                setUserTab('lapor');
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Lapor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
