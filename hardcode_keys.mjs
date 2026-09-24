import fs from 'fs';

let config = fs.readFileSync('src/firebase/config.js', 'utf8');

config = config.replace(
  /const app = initializeApp\(\{\s*apiKey:.*?\}\);/s,
  `const app = initializeApp({
  apiKey: 'AIzaSyAQ9WiLj0jyfC-u-zWc0qv8OdkQltUm_sU',
  projectId: 'membrane-7677f',
  authDomain: 'membrane-7677f.firebaseapp.com',
  appId: '1:980039882568:web:ab7cdc40936d977089057d',
  storageBucket: 'membrane-7677f.firebasestorage.app',
  messagingSenderId: '980039882568',
  measurementId: 'G-XRJWN4TPHR',
});`
);

config = config.replace(
  /const useEmulator = .*?;/,
  'const useEmulator = false;'
);

fs.writeFileSync('src/firebase/config.js', config);
console.log('Frontend Firebase keys hardcoded.');
