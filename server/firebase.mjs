import {initializeApp,cert,applicationDefault} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
export const emulator=process.env.STORE_MODE==='emulator';
export const projectId=process.env.FIREBASE_PROJECT_ID||(emulator?'demo-aquapure-store':'membrane-7677f');
let app,initializationError;
try {
 if(emulator){
  if(!projectId.startsWith('demo-'))throw new Error('Use a demo- project ID for emulators.');
  process.env.FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:9199';
  process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8181';
  app=initializeApp({projectId});
 }else{
  if(process.env.FIREBASE_AUTH_EMULATOR_HOST||process.env.FIRESTORE_EMULATOR_HOST)throw new Error('Live mode cannot use emulator endpoints.');
  let credential;
  if(process.env.FIREBASE_SERVICE_ACCOUNT){
   let account;
   try{account=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);}catch{throw new Error('FIREBASE_SERVICE_ACCOUNT must be valid JSON.');}
   if(account.project_id!==projectId)throw new Error('Firebase service account project does not match FIREBASE_PROJECT_ID.');
   if(typeof account.private_key==='string')account.private_key=account.private_key.replace(/\\n/g,'\n');
   credential=cert(account);
  }else{
   if(process.env.VERCEL&&!process.env.GOOGLE_APPLICATION_CREDENTIALS)throw new Error('Configure FIREBASE_SERVICE_ACCOUNT in the Vercel server environment.');
   credential=applicationDefault();
  }
  app=initializeApp({projectId,credential});
 }
}catch(error){initializationError=error;console.error('Firebase initialization:',error.message);}
export function assertFirebaseReady(){
 if(initializationError){const error=new Error('Store account services are not configured. Please contact support.');error.status=503;error.code='STORE_CONFIGURATION';throw error;}
}
export const auth=app?getAuth(app):null;
export const db=app?getFirestore(app):null;
