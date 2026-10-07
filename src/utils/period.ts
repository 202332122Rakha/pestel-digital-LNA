/**
 * Centralized Period Configuration & Mapping for PLN Digital LNA
 *
 * Sesuai kebutuhan bisnis aplikasi PLN Digital LNA:
 * Kuartal 1: Januari – Juni
 * Kuartal 2: Juli – Desember
 */

export const AVAILABLE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030] as const;
export type AvailableYear = typeof AVAILABLE_YEARS[number];

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;
export type MonthName = typeof MONTH_NAMES[number];

export const PERIOD_CONFIG = {
  Q1: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'] as const,
  Q2: ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'] as const,
};

export type QuarterName = 'Q1' | 'Q2';

export interface PeriodOption {
  value: string;
  label: string;
  group?: 'Semua' | 'Kuartal 1' | 'Kuartal 2';
  quarter?: QuarterName;
}

export const PERIOD_DROPDOWN_OPTIONS: PeriodOption[] = [
  { value: 'Semua Periode', label: 'Semua Periode (Januari–Desember)', group: 'Semua' },
  { value: 'Kuartal 1', label: 'Kuartal 1 (Januari – Juni)', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'Januari', label: 'Januari', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'Februari', label: 'Februari', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'Maret', label: 'Maret', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'April', label: 'April', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'Mei', label: 'Mei', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'Juni', label: 'Juni', group: 'Kuartal 1', quarter: 'Q1' },
  { value: 'Kuartal 2', label: 'Kuartal 2 (Juli – Desember)', group: 'Kuartal 2', quarter: 'Q2' },
  { value: 'Juli', label: 'Juli', group: 'Kuartal 2', quarter: 'Q2' },
  { value: 'Agustus', label: 'Agustus', group: 'Kuartal 2', quarter: 'Q2' },
  { value: 'September', label: 'September', group: 'Kuartal 2', quarter: 'Q2' },
  { value: 'Oktober', label: 'Oktober', group: 'Kuartal 2', quarter: 'Q2' },
  { value: 'November', label: 'November', group: 'Kuartal 2', quarter: 'Q2' },
  { value: 'Desember', label: 'Desember', group: 'Kuartal 2', quarter: 'Q2' },
];

/**
 * Otomatis menentukan Kuartal berdasarkan nama bulan
 * Januari-Juni -> Q1
 * Juli-Desember -> Q2
 */
export function getQuarterFromMonth(month: string): QuarterName {
  const normalized = month.trim();
  if (PERIOD_CONFIG.Q1.includes(normalized as any)) {
    return 'Q1';
  }
  return 'Q2';
}

/**
 * Ekstraksi nama bulan Indonesia dari ISO Date string (mis. '2026-02-15' -> 'Februari')
 */
export function getMonthFromDate(dateString?: string): MonthName {
  if (!dateString) return 'Januari';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Januari';
    const monthIndex = d.getMonth(); // 0 to 11
    return MONTH_NAMES[monthIndex] || 'Januari';
  } catch {
    return 'Januari';
  }
}

/**
 * Ekstraksi tahun dari ISO Date string
 */
export function getYearFromDate(dateString?: string): number {
  if (!dateString) return 2026;
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 2026;
    return d.getFullYear();
  } catch {
    return 2026;
  }
}

/**
 * Helper terpusat untuk memverifikasi apakah suatu record cocok dengan filter Tahun & Periode
 */
export function isMatchPeriod(
  item: {
    year?: number;
    month?: string;
    period?: string;
    quarter?: QuarterName | string;
    createdAt?: string;
    date?: string;
    submissionDate?: string;
  },
  selectedYear: number,
  selectedPeriod: string
): boolean {
  // 1. Tentukan tahun item
  const itemYear = item.year ?? (item.createdAt ? getYearFromDate(item.createdAt) : (item.submissionDate ? getYearFromDate(item.submissionDate) : 2026));
  if (itemYear !== selectedYear) {
    return false;
  }

  // 2. Jika filter "Semua Periode", loloskan semua bulan pada tahun tersebut
  if (selectedPeriod === 'Semua Periode') {
    return true;
  }

  // 3. Tentukan bulan & kuartal item
  const itemMonth = item.month || item.period || (item.createdAt ? getMonthFromDate(item.createdAt) : (item.submissionDate ? getMonthFromDate(item.submissionDate) : 'Januari'));
  const itemQuarter = item.quarter || getQuarterFromMonth(itemMonth);

  // 4. Jika filter Kuartal 1
  if (selectedPeriod === 'Kuartal 1') {
    return itemQuarter === 'Q1' || PERIOD_CONFIG.Q1.includes(itemMonth as any);
  }

  // 5. Jika filter Kuartal 2
  if (selectedPeriod === 'Kuartal 2') {
    return itemQuarter === 'Q2' || PERIOD_CONFIG.Q2.includes(itemMonth as any);
  }

  // 6. Jika filter bulan spesifik (e.g. 'Januari', 'Februari', dll.)
  return itemMonth.toLowerCase() === selectedPeriod.toLowerCase();
}

/**
 * Format label indikator aktif periode yang tampil di dashboard
 * Contoh: "Januari 2026", "Kuartal 1 (Januari–Juni) 2026", "Januari–Desember 2026"
 */
export function formatPeriodLabel(selectedYear: number, selectedPeriod: string): string {
  if (selectedPeriod === 'Semua Periode') {
    return `Januari–Desember ${selectedYear}`;
  }
  if (selectedPeriod === 'Kuartal 1') {
    return `Kuartal 1 (Januari–Juni) ${selectedYear}`;
  }
  if (selectedPeriod === 'Kuartal 2') {
    return `Kuartal 2 (Juli–Desember) ${selectedYear}`;
  }
  return `${selectedPeriod} ${selectedYear}`;
}
