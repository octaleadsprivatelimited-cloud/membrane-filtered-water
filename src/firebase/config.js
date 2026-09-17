import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Demo configuration. Once a real Firebase project is set up, replace these values.
const firebaseConfig = {
  apiKey: "DEMO_API_KEY",
  authDomain: "demo-membrane-water.firebaseapp.com",
  projectId: "demo-membrane-water",
  storageBucket: "demo-membrane-water.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
