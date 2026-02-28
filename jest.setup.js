// Setup for Jest tests
// Mock expo modules
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        API_BASE_URL: 'https://api.example.com',
      },
    },
  },
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock date-fns to avoid native dependencies
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    // Simple mock implementation
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (formatStr === 'yyyy-MM-dd') {
      return `${year}-${month}-${day}`;
    }
    if (formatStr === 'dd/MM/yyyy') {
      return `${day}/${month}/${year}`;
    }
    return `${year}-${month}-${day}`;
  }),
  parse: jest.fn((dateStr, formatStr) => {
    if (!dateStr) return new Date(NaN);
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateStr);
  }),
  addYears: jest.fn((date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }),
  isValid: jest.fn((date) => {
    return date instanceof Date && !isNaN(date.getTime());
  }),
}));
