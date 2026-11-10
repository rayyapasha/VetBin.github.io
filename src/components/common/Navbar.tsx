import React, { useState } from 'react';
import { useApp, UserTab } from '../../context/AppContext';
import { Compass, Menu, X, Shield, MapPin, Sparkles, AlertCircle, Award, Truck, HelpCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { userTab, setUserTab, setIsAdminView, setAdminTab, setIsOnboardingOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: UserTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'peta', label: 'Peta Tong', icon: <MapPin className="w-4 h-4" /> },
    { id: 'panduan', label: 'Panduan Pilah', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'lapor', label: 'Lapor', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'poin', label: 'Poin & Dampak', icon: <Award className="w-4 h-4" /> },
    { id: 'petugas', label: 'Petugas', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9F5]/90 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setUserTab('beranda');
              setIsAdminView(false);
            }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#234629] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-[#1b3620] transition-colors">
              <svg className="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                <path d="m14 16-3 3 3 3" />
                <path d="M8.294 4.5h8.412a1.83 1.83 0 0 1 1.571.879 1.785 1.785 0 0 1 .005 1.784l-2.025 3.51" />
                <path d="m10 8 3-3-3-3" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl tracking-tight text-[#234629]">VET</span>
              <span className="font-extrabold text-xl tracking-tight text-[#CA7426]">BIN</span>
            </div>
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(link => {
            const isActive = userTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setUserTab(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#234629] bg-[#E8EFE8] font-semibold'
                    : 'text-slate-600 hover:text-[#234629] hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA: Admin Kampus & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Admin Switcher Button */}
          <button
            onClick={() => {
              setIsAdminView(true);
              setAdminTab('ringkasan');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#234629] bg-[#EAEFEA] hover:bg-[#DCE6DC] border border-[#234629]/20 transition-all cursor-pointer"
            title="Buka Dashboard Admin Kampus"
          >
            <Shield className="w-4 h-4 text-[#234629]" />
            <span>Admin Kampus</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setUserTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                userTab === link.id
                  ? 'bg-[#E8EFE8] text-[#234629] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
              {link.icon}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setIsOnboardingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Panduan Penggunaan VetBin
            </button>
            <button
              onClick={() => {
                setIsAdminView(true);
                setAdminTab('ringkasan');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#234629] bg-[#EAEFEA]"
            >
              <Shield className="w-4 h-4" />
              Masuk Dashboard Admin Kampus
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
