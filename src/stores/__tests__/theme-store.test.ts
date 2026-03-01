import { useThemeStore } from '../theme-store';
import { colors } from '../../constants/theme';

describe('theme-store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useThemeStore.setState({
      mode: 'light',
      hasUserSelected: false,
      colors: colors.light,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with light theme by default', () => {
      const state = useThemeStore.getState();

      expect(state.mode).toBe('light');
      expect(state.hasUserSelected).toBe(false);
      expect(state.colors).toEqual(colors.light);
    });

    it('should have correct color values for light theme', () => {
      const state = useThemeStore.getState();

      expect(state.colors.background).toBe('#FFFFFF');
      expect(state.colors.text).toBe('#000000');
      expect(state.colors.primary).toBe('#007AFF');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const store = useThemeStore.getState();

      store.toggleTheme();

      const newState = useThemeStore.getState();
      expect(newState.mode).toBe('dark');
      expect(newState.hasUserSelected).toBe(true);
      expect(newState.colors).toEqual(colors.dark);
    });

    it('should toggle from dark to light', () => {
      // Set initial state to dark
      useThemeStore.setState({
        mode: 'dark',
        hasUserSelected: false,
        colors: colors.dark,
      });

      const store = useThemeStore.getState();
      store.toggleTheme();

      const newState = useThemeStore.getState();
      expect(newState.mode).toBe('light');
      expect(newState.hasUserSelected).toBe(true);
      expect(newState.colors).toEqual(colors.light);
    });

    it('should mark user as having selected a theme', () => {
      const store = useThemeStore.getState();

      expect(store.hasUserSelected).toBe(false);

      store.toggleTheme();

      const newState = useThemeStore.getState();
      expect(newState.hasUserSelected).toBe(true);
    });

    it('should have correct dark theme colors after toggle', () => {
      const store = useThemeStore.getState();

      store.toggleTheme();

      const newState = useThemeStore.getState();
      expect(newState.colors.background).toBe('#000000');
      expect(newState.colors.text).toBe('#FFFFFF');
      expect(newState.colors.primary).toBe('#0A84FF');
    });

    it('should toggle multiple times correctly', () => {
      const store = useThemeStore.getState();

      store.toggleTheme(); // light -> dark
      expect(useThemeStore.getState().mode).toBe('dark');

      store.toggleTheme(); // dark -> light
      expect(useThemeStore.getState().mode).toBe('light');

      store.toggleTheme(); // light -> dark
      expect(useThemeStore.getState().mode).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      const store = useThemeStore.getState();

      store.setTheme('dark');

      const newState = useThemeStore.getState();
      expect(newState.mode).toBe('dark');
      expect(newState.hasUserSelected).toBe(true);
      expect(newState.colors).toEqual(colors.dark);
    });

    it('should set theme to light', () => {
      // Start from dark
      useThemeStore.setState({
        mode: 'dark',
        hasUserSelected: false,
        colors: colors.dark,
      });

      const store = useThemeStore.getState();
      store.setTheme('light');

      const newState = useThemeStore.getState();
      expect(newState.mode).toBe('light');
      expect(newState.hasUserSelected).toBe(true);
      expect(newState.colors).toEqual(colors.light);
    });

    it('should mark user as having selected a theme', () => {
      const store = useThemeStore.getState();

      store.setTheme('dark');

      const newState = useThemeStore.getState();
      expect(newState.hasUserSelected).toBe(true);
    });

    it('should not change theme when setting same mode', () => {
      const store = useThemeStore.getState();
      const initialColors = store.colors;

      store.setTheme('light');

      const newState = useThemeStore.getState();
      expect(newState.mode).toBe('light');
      expect(newState.colors).toEqual(initialColors);
    });
  });

  describe('theme actions availability', () => {
    it('should provide toggleTheme function', () => {
      const store = useThemeStore.getState();

      expect(typeof store.toggleTheme).toBe('function');
    });

    it('should provide setTheme function', () => {
      const store = useThemeStore.getState();

      expect(typeof store.setTheme).toBe('function');
    });
  });

  describe('theme state consistency', () => {
    it('should keep colors in sync with mode when using setTheme', () => {
      const store = useThemeStore.getState();

      store.setTheme('dark');
      const darkState = useThemeStore.getState();

      expect(darkState.mode).toBe('dark');
      expect(darkState.colors).toEqual(colors.dark);
      expect(darkState.colors).not.toEqual(colors.light);
    });

    it('should keep colors in sync with mode when using toggleTheme', () => {
      const store = useThemeStore.getState();

      store.toggleTheme();
      const darkState = useThemeStore.getState();

      expect(darkState.mode).toBe('dark');
      expect(darkState.colors).toEqual(colors.dark);
      expect(darkState.colors).not.toEqual(colors.light);
    });
  });
});
