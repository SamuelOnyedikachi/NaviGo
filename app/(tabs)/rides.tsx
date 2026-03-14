import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/context/ThemeContext';

const MOCK_RIDES = [
  {
    id: '1',
    from: 'Aba Central',
    to: 'Ariaria Market',
    date: 'Today, 2:30 PM',
    fare: '₦850',
    status: 'completed',
  },
  {
    id: '2',
    from: 'GRA Aba',
    to: 'Aba North',
    date: 'Yesterday, 9:15 AM',
    fare: '₦1,200',
    status: 'completed',
  },
  {
    id: '3',
    from: 'Obohia Road',
    to: 'Osisioma',
    date: 'Mar 8, 4:00 PM',
    fare: '₦650',
    status: 'cancelled',
  },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function RidesScreen() {
  const [filter, setFilter] = useState('all');
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const stats = useMemo(() => {
    const total = MOCK_RIDES.length;
    const completed = MOCK_RIDES.filter(ride => ride.status === 'completed')
      .length;
    const cancelled = MOCK_RIDES.filter(ride => ride.status === 'cancelled')
      .length;
    return { total, completed, cancelled };
  }, []);

  const filteredRides =
    filter === 'all'
      ? MOCK_RIDES
      : MOCK_RIDES.filter(ride => ride.status === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Rides</Text>
      <Text style={styles.subHeader}>Track your recent trips and spending.</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.cancelled}</Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const isActive = filter === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFilter(item.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredRides.map((ride) => (
          <TouchableOpacity
            key={ride.id}
            style={styles.rideCard}
            activeOpacity={0.8}
          >
            <View style={styles.rideTop}>
              <View style={styles.routeInfo}>
                <View style={styles.routeRow}>
                  <View style={styles.dotGreen} />
                  <Text style={styles.routeText}>{ride.from}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routeRow}>
                  <View style={styles.dotRed} />
                  <Text style={styles.routeText}>{ride.to}</Text>
                </View>
              </View>
              <View style={styles.fareBox}>
                <Text style={styles.fareText}>{ride.fare}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    ride.status === 'cancelled' && styles.statusCancelled,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      ride.status === 'cancelled' && styles.statusTextCancelled,
                    ]}
                  >
                    {ride.status === 'completed' ? '✓ Done' : '✕ Cancelled'}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.dateText}>{ride.date}</Text>
          </TouchableOpacity>
        ))}

        {filteredRides.length === 0 && (
          <View style={styles.emptyHint}>
            <Text style={styles.emptyTitle}>No rides yet</Text>
            <Text style={styles.emptyText}>
              Book a ride to start building your NaviGo history.
            </Text>
          </View>
        )}
      </ScrollView>
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
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    subHeader: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primary,
    },
    statLabel: {
      marginTop: 4,
      fontSize: 11,
      color: colors.textSubtle,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      fontWeight: '600',
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    filterChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '12',
    },
    filterText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
    },
    filterTextActive: {
      color: colors.primary,
    },
    rideCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    rideTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    routeInfo: { flex: 1 },
    routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    routeLine: {
      width: 1,
      height: 12,
      backgroundColor: colors.cardBorder,
      marginLeft: 5,
      marginVertical: 2,
    },
    dotGreen: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
    routeText: { fontSize: 14, color: colors.text, fontWeight: '500' },
    fareBox: { alignItems: 'flex-end', gap: 6 },
    fareText: { fontSize: 16, fontWeight: '700', color: colors.text },
    statusBadge: {
      backgroundColor: colors.primary + '22',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    statusCancelled: { backgroundColor: colors.danger + '22' },
    statusText: { fontSize: 11, color: colors.primary, fontWeight: '700' },
    statusTextCancelled: { color: colors.danger },
    dateText: { fontSize: 12, color: colors.textMuted },
    emptyHint: { paddingVertical: 24, alignItems: 'center' },
    emptyTitle: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '700',
      marginBottom: 6,
    },
    emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  });
