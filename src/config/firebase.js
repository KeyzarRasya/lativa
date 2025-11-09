import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Quick validation to help surface misconfiguration early
const _requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const _missing = _requiredKeys.filter(k => !firebaseConfig[k]);
if (_missing.length > 0) {
  // Provide a helpful console error (this will be caught by the try/catch below)
  console.error(`Firebase config is missing required keys: ${_missing.join(', ')}.`);
  console.error('Make sure you have a .env (or .env.local) with VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID set.');
}

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { db, auth };
export default app;
