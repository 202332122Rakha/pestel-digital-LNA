import React from 'react';
import { Calendar, Filter, Sparkles, Clock, Check } from 'lucide-react';
import {
  AVAILABLE_YEARS,
  PERIOD_DROPDOWN_OPTIONS,
  formatPeriodLabel,
} from '../utils/period';

interface PeriodFilterProps {
  selectedYear: number;
  selectedPeriod: string;
  onYearChange: (year: number) => void;
  onPeriodChange: (period: string) => void;
  className?: string;
  compact?: boolean;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedYear,
  selectedPeriod,
  onYearChange,
  onPeriodChange,
  className = '',
  compact = false,
}) => {
  const activeLabel = formatPeriodLabel(selectedYear, selectedPeriod);

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Label & Active Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-[#00843D] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Filter Periode Data
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00843D]/10 text-[#00843D] border border-[#00843D]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00843D] animate-pulse"></span>
                <span>Aktif: {activeLabel}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              Pemisahan data tahun & bulan/kuartal memastikan arsip tidak saling tumpang tindih.
            </p>
          </div>
        </div>

        {/* Right: Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dropdown Tahun */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              aria-label="Pilih Tahun"
              className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Periode (Bulan & Kuartal) */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500">Periode:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              aria-label="Pilih Periode Bulan atau Kuartal"
              className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer pr-1 max-w-[190px] sm:max-w-none truncate"
            >
              <optgroup label="Akumulasi Tahunan">
                <option value="Semua Periode">Semua Periode (Januari–Desember)</option>
              </optgroup>

              <optgroup label="Kuartal 1 (Januari – Juni)">
                <option value="Kuartal 1">Kuartal 1 (Januari – Juni)</option>
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
              </optgroup>

              <optgroup label="Kuartal 2 (Juli – Desember)">
                <option value="Kuartal 2">Kuartal 2 (Juli – Desember)</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
              </optgroup>
            </select>
          </div>

          {/* Quick Reset Button if not default */}
          {(selectedYear !== 2026 || selectedPeriod !== 'Semua Periode') && (
            <button
              onClick={() => {
                onYearChange(2026);
                onPeriodChange('Semua Periode');
              }}
              title="Reset ke Tahun Aktif (2026 - Semua Periode)"
              className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset Default
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
