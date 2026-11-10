import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserReport, ReportStatus } from '../../types';
import { StatusBadge, CategoryPill } from '../common/StatusBadge';
import { X, CheckCircle2, Clock, MapPin, User, FileText, AlertCircle } from 'lucide-react';

interface LaporanDetailModalProps {
  report: UserReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LaporanDetailModal: React.FC<LaporanDetailModalProps> = ({ report, isOpen, onClose }) => {
  const { updateReportStatus } = useApp();

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={report.status} />
          <span className="text-xs text-slate-500 font-medium">ID: {report.id}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Laporan: Tong {report.issueType}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Dilaporkan {report.timeAgoText}</p>

        <div className="mt-5 space-y-3.5 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Titik Tong:</span>
              <span className="font-bold text-slate-900">{report.binName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Kategori:</span>
              <CategoryPill category={report.category} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Lokasi:</span>
              <span className="font-medium text-slate-800">{report.location}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-500">Pelapor:</span>
              <span className="font-semibold text-slate-800">{report.reporter}</span>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-slate-700 mb-1">Catatan Laporan:</h5>
            <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 italic">
              "{report.notes || 'Tidak ada catatan tambahan.'}"
            </p>
          </div>

          {report.photoUrl && (
            <div>
              <h5 className="font-semibold text-slate-700 mb-1">Foto Bukti Terlampir:</h5>
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48">
                <img src={report.photoUrl} alt="Foto bukti" className="w-full h-full object-cover max-h-48" />
              </div>
            </div>
          )}
        </div>

        {/* Change status actions */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-2">Ubah Status Tindak Lanjut:</p>
          <div className="grid grid-cols-3 gap-2">
            {(['Baru', 'Diproses', 'Selesai'] as ReportStatus[]).map(st => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  updateReportStatus(report.id, st);
                  onClose();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  report.status === st
                    ? 'bg-[#234629] text-white border-[#234629]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
