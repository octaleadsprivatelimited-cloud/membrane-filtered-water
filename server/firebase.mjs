import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const emulator = false;
export const projectId = process.env.FIREBASE_PROJECT_ID || 'membrane-7677f';

let authInstance = null;
let dbInstance = null;
let initError = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let credentialObj = null;
    try {
      credentialObj = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON.");
    }
    initializeApp({
      credential: cert(credentialObj),
      projectId: projectId
    });
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId: projectId
    });
  }

  authInstance = getAuth();
  dbInstance = getFirestore();
} catch (e) {
  initError = e.message;
}

export const auth = authInstance || new Proxy({}, { get: () => () => { throw new Error(initError) } });
export const db = dbInstance || new Proxy({}, { 
  get: (target, prop) => {
    if (prop === 'doc' || prop === 'collection' || prop === 'runTransaction') {
      return () => { throw new Error(initError) };
    }
    return undefined;
  }
});
