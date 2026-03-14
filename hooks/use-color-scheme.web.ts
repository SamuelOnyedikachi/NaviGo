import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const { theme } = useTheme();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (!hasHydrated) {
    return 'light';
  }

  return theme ?? colorScheme ?? 'light';
}
