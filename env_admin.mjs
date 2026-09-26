import fs from 'fs';

let fb = fs.readFileSync('server/firebase.mjs', 'utf8');

fb = fb.replace(
  "import { initializeApp, applicationDefault } from 'firebase-admin/app';",
  "import { initializeApp, cert } from 'firebase-admin/app';"
);
fb = fb.replace(
  /initializeApp\(.*?\);/,
  "initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)), projectId: process.env.FIREBASE_PROJECT_ID || 'membrane-7677f' });"
);

fs.writeFileSync('server/firebase.mjs', fb);
console.log("Firebase configured for FIREBASE_SERVICE_ACCOUNT successfully");
