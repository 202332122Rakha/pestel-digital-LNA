import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, FileText, Send, ShieldCheck, Eye, Lock } from 'lucide-react';
import { LNAStatus, PriorityLevel } from '../types';

interface StatusBadgeProps {
  status: LNAStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase().trim();

  const getStyle = () => {
    switch (normalized) {
      case 'DRAFT':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: FileText,
          label: 'DRAFT',
        };
      case 'SUBMITTED':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: Send,
          label: 'SUBMITTED',
        };
      case 'UNDER REVIEW':
      case 'MENUNGGU REVIEW':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock,
          label: 'UNDER REVIEW',
        };
      case 'REVISION REQUIRED':
      case 'PERLU REVISI':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          icon: AlertTriangle,
          label: 'REVISION REQUIRED',
        };
      case 'APPROVED':
      case 'DISETUJUI':
        return {
          bg: 'bg-emerald-50 text-[#006B32] border-emerald-200',
          icon: CheckCircle2,
          label: 'APPROVED',
        };
      case 'FINAL':
      case 'SELESAI':
        return {
          bg: 'bg-[#00843D] text-white border-[#006B32] shadow-xs',
          icon: ShieldCheck,
          label: 'FINAL',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: FileText,
          label: status,
        };
    }
  };

  const config = getStyle();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded border transition-colors ${
        config.bg
      } ${size === 'sm' ? 'px-1.5 py-0.5 text-[9.5px]' : 'px-2 py-0.5 text-[10.5px]'}`}
    >
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5 shrink-0' : 'w-3 h-3 shrink-0'} />
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const getStyle = () => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <span
      className={`inline-block font-semibold rounded border ${getStyle()} ${
        size === 'sm' ? 'px-1.5 py-0.2 text-[10px]' : 'px-2 py-0.5 text-[11px]'
      }`}
    >
      {priority}
    </span>
  );
};

export const ViewOnlyBadge: React.FC<{ label?: string }> = ({ label = 'VIEW ONLY' }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold tracking-wide">
      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span>{label}</span>
    </span>
  );
};
