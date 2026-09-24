import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-aquapure-store',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-aquapure-store.firebaseapp.com',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-aquapure-store.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

if (useEmulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9199', {disableWarnings:true});
}
export const isEmulator = useEmulator;
