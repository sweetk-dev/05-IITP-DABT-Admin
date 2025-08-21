// Centralized date/time formatting utilities for FE
// All functions assume ISO 8601 strings from BE (preferably UTC 'Z').

function pad2(n: number): string { return n < 10 ? `0${n}` : String(n); }

export function toLocalDate(dateInput?: string | number | Date): Date | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  return Number.isNaN(d.valueOf()) ? null : d;
}

export function formatYmd(iso?: string): string {
  const d = toLocalDate(iso);
  if (!d) return '-';
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

export function formatHm(iso?: string): string {
  const d = toLocalDate(iso);
  if (!d) return '-';
  const h = pad2(d.getHours());
  const m = pad2(d.getMinutes());
  return `${h}:${m}`;
}

export function formatYmdHm(iso?: string): string {
  const d = toLocalDate(iso);
  if (!d) return '-';
  const ymd = formatYmd(iso);
  const hm = formatHm(iso);
  return `${ymd} ${hm}`;
}

export function formatLocaleDate(iso?: string): string {
  const d = toLocalDate(iso);
  if (!d) return '-';
  return d.toLocaleDateString('ko-KR');
}

export function formatLocaleTime(iso?: string): string {
  const d = toLocalDate(iso);
  if (!d) return '-';
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}


