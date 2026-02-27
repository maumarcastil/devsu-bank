import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { colors, ThemeMode, ThemeColors } from '../constants/theme';

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const getInitialMode = (): ThemeMode => {
  const systemColorScheme = useColorScheme();
  return systemColorScheme === 'dark' ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialMode(),
  colors: colors[getInitialMode()],
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      return { mode: newMode, colors: colors[newMode] };
    }),
  setTheme: (mode) => set({ mode, colors: colors[mode] }),
}));

export const useTheme = () => {
  const { mode, colors, toggleTheme, setTheme } = useThemeStore();
  return { mode, colors, toggleTheme, setTheme };
};
