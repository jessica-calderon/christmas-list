import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
// Remove trailing slash from database URL if present
const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '');

// Fail fast if required database URL is missing
if (!databaseURL || databaseURL.trim() === '') {
  throw new Error(
    'VITE_FIREBASE_DATABASE_URL is required but was not set. ' +
    'Please configure this environment variable in your .env file or GitHub Secrets.'
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: databaseURL,
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
