import fs from 'fs';

const sa = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));
let fb = fs.readFileSync('server/firebase.mjs', 'utf8');

fb = fb.replace(
  "import { initializeApp, applicationDefault } from 'firebase-admin/app';",
  "import { initializeApp, cert } from 'firebase-admin/app';"
);
fb = fb.replace(
  /export const emulator = [^\n]+;/,
  "export const emulator = false;"
);
fb = fb.replace(
  /export const projectId = [^\n]+;/,
  "export const projectId = '" + sa.project_id + "';"
);
fb = fb.replace(/if \(emulator\) \{[\s\S]*?\} else \{[\s\S]*?\}/, '');
fb = fb.replace(
  /initializeApp\(.*?\);/,
  "initializeApp({ credential: cert(" + JSON.stringify(sa) + "), projectId: projectId });"
);

fs.writeFileSync('server/firebase.mjs', fb);
console.log("Firebase hardcoded successfully");
