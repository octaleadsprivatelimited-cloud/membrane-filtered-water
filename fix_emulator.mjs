import fs from 'fs';

let config = fs.readFileSync('src/firebase/config.js', 'utf8');
config = config.replace(
  "const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATORS !== 'false';",
  "const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';"
);
fs.writeFileSync('src/firebase/config.js', config);

console.log('Firebase config patched!');
