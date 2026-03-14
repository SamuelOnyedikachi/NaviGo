import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useTheme } from '@/context/ThemeContext';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: fullName.trim() });

      // Save user to Firestore database
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        role: 'rider',
        rating: 5.0,
        totalRides: 0,
        createdAt: new Date().toISOString(),
      });

      // Send email verification
      await sendEmailVerification(user);

      // Log out so they can sign in after verification
      await signOut(auth);

      Alert.alert(
        'Verify your email',
        'We sent a verification link. Please check your inbox, then sign in.'
      );

      // Go to login screen
      router.replace('/(auth)/login');
    } catch (error) {
      let message = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use')
        message = 'An account with this email already exists.';
      if (error.code === 'auth/invalid-email')
        message = 'Please enter a valid email address.';
      if (error.code === 'auth/weak-password')
        message = 'Password is too weak. Use at least 6 characters.';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    fullName.length > 1 &&
    email.length > 0 &&
    password.length >= 6 &&
    confirmPassword.length >= 6;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join NaviGo and start riding today
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View
            style={[
              styles.inputBox,
              focusedField === 'name' && styles.inputBoxFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Samuel Okafor"
              placeholderTextColor={colors.textSubtle}
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View
            style={[
              styles.inputBox,
              focusedField === 'email' && styles.inputBoxFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSubtle}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputBox,
              focusedField === 'password' && styles.inputBoxFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.inputBox,
              focusedField === 'confirm' && styles.inputBoxFocused,
              confirmPassword.length > 0 &&
                confirmPassword !== password &&
                styles.inputBoxError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              placeholderTextColor={colors.textSubtle}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
            />
            {confirmPassword.length > 0 && (
              <Text style={{ fontSize: 16 }}>
                {confirmPassword === password ? '✅' : '❌'}
              </Text>
            )}
          </View>

          {/* Sign up button */}
          <TouchableOpacity
            style={[
              styles.btn,
              isValid ? styles.btnActive : styles.btnDisabled,
            ]}
            onPress={handleSignup}
            disabled={!isValid || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text
                style={[styles.btnText, !isValid && styles.btnTextDisabled]}
              >
                Create Account →
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By signing up you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Login link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.back()}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginHighlight}>Sign In →</Text>
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
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
    backBtn: { alignSelf: 'flex-start', marginBottom: 24 },
    backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary + '22',
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    logoImage: { width: 32, height: 32 },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.cardBorder,
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
    inputBoxError: { borderColor: colors.danger },
    input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 14 },
    showBtn: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
      paddingLeft: 8,
    },
    btn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    btnActive: { backgroundColor: colors.primary },
    btnDisabled: {
      backgroundColor: colors.cardAlt,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    btnText: { fontSize: 16, fontWeight: '700', color: colors.background },
    btnTextDisabled: { color: colors.textSubtle },
    terms: {
      fontSize: 12,
      color: colors.textSubtle,
      textAlign: 'center',
      lineHeight: 18,
    },
    link: { color: colors.primary },
    loginLink: { marginTop: 24, alignItems: 'center' },
    loginText: { fontSize: 14, color: colors.textMuted },
    loginHighlight: { color: colors.primary, fontWeight: '700' },
  });
