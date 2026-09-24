import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const emulator = false;
export const projectId = process.env.FIREBASE_PROJECT_ID || 'membrane-7677f';

initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  projectId: projectId
});

export const auth = getAuth();
export const db = getFirestore();
