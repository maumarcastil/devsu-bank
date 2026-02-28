import {
  getTodayString,
  calculateRevisionDate,
  normalizeDateString,
  formatDisplayDate,
} from '../date.utils';
import { format, addYears } from 'date-fns';
import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '@/constants/date';

describe('date.utils', () => {
  describe('getTodayString', () => {
    it('should return today date in yyyy-MM-dd format', () => {
      const result = getTodayString();
      const expected = format(new Date(), DATE_FORMAT);

      expect(result).toBe(expected);
    });

    it('should return a valid date string', () => {
      const result = getTodayString();

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('calculateRevisionDate', () => {
    it('should return empty string for empty input', () => {
      expect(calculateRevisionDate('')).toBe('');
    });

    it('should return empty string for invalid date', () => {
      expect(calculateRevisionDate('invalid-date')).toBe('');
    });

    it('should calculate revision date one year from release date', () => {
      const releaseDate = '2024-03-15';
      const expected = format(addYears(new Date(2024, 2, 15), 1), DATE_FORMAT);

      expect(calculateRevisionDate(releaseDate)).toBe(expected);
    });

    it('should handle leap year dates correctly', () => {
      const releaseDate = '2024-02-29'; // Leap year
      const result = calculateRevisionDate(releaseDate);

      expect(result).toBe('2025-03-01'); // date-fns adds 365 days, moves to next day
    });

    it('should handle year-end dates', () => {
      const releaseDate = '2024-12-31';
      const result = calculateRevisionDate(releaseDate);

      expect(result).toBe('2025-12-31');
    });
  });

  describe('normalizeDateString', () => {
    it('should return empty string for empty input', () => {
      expect(normalizeDateString('')).toBe('');
    });

    it('should return the same string if already in yyyy-MM-dd format', () => {
      const dateStr = '2024-03-15';

      expect(normalizeDateString(dateStr)).toBe(dateStr);
    });

    it('should normalize Date object to yyyy-MM-dd format', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024

      expect(normalizeDateString(date.toISOString())).toBe('2024-03-15');
    });

    it('should return empty string for invalid date', () => {
      expect(normalizeDateString('not-a-date')).toBe('');
    });

    it('should handle various date formats', () => {
      expect(normalizeDateString('2024-03-15')).toBe('2024-03-15');
    });
  });

  describe('formatDisplayDate', () => {
    it('should return "---" for empty input', () => {
      expect(formatDisplayDate('')).toBe('---');
    });

    it('should return "---" for invalid date', () => {
      expect(formatDisplayDate('invalid')).toBe('---');
    });

    it('should format date in display format dd/MM/yyyy', () => {
      const dateStr = '2024-03-15';

      expect(formatDisplayDate(dateStr)).toBe('15/03/2024');
    });

    it('should handle leap year dates', () => {
      expect(formatDisplayDate('2024-02-29')).toBe('29/02/2024');
    });

    it('should handle year-end dates', () => {
      expect(formatDisplayDate('2024-12-31')).toBe('31/12/2024');
    });
  });
});
