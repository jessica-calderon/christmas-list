import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
// Remove trailing slash from database URL if present
const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '');

if (!databaseURL) {
  console.error('VITE_FIREBASE_DATABASE_URL is not set');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: databaseURL || '',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

