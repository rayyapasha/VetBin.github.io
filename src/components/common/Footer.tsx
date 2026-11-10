import React from 'react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  onOpenKontak: () => void;
  onOpenPrivasi: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenKontak, onOpenPrivasi }) => {
  const { setUserTab } = useApp();

  return (
    <footer className="bg-[#234629] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1b3620]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[#355d3c]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                  <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                  <path d="m14 16-3 3 3 3" />
                  <path d="M8.294 4.5h8.412a1.83 1.83 0 0 1 1.571.879 1.785 1.785 0 0 1 .005 1.784l-2.025 3.51" />
                  <path d="m10 8 3-3-3-3" />
                </svg>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-extrabold text-lg tracking-tight text-white">VET</span>
                <span className="font-extrabold text-lg tracking-tight text-[#E58B35]">BIN</span>
              </div>
            </div>
            <p className="text-emerald-100/80 text-sm max-w-md">
              Pilah dari sumber, dimulai dari peta.
            </p>
          </div>

          {/* SDG Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#CA7426]/20 border border-[#CA7426]/50 text-[#FDBA74] text-xs font-semibold tracking-wide">
              SDGs 12 · Konsumsi &amp; Produksi Bertanggung Jawab
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#CA7426]/20 border border-[#CA7426]/50 text-[#FDBA74] text-xs font-semibold tracking-wide">
              SDGs 9 · Industri, Inovasi &amp; Infrastruktur
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/60 gap-4">
          <p>© 2026 VetBin · Proyek Kelompok 7</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setUserTab('panduan')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Panduan Pilah
            </button>
            <span>·</span>
            <button
              onClick={onOpenKontak}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Kontak Pengelola
            </button>
            <span>·</span>
            <button
              onClick={onOpenPrivasi}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privasi &amp; Data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
