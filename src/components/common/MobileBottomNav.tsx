import React from 'react';
import { useApp, UserTab } from '../../context/AppContext';
import {
  Compass,
  MapPin,
  Sparkles,
  AlertCircle,
  Award,
  Truck
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { userTab, setUserTab } = useApp();

  const navItems: { id: UserTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'beranda', label: 'Beranda', icon: Compass },
    { id: 'peta', label: 'Peta', icon: MapPin },
    { id: 'panduan', label: 'Panduan', icon: Sparkles },
    { id: 'lapor', label: 'Lapor', icon: AlertCircle },
    { id: 'poin', label: 'Poin', icon: Award },
    { id: 'petugas', label: 'Petugas', icon: Truck },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Smartphone"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-1 py-1 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = userTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setUserTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] min-h-[48px] select-none active:scale-95 ${
              isActive
                ? 'text-[#234629] font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-[#E8EFE8] text-[#234629]' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
