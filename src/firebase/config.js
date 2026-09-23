import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATORS !== 'false';
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-aquapure-store',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-aquapure-store.firebaseapp.com',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app',
});
export const auth = getAuth(app);
if (useEmulator) connectAuthEmulator(auth, 'http://127.0.0.1:9199', {disableWarnings:true});
export const isEmulator = useEmulator;
