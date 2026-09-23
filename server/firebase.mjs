import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
export const emulator = process.env.STORE_MODE !== 'live';
export const projectId = process.env.FIREBASE_PROJECT_ID || 'demo-aquapure-store';
if (emulator) {
  if (!projectId.startsWith('demo-')) throw new Error('Emulator mode requires a demo- project ID.');
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9199';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8181';
} else {
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Live mode cannot use emulator credentials.');
  if (projectId.startsWith('demo-')) throw new Error('Configure a live Firebase project ID.');
}
initializeApp(emulator ? {projectId} : {projectId, credential:applicationDefault()});
export const auth = getAuth();
export const db = getFirestore();
