import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { height } = Dimensions.get ('window');
const MAP_API_KEY = process.env.MAP_API_KEY;

// Dark map style - looks clean and professional
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e'}] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888FA8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#16213e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#0f3460' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a1a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState('');
  const [ isSearchFocused, setIsSearchFocused] = useState(false);
  const mapRef = useRef<mapView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied, please enable it in settings');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc.coords);
    })();
  }, []);

  const goToMyLocation = () => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 800);
  };

  if (errorMsg) {
    return (
      <View style= {styles.centered}>
        <Text style={styles.errorEmoji}>📍</Text>
        <Text style={styles.errorTitle}> Location required</Text>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#00D4AA' />
        <Text style={styles.loadingText}> Getting Your Location...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>

      {/* Full Screen Map */}
      <MapView
      ref={mapRef}
      style={style.map}
      provider={PROVIDER_GOOGLE}
      customMapStyle={DARK_MAP_STYLE}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0,01,
        longitudeDelta: 0.01,
      }}

      showsUserLocation{false}
      showsMyLocationButton{false}
      >

        {/* Rider's current location marker */}
        <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        anchor = {{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerOuter}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
      </MapView>

      {/* Top Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
          style={ styles.searchInput}
          placeholder= 'Where to?'
          placeholderTextColor='#666'
          value={destination}
          onChangeText={setDestination}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          />

          {destination.length > 0 && (
            <TouchableOpacity onPress={() => setDestination('')}>
              <Text style={styles.clearBtn}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom booking card */}
      <View style={styles.bottomCard}>
        <View style={styles.locationRow}>
          <View style={styles.dotGreen}/>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Your Location</Text>
            <Text style={styles.locationValue}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        </View>


        <View style={styles.seperator} />

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Book a Ride 🚗 </Text>
        </TouchableOpacity>

        {/* QUick Options */}
        <View style={styles.quickOptions}>
          {['Car', 'Bike', 'Tricycle'].map(type => (
            <TouchableOpacity key={type} style={styles.quickOption}>
              <Text style={styles.quickOptionEmoji}>
                {type === 'Car' ? '🚗' : type === 'Bike' ? '🏍️' : '🛺'}
              </Text>
              <Text style={styles.quickOptionOptionText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  centered: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  errorEmoji: { fontSize: 48, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  errorText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  loadingText: { color: '#666', marginTop: 16, fontSize: 14 },

  // Custom marker
  markerOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#00D4AA33',
    borderWidth: 2,
    borderColor: '#00D4AA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D4AA', 
  },

  SearchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#fff',
  },
  clearBtn: { 
    fontSize: 14, 
    color: '#555',
    paddingLeft: 8, 
  },


  // My location button
  myLocationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 310,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E0E0E',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 0,
  },
  myLocationIcon: { color: '#00D4AA', fontSize: 22 },

  // Buttom card
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0E0E0E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
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
    backgroundColor: '#00D4AA',
    marginRight: 12,
  },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 11, color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  locationValue: { fontSize: 14, color: '#AAA', marginTop: 2 },
  separator: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginBottom: 16,
  },
  bookBtn: {
    backgroundColor: '#00D4AA',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: 0.3,
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickOption: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222',
  },
  quickOptionEmoji: { fontSize: 22, marginBottom: 4 },
  quickOptionText: { fontSize: 12, color: '#888', fontWeight: '600' },
});