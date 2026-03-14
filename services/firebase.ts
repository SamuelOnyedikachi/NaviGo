import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// ─── Paste your real values from Firebase Console ───────
// Firebase Console → Project Settings → Your Apps → SDK setup
const getEnv = (primary: string, fallback?: string) =>
  process.env[primary] ?? (fallback ? process.env[fallback] : undefined);

const firebaseConfig = {
  apiKey: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
  authDomain: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'AUTH_DOMAIN'),
  projectId: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'PROJECT_ID'),
  storageBucket: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'STORAGE_BUCKET'),
  messagingSenderId: getEnv(
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_MESSAGING_SENDER_ID'
  ),
  appId: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID', 'ANDROID_APP_ID'),
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `[firebase] Missing config values: ${missingKeys.join(
      ', '
    )}. Add them to your .env using EXPO_PUBLIC_* keys and restart Expo.`
  );
}

// Prevent re-initializing on hot reload
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Use AsyncStorage for auth persistence (required for React Native)
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error: any) {
    if (error?.code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw error;
  }
})();

export const db = getFirestore(app);
export default app;
