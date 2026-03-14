import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '../../services/firebase';
import { useTheme } from '@/context/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // Ensure the user record exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          fullName: user.displayName ?? 'Rider',
          email: user.email ?? email.trim(),
          role: 'rider',
          rating: 5.0,
          totalRides: 0,
          createdAt: new Date().toISOString(),
        });
      }

      if (!user.emailVerified) {
        Alert.alert(
          'Verify your email',
          'Please verify your email before continuing.'
        );
        router.replace('/(auth)/verify-email');
      }
    } catch (error: any) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      }
      if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      }
      if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Try again later.';
      }
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        'Enter Email',
        'Type your email address above first, then tap Forgot Password.'
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Email Sent', `Password reset link sent to ${email}`);
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not send reset email. Check your email address.'
      );
    }
  };

  const isValid = email.length > 0 && password.length >= 6;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View pointerEvents="none" style={styles.bg}>
        <View style={styles.bgGlowOne} />
        <View style={styles.bgGlowTwo} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandArea}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Your ride, anywhere in Nigeria</Text>
          <View style={styles.brandPills}>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>Fast pickups</Text>
            </View>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>24/7 support</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          <Text style={styles.label}>Email Address</Text>
          <View
            style={[
              styles.inputBox,
              focusedField === 'email' && styles.inputBoxFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="your@example.com"
              placeholderTextColor={colors.textSubtle}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputBox,
              focusedField === 'password' && styles.inputBoxFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor={colors.textSubtle}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showBtn}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, isValid ? styles.btnActive : styles.btnDisabled]}
            onPress={handleLogin}
            disabled={!isValid || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text
                style={[styles.btnText, !isValid && styles.btnTextDisabled]}
              >
                Sign In →
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                'Coming Soon',
                'Google Sign-In will be fully enabled in the next version.'
              )
            }
          >
            <Text style={styles.googleIcon}>🇬</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text style={styles.signupHighlight}>Create one →</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    container: { flex: 1, backgroundColor: colors.background },
    bg: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    },
    bgGlowOne: {
      position: 'absolute',
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: colors.primary + '22',
      top: -60,
      right: -80,
    },
    bgGlowTwo: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.primary + '12',
      bottom: 40,
      left: -60,
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 40,
      zIndex: 1,
    },
    brandArea: {
      alignItems: 'center',
      paddingTop: 80,
      paddingBottom: 20,
    },
    logoImage: {
      width: 140,
      height: 140,
      marginBottom: 4,
    },
    tagline: {
      fontSize: 15,
      color: colors.textMuted,
      letterSpacing: 0.3,
    },
    brandPills: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
    },
    brandPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    brandPillText: {
      fontSize: 11,
      color: colors.textMuted,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 24,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardAlt,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    inputBoxFocused: { borderColor: colors.primary },
    input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 14 },
    showBtn: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
      paddingLeft: 8,
    },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 },
    forgotText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
    btn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    btnActive: { backgroundColor: colors.primary },
    btnDisabled: {
      backgroundColor: colors.cardAlt,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    btnText: { fontSize: 16, fontWeight: '700', color: colors.background },
    btnTextDisabled: { color: colors.textSubtle },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
    dividerText: { color: colors.textSubtle, paddingHorizontal: 12, fontSize: 13 },
    googleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardAlt,
      borderRadius: 14,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      gap: 10,
    },
    googleIcon: { fontSize: 20 },
    googleText: { color: colors.text, fontSize: 15, fontWeight: '600' },
    signupLink: { marginTop: 24, alignItems: 'center' },
    signupText: { fontSize: 14, color: colors.textMuted },
    signupHighlight: { color: colors.primary, fontWeight: '700' },
  });
