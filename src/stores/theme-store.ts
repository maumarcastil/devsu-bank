import { useColorScheme } from 'react-native';
import { create } from 'zustand';

import { colors, ThemeColors, ThemeMode } from '../constants/theme';

type ThemeState = {
  mode: ThemeMode;
  hasUserSelected: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const getInitialTheme = (): ThemeMode => {
  return 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialTheme(),
  hasUserSelected: false,
  colors: colors[getInitialTheme()],
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      return { mode: newMode, hasUserSelected: true, colors: colors[newMode] };
    }),
  setTheme: (mode) => set({ mode, hasUserSelected: true, colors: colors[mode] }),
}));

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { mode, hasUserSelected, toggleTheme, setTheme } = useThemeStore();

  const resolvedMode: ThemeMode = hasUserSelected
    ? mode
    : systemColorScheme === 'dark'
      ? 'dark'
      : mode;

  return {
    mode: resolvedMode,
    colors: colors[resolvedMode],
    toggleTheme,
    setTheme,
  };
};
