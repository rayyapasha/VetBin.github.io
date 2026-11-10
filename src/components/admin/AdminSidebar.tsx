import React, { useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  QrCode,
  Gift,
  AlertCircle,
  User,
  ArrowLeft,
  Menu,
  X,
  Shield
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { adminTab, setAdminTab, setIsAdminView, setUserTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'ringkasan', label: 'Ringkasan', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'titik-tong', label: 'Titik Tong', icon: <MapPin className="w-4 h-4" /> },
    { id: 'qrcode', label: 'QR Code', icon: <QrCode className="w-4 h-4" /> },
    { id: 'mitra', label: 'Mitra Voucher', icon: <Gift className="w-4 h-4" /> },
    { id: 'laporan', label: 'Laporan', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  const currentLabel = menuItems.find(m => m.id === adminTab)?.label || 'Dashboard';

  return (
    <>
      {/* ========================================================
          MOBILE & TABLET HEADER (< lg)
         ======================================================== */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#234629] text-white border-b border-[#1b3620] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-baseline gap-0.5">
            <span className="font-extrabold text-lg tracking-tight text-white">VET</span>
            <span className="font-extrabold text-lg tracking-tight text-[#E58B35]">BIN</span>
          </div>
          <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 font-bold uppercase tracking-wider">
            Admin · {currentLabel}
          </span>
        </div>

        <button
          onClick={() => {
            setIsAdminView(false);
            setUserTab('beranda');
          }}
          className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-emerald-100 text-xs font-semibold transition-all border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tampilan Mahasiswa</span>
          <span className="sm:hidden">Keluar</span>
        </button>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-start"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#234629] text-white w-full max-h-[85vh] overflow-y-auto p-5 rounded-t-3xl sm:rounded-none sm:h-full sm:max-w-xs shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-300" />
                <span className="font-bold text-sm tracking-wide text-emerald-200">MENU ADMIN KAMPUS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-emerald-900/60 text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav data-testid="mobile-admin-nav" aria-label="Menu Navigasi Admin Mobile" className="space-y-1.5">
              {menuItems.map(item => {
                const isActive = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#315A38] text-white shadow-xs'
                        : 'text-emerald-100/80 hover:bg-[#2c5333] hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-300' : 'text-emerald-300/70'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-5 mt-6 border-t border-emerald-900/60 space-y-3">
              <button
                onClick={() => {
                  setIsAdminView(false);
                  setUserTab('beranda');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-100 text-xs font-semibold transition-all border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Tampilan Mahasiswa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DESKTOP SIDEBAR (>= lg)
         ======================================================== */}
      <aside className="hidden lg:flex w-64 bg-[#234629] text-white flex-col justify-between h-screen sticky top-0 shrink-0 select-none shadow-xl border-r border-[#1a351f] z-30">
        {/* Brand & Menu */}
        <div className="p-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                <path d="m14 16-3 3 3 3" />
                <path d="M8.294 4.5h8.412a1.83 1.83 0 0 1 1.571.879 1.785 1.785 0 0 1 .005 1.784l-2.025 3.51" />
                <path d="m10 8 3-3-3-3" />
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-extrabold text-xl tracking-tight text-white">VET</span>
              <span className="font-extrabold text-xl tracking-tight text-[#E58B35]">BIN</span>
            </div>
          </div>

          {/* Admin Section Title */}
          <div className="text-[10px] font-bold tracking-widest text-emerald-300/70 uppercase mb-3 px-3">
            ADMIN KAMPUS
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {menuItems.map(item => {
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#315A38] text-white font-semibold shadow-xs'
                      : 'text-emerald-100/80 hover:text-white hover:bg-[#2c5333]'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-300' : 'text-emerald-300/70'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Exit to User View */}
        <div className="p-4 border-t border-[#315A38] space-y-3">
          {/* Switch back to user website button */}
          <button
            onClick={() => {
              setIsAdminView(false);
              setUserTab('beranda');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-100 hover:text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tampilan Mahasiswa</span>
          </button>

          {/* User Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#1D3A22]">
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-xs text-white truncate">Admin Kampus</h5>
              <p className="text-[11px] text-emerald-200/70 truncate">pengelola@kampus</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
