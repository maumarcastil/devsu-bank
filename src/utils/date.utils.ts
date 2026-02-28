import { format, parse, addYears, isValid } from 'date-fns';
import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '@/constants/date';

export function getTodayString(): string {
  return format(new Date(), DATE_FORMAT);
}

export function calculateRevisionDate(dateRelease: string): string {
  if (!dateRelease) return '';
  const parsed = parse(dateRelease, DATE_FORMAT, new Date());
  if (!isValid(parsed)) return '';
  return format(addYears(parsed, 1), DATE_FORMAT);
}

export function normalizeDateString(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (!isValid(parsed)) return '';
  return format(parsed, DATE_FORMAT);
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '---';
  const parsed = parse(dateStr, DATE_FORMAT, new Date());
  if (!isValid(parsed)) return '---';
  return format(parsed, DISPLAY_DATE_FORMAT);
}
