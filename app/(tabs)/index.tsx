import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { useTheme } from '@/context/ThemeContext';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8B8FA8' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#16213e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#0f3460' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0a0a1a' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

const LIGHT_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e5e7eb' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dbeafe' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

const RIDE_TYPES = [
  { id: 'car', label: 'Car', eta: '3-5 min', price: '₦900', icon: '🚗' },
  { id: 'bike', label: 'Bike', eta: '2-4 min', price: '₦450', icon: '🏍️' },
  { id: 'tricycle', label: 'Keke', eta: '4-7 min', price: '₦650', icon: '🛺' },
];

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedRide, setSelectedRide] = useState(RIDE_TYPES[0].id);
  const mapRef = useRef<MapView>(null);
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const selectedRideLabel =
    RIDE_TYPES.find(type => type.id === selectedRide)?.label ?? 'Ride';

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(
          'Location permission denied. Please enable it in settings.'
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
    })();
  }, []);

  const goToMyLocation = () => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800
    );
  };

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>📍</Text>
        <Text style={styles.errorTitle}>Location Required</Text>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerOuter}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.brandRow}>
          <View style={styles.brandPill}>
            <Text style={styles.brandText}>NaviGo</Text>
          </View>
          <View style={styles.brandStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.brandStatusText}>Available now</Text>
          </View>
        </View>
        <View
          style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Where to, NaviGo?"
            placeholderTextColor={colors.textSubtle}
            value={destination}
            onChangeText={setDestination}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {destination.length > 0 && (
            <TouchableOpacity onPress={() => setDestination('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.myLocationBtn} onPress={goToMyLocation}>
        <Text style={styles.myLocationIcon}>◎</Text>
      </TouchableOpacity>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Choose your ride</Text>
        <Text style={styles.cardSubtitle}>
          Confirm your pickup, pick a ride type, and go.
        </Text>
        <View style={styles.locationRow}>
          <View style={styles.dotGreen} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Your location</Text>
            <Text style={styles.locationValue}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Book {selectedRideLabel}</Text>
        </TouchableOpacity>

        <View style={styles.rideOptions}>
          {RIDE_TYPES.map((type) => {
            const isActive = selectedRide === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.rideOption, isActive && styles.rideOptionActive]}
                onPress={() => setSelectedRide(type.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.rideOptionIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.rideOptionTitle,
                    isActive && styles.rideOptionTitleActive,
                  ]}
                >
                  {type.label}
                </Text>
                <Text style={styles.rideOptionMeta}>{type.eta}</Text>
                <Text style={styles.rideOptionPrice}>{type.price}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: {
  primary: string;
  background: string;
  card: string;
  cardAlt: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  danger: string;
  success: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    centered: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    errorEmoji: { fontSize: 48, marginBottom: 16 },
    errorTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    loadingText: { color: colors.textMuted, marginTop: 16, fontSize: 14 },

    markerOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary + '33',
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },

    searchContainer: {
      position: 'absolute',
      top: 52,
      left: 16,
      right: 16,
    },
    brandRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    brandPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    brandText: {
      color: colors.primary,
      fontWeight: '700',
      fontSize: 12,
      letterSpacing: 0.6,
    },
    brandStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    brandStatusText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '600',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    searchBarFocused: {
      borderColor: colors.primary,
    },
    searchIcon: { fontSize: 16, marginRight: 10 },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    clearBtn: { color: colors.textSubtle, fontSize: 14, paddingLeft: 8 },

    myLocationBtn: {
      position: 'absolute',
      right: 16,
      bottom: 330,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    myLocationIcon: { color: colors.primary, fontSize: 22 },

    bottomCard: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 24,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 16,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    dotGreen: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      marginRight: 12,
    },
    locationInfo: { flex: 1 },
    locationLabel: {
      fontSize: 11,
      color: colors.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    locationValue: { fontSize: 14, color: colors.text, marginTop: 2 },
    separator: {
      height: 1,
      backgroundColor: colors.cardBorder,
      marginBottom: 16,
    },
    bookBtn: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    bookBtnText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.background,
      letterSpacing: 0.3,
    },
    rideOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    rideOption: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: colors.cardAlt,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    rideOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '12',
    },
    rideOptionIcon: { fontSize: 22, marginBottom: 6 },
    rideOptionTitle: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
    rideOptionTitleActive: { color: colors.primary },
    rideOptionMeta: { fontSize: 10, color: colors.textSubtle, marginTop: 2 },
    rideOptionPrice: { fontSize: 12, color: colors.text, fontWeight: '700', marginTop: 4 },
  });
