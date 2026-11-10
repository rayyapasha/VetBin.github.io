import React from 'react';
import { WasteCategory, BinStatus, ReportStatus, VoucherStatus } from '../../types';

interface StatusBadgeProps {
  status: BinStatus | ReportStatus | VoucherStatus | 'Tercetak' | 'Belum dicetak' | 'Baru' | 'Diproses' | 'Selesai' | 'Aktif' | 'Nonaktif' | 'Habis';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700';

  switch (status) {
    case 'Kosong':
    case 'Selesai':
    case 'Aktif':
    case 'Tercetak':
      colorStyles = 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]/60';
      break;
    case 'Penuh':
      colorStyles = 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]/60';
      break;
    case 'Rusak':
      colorStyles = 'bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA]/60';
      break;
    case 'Baru':
      colorStyles = 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]/60';
      break;
    case 'Diproses':
    case 'Belum dicetak':
      colorStyles = 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]/60';
      break;
    case 'Nonaktif':
      colorStyles = 'bg-[#F1F5F9] text-[#64748B] border border-slate-200';
      break;
    case 'Habis':
      colorStyles = 'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]/60';
      break;
  }

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeStyles} ${colorStyles}`}>
      {status}
    </span>
  );
};

export const CategoryPill: React.FC<{ category: WasteCategory; showDot?: boolean; size?: 'sm' | 'md' }> = ({
  category,
  showDot = true,
  size = 'sm'
}) => {
  let dotColor = 'bg-slate-400';
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (category === 'Anorganik') {
    dotColor = 'bg-[#F59E0B]';
    badgeStyles = 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
  } else if (category === 'Organik') {
    dotColor = 'bg-[#16A34A]';
    badgeStyles = 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
  } else if (category === 'Kertas') {
    dotColor = 'bg-[#2563EB]';
    badgeStyles = 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]';
  } else if (category === 'E-waste / Baterai') {
    dotColor = 'bg-[#DC2626]';
    badgeStyles = 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${badgeStyles} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      <span>{category}</span>
    </span>
  );
};
