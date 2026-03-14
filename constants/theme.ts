export const Colors = {
  light: {
    primary: '#00D4AA',
    background: '#F6F7F9',
    card: '#FFFFFF',
    cardAlt: '#F1F5F9',
    cardBorder: '#E5E7EB',
    text: '#0F172A',
    textMuted: '#6B7280',
    textSubtle: '#94A3B8',
    icon: '#0F172A',
    danger: '#EF4444',
    success: '#00D4AA',
  },
  dark: {
    primary: '#00D4AA',
    background: '#0A0A0A',
    card: '#111111',
    cardAlt: '#141414',
    cardBorder: '#1E1E1E',
    text: '#FFFFFF',
    textMuted: '#666666',
    textSubtle: '#555555',
    icon: '#FFFFFF',
    danger: '#FF4757',
    success: '#00D4AA',
  },
};

export const COLORS = Colors.dark;

export const MAPS_API_KEY =
  process.env.EXPO_PUBLIC_MAP_API_KEY ?? process.env.MAPS_API_KEY;

// Aba, Nigeria coordinates (default map center)
export const ABA_COORDS = {
  latitude: 5.1167,
  longitude: 7.3667,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
