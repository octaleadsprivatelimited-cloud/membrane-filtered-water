import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
const app = initializeApp({
  apiKey: 'AIzaSyAQ9WiLj0jyfC-u-zWc0qv8OdkQltUm_sU',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (useEmulator?'demo-aquapure-store':'membrane-7677f'),
  authDomain: 'membrane-7677f.firebaseapp.com',
  appId: '1:980039882568:web:ab7cdc40936d977089057d',
  storageBucket: 'membrane-7677f.firebasestorage.app',
  messagingSenderId: '980039882568',
  measurementId: 'G-XRJWN4TPHR',
});

export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

if (useEmulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9199', {disableWarnings:true});
}
export const isEmulator = useEmulator;
