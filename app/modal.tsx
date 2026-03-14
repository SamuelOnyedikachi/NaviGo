import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

export default function ModalScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.kicker}>NaviGo</Text>
        <Text style={styles.title}>Promos & Rewards</Text>
        <Text style={styles.subtitle}>
          Use this space for promo codes, referrals, and rider rewards.
        </Text>
        <Link href="/" dismissTo style={styles.link}>
          <Text style={styles.linkText}>Back to home</Text>
        </Link>
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    card: {
      width: '100%',
      borderRadius: 24,
      padding: 24,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    kicker: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginBottom: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textMuted,
      lineHeight: 20,
      marginBottom: 16,
    },
    link: {
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    linkText: {
      color: colors.background,
      fontWeight: '700',
      fontSize: 13,
    },
  });
