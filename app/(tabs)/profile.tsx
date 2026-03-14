import { useRouter } from 'expo-router';
import {
  ScrollView,
  Switch,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const MENU_ITEMS = [
  { icon: '⭐', label: 'My Rating', value: '4.8', tappable: false },
  { icon: '🧾', label: 'Payment Methods', value: 'Cash', tappable: true },
  { icon: '🔔', label: 'Notifications', value: 'On', tappable: true },
  { icon: '🛡️', label: 'Safety', value: '', tappable: true },
  { icon: '💬', label: 'Support', value: '', tappable: true },
  { icon: '📄', label: 'Terms & Privacy', value: '', tappable: true },
];

const QUICK_ACTIONS = [
  { icon: '🛡️', label: 'Safety' },
  { icon: '💬', label: 'Support' },
  { icon: '💳', label: 'Payments' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { colors, isDark, setTheme } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Profile</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Rider</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage your account and preferences.
        </Text>

        {/* Avatar + name */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>Your Name</Text>
          <Text style={styles.phone}>+234 800 000 0000</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>NaviGo Wallet</Text>
            <Text style={styles.walletBalance}>₦0</Text>
            <Text style={styles.walletHint}>Top up to pay faster</Text>
          </View>
          <TouchableOpacity style={styles.walletBtn} activeOpacity={0.8}>
            <Text style={styles.walletBtnText}>Top up</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            ['12', 'Rides'],
            ['4.8', 'Rating'],
            ['₦0', 'Saved'],
          ].map(([val, label]) => (
            <View key={label} style={styles.statBox}>
              <Text style={styles.statValue}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickCard}
              activeOpacity={0.8}
            >
              <Text style={styles.quickIcon}>{action.icon}</Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appearance toggle */}
        <View style={styles.themeRow}>
          <View>
            <Text style={styles.themeTitle}>Appearance</Text>
            <Text style={styles.themeSubtitle}>Light / Dark</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={() => setTheme(isDark ? 'light' : 'dark')}
            trackColor={{ false: colors.cardBorder, true: colors.primary }}
            thumbColor={isDark ? colors.background : '#FFFFFF'}
          />
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                i < MENU_ITEMS.length - 1 && styles.menuBorder,
              ]}
              activeOpacity={item.tappable ? 0.7 : 1}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.value ? (
                  <Text style={styles.menuValue}>{item.value}</Text>
                ) : null}
                {item.tappable && <Text style={styles.menuArrow}>›</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={async () => {
            await logout();
            router.replace('/(auth)/login');
          }}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>NaviGo v1.0.0 · Made in Aba 🇳🇬</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  headerBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary + '22',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32 },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  phone: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editBtnText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  walletLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  walletBalance: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  walletHint: { fontSize: 11, color: colors.textSubtle, marginTop: 4 },
  walletBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  walletBtnText: { color: colors.background, fontWeight: '700', fontSize: 12 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSubtle,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  quickIcon: { fontSize: 20, marginBottom: 8 },
  quickLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  themeSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  menuIcon: { fontSize: 18, marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13, color: colors.textMuted },
  menuArrow: { fontSize: 20, color: colors.textSubtle },
  signOutBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
  version: {
    textAlign: 'center',
    color: colors.textSubtle,
    fontSize: 12,
    marginBottom: 40,
  },
});
