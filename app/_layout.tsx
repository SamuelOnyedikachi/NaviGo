import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootLayoutNav () {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { isDark, colors } = useTheme();

useEffect(() => {
  if (isLoading) return;

  const inAuthGroup = segments[0] === '(auth)';

  if (!user) {
    if (!inAuthGroup) {
      router.replace('/(auth)/login');
    }
    return;
  }

  if (!user.emailVerified) {
    if (!inAuthGroup) {
      router.replace('/(auth)/login');
    }
    return;
  }

  if (user && inAuthGroup) {
    router.replace('/(tabs)');
  }
}, [user, isLoading, segments]);

if (isLoading) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

return (
  <>
  <StatusBar style={isDark ? 'light' : 'dark'} />
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name='(auth)/login' />
    <Stack.Screen name='(auth)/signup' />
    <Stack.Screen name='(auth)/verify-email' />
    <Stack.Screen name='(tabs)' />
  </Stack>
  </>
);
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
