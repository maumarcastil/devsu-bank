export const colors = {
  light: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textMuted: '#8E8E93',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    card: '#FFFFFF',
    border: '#E5E5EA',
    inputBackground: '#F2F2F7',
  },
  dark: {
    primary: '#0A84FF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textMuted: '#8E8E93',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    card: '#1C1C1E',
    border: '#38383A',
    inputBackground: '#2C2C2E',
  },
};

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = typeof colors.light;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
