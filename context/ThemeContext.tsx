import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  colors: typeof Colors.light;
  isDark: boolean;
}

const STORAGE_KEY = 'navigo.theme';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  colors: Colors.dark,
  isDark: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme() ?? 'dark';
  const [theme, setTheme] = useState<ThemeMode>(
    systemScheme === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') {
          setTheme(stored);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, theme).catch(() => {});
  }, [theme]);

  const value = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      theme,
      setTheme,
      toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
      colors: isDark ? Colors.dark : Colors.light,
      isDark,
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
