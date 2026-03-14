import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { sendEmailVerification, reload, signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useTheme } from '@/context/ThemeContext';

export default function VerifyEmailScreen() {
  const [isChecking, setIsChecking] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const router = useRouter();
  const user = auth.currentUser;
  const { colors } = useTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-check every 4 seconds if user verified
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await reload(user);
        if (user.emailVerified) {
          router.replace('/(tabs)');
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const handleResend = async () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to resend verification.');
      return;
    }
    try {
      await sendEmailVerification(user);
      setResendTimer(30);
      Alert.alert('Email Sent', 'Verification email resent. Check your inbox.');
    } catch (error) {
      Alert.alert('Error', 'Could not resend email. Try again in a moment.');
    }
  };

  const handleCheckNow = async () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to continue.');
      return;
    }
    setIsChecking(true);
    await reload(user);
    if (user.emailVerified) {
      router.replace('/(tabs)');
    } else {
      Alert.alert(
        'Not Verified Yet',
        "We haven't received your verification yet. Check your email inbox and spam folder."
      );
    }
    setIsChecking(false);
  };

  const handleWrongEmail = async () => {
    if (user) {
      await signOut(auth);
    }
    router.replace('/(auth)/signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>We sent a verification link to:</Text>
        <Text style={styles.email}>{user?.email ?? 'Not signed in'}</Text>

        <Text style={styles.instruction}>
          Open your email app, find the message from NaviGo, and tap the
          verification link. Then come back here.
        </Text>

        {/* Check now button */}
        <TouchableOpacity
          style={styles.checkBtn}
          onPress={handleCheckNow}
          disabled={isChecking}
          activeOpacity={0.85}
        >
          {isChecking ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.checkBtnText}>I've verified my email ✓</Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        {resendTimer > 0 ? (
          <Text style={styles.resendTimer}>
            Resend email in <Text style={styles.timerNum}>{resendTimer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendBtn}>Resend verification email</Text>
          </TouchableOpacity>
        )}

        {/* Tips */}
        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>Can't find the email?</Text>
          <Text style={styles.tipText}>• Check your spam / junk folder</Text>
          <Text style={styles.tipText}>
            • Make sure you used the right email
          </Text>
          <Text style={styles.tipText}>
            • Wait up to 2 minutes for delivery
          </Text>
        </View>

        {/* Wrong email? go back */}
        <TouchableOpacity
          style={styles.wrongEmailBtn}
          onPress={handleWrongEmail}
        >
          <Text style={styles.wrongEmailText}>Wrong email? Sign up again</Text>
        </TouchableOpacity>
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
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
    content: { flex: 1, alignItems: 'center', paddingTop: 80 },
    logoCircle: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.primary + '22',
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    logoImage: { width: 44, height: 44 },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    subtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
    email: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
      marginTop: 6,
      marginBottom: 20,
    },
    instruction: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
      paddingHorizontal: 10,
    },
    checkBtn: {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    checkBtnText: { fontSize: 16, fontWeight: '700', color: colors.background },
    resendTimer: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
    timerNum: { color: colors.primary, fontWeight: '600' },
    resendBtn: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      marginBottom: 24,
    },
    tipsBox: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      marginBottom: 24,
    },
    tipsTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textMuted,
      marginBottom: 10,
    },
    tipText: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 6,
      lineHeight: 20,
    },
    wrongEmailBtn: { padding: 12 },
    wrongEmailText: { fontSize: 14, color: colors.textSubtle },
  });
