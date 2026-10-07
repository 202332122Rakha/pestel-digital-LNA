import { PriorityLevel } from '../types';

/**
 * Calculate competency gap and determine priority level
 * Gap = Required Level - Current Level
 * If Gap >= 2: High
 * If Gap = 1: Medium
 * If Gap <= 0: Low
 */
export function calculateGap(requiredLevel: number, currentLevel: number): { gap: number; priority: PriorityLevel } {
  const req = Number(requiredLevel) || 0;
  const curr = Number(currentLevel) || 0;
  const gap = Math.max(0, req - curr);

  let priority: PriorityLevel = 'Low';
  if (gap >= 2) {
    priority = 'High';
  } else if (gap === 1) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  return { gap, priority };
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return dateString;
  }
}

/**
 * Triggers native browser print with a clean executive layout
 */
export function printReportPage(): void {
  window.print();
}

/**
 * Exports data to formatted CSV file
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((header) => {
        let val = item[header];
        if (typeof val === 'object') val = JSON.stringify(val);
        const str = String(val ?? '').replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
