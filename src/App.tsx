/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { BerandaView } from './components/user/BerandaView';
import { PetaTongView } from './components/user/PetaTongView';
import { PanduanPilahView } from './components/user/PanduanPilahView';
import { LaporTongView } from './components/user/LaporTongView';
import { PetugasRouteView } from './components/user/PetugasRouteView';
import { PoinDampakView } from './components/user/PoinDampakView';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminRingkasanView } from './components/admin/AdminRingkasanView';
import { AdminTitikTongView } from './components/admin/AdminTitikTongView';
import { AdminQrCodeView } from './components/admin/AdminQrCodeView';
import { AdminMitraVoucherView } from './components/admin/AdminMitraVoucherView';
import { AdminLaporanView } from './components/admin/AdminLaporanView';
import { TambahTongModal } from './components/modals/TambahTongModal';
import { EditTongModal } from './components/modals/EditTongModal';
import { TambahMitraModal } from './components/modals/TambahMitraModal';
import { LaporanDetailModal } from './components/modals/LaporanDetailModal';
import { ScanQrSimModal } from './components/modals/ScanQrSimModal';
import { VoucherRedeemModal } from './components/modals/VoucherRedeemModal';
import { NavigasiRuteModal } from './components/modals/NavigasiRuteModal';
import { KontakPengelolaModal } from './components/modals/KontakPengelolaModal';
import { PrivasiDataModal } from './components/modals/PrivasiDataModal';
import { KuponSayaModal } from './components/modals/KuponSayaModal';
import { LembarCetakQrModal } from './components/modals/LembarCetakQrModal';
import { SimpleOnboardingModal } from './components/modals/SimpleOnboardingModal';
import { CampusBin, CampusVoucher, UserReport } from './types';

const MainAppContent: React.FC = () => {
  const { isAdminView, userTab, setUserTab, adminTab, bins, isOnboardingOpen, setIsOnboardingOpen } = useApp();

  // Modals state
  const [isTambahTongOpen, setIsTambahTongOpen] = useState(false);
  const [editingBin, setEditingBin] = useState<CampusBin | null>(null);
  const [isTambahMitraOpen, setIsTambahMitraOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<CampusVoucher | null>(null);
  const [selectedReportDetail, setSelectedReportDetail] = useState<UserReport | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [redeemVoucherTarget, setRedeemVoucherTarget] = useState<CampusVoucher | null>(null);

  // New interactive modals
  const [routeNavBin, setRouteNavBin] = useState<CampusBin | null>(null);
  const [isKontakOpen, setIsKontakOpen] = useState(false);
  const [isPrivasiOpen, setIsPrivasiOpen] = useState(false);
  const [isKuponSayaOpen, setIsKuponSayaOpen] = useState(false);
  const [isLembarCetakOpen, setIsLembarCetakOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F5]">
      {isAdminView ? (
        /* Admin Dashboard View (Pages 1, 9, 10, 11, 12, 13, 14) */
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-3 sm:p-6 lg:p-10 max-w-7xl w-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={adminTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                {adminTab === 'ringkasan' && (
                  <AdminRingkasanView
                    onOpenTambahTong={() => setIsTambahTongOpen(true)}
                    onEditBin={bin => setEditingBin(bin)}
                  />
                )}
                {adminTab === 'titik-tong' && (
                  <AdminTitikTongView
                    onOpenTambahTong={() => setIsTambahTongOpen(true)}
                    onEditBin={bin => setEditingBin(bin)}
                  />
                )}
                {adminTab === 'qrcode' && (
                  <AdminQrCodeView
                    onOpenLembarCetak={() => setIsLembarCetakOpen(true)}
                  />
                )}
                {adminTab === 'mitra' && (
                  <AdminMitraVoucherView
                    onOpenTambahMitra={() => setIsTambahMitraOpen(true)}
                    onEditVoucher={v => setEditingVoucher(v)}
                  />
                )}
                {adminTab === 'laporan' && (
                  <AdminLaporanView
                    onOpenReportDetail={r => setSelectedReportDetail(r)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        /* User Website View (Pages 1, 2, 3, 4, 5, 6, 7) */
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={userTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                {userTab === 'beranda' && <BerandaView />}
                {userTab === 'peta' && (
                  <PetaTongView
                    onOpenRouteNav={bin => setRouteNavBin(bin)}
                  />
                )}
                {userTab === 'panduan' && <PanduanPilahView />}
                {userTab === 'lapor' && <LaporTongView />}
                {userTab === 'petugas' && <PetugasRouteView />}
                {userTab === 'poin' && (
                  <PoinDampakView
                    onOpenScanModal={() => setIsScanModalOpen(true)}
                    onOpenRedeemModal={v => setRedeemVoucherTarget(v)}
                    onOpenKuponSaya={() => setIsKuponSayaOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer
            onOpenKontak={() => setIsKontakOpen(true)}
            onOpenPrivasi={() => setIsPrivasiOpen(true)}
          />
          {/* Mobile Phone & Tablet Bottom Bar */}
          <MobileBottomNav />
        </div>
      )}

      {/* Global Modals */}
      <TambahTongModal
        isOpen={isTambahTongOpen}
        onClose={() => setIsTambahTongOpen(false)}
      />
      <EditTongModal
        bin={editingBin}
        isOpen={!!editingBin}
        onClose={() => setEditingBin(null)}
      />
      <TambahMitraModal
        isOpen={isTambahMitraOpen}
        onClose={() => setIsTambahMitraOpen(false)}
      />
      <LaporanDetailModal
        report={selectedReportDetail}
        isOpen={!!selectedReportDetail}
        onClose={() => setSelectedReportDetail(null)}
      />
      <ScanQrSimModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
      />
      <VoucherRedeemModal
        voucher={redeemVoucherTarget}
        isOpen={!!redeemVoucherTarget}
        onClose={() => setRedeemVoucherTarget(null)}
      />

      {/* Newly Wired Dedicated Pages / Modals */}
      <NavigasiRuteModal
        bin={routeNavBin}
        isOpen={!!routeNavBin}
        onClose={() => setRouteNavBin(null)}
      />
      <KontakPengelolaModal
        isOpen={isKontakOpen}
        onClose={() => setIsKontakOpen(false)}
      />
      <PrivasiDataModal
        isOpen={isPrivasiOpen}
        onClose={() => setIsPrivasiOpen(false)}
      />
      <KuponSayaModal
        isOpen={isKuponSayaOpen}
        onClose={() => setIsKuponSayaOpen(false)}
      />
      <LembarCetakQrModal
        bins={bins}
        isOpen={isLembarCetakOpen}
        onClose={() => setIsLembarCetakOpen(false)}
      />
      <SimpleOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenMap={() => setUserTab('peta')}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
