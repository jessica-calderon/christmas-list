import { initializeApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

// Validate Firebase configuration
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Firebase configuration missing. Missing environment variables: ${missingVars.join(', ')}. ` +
    `Please create a .env file with all required Firebase configuration variables. ` +
    `See .env.example for reference.`
  );
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || '',
  authDomain: requiredEnvVars.authDomain || '',
  projectId: requiredEnvVars.projectId || '',
  storageBucket: requiredEnvVars.storageBucket || '',
  messagingSenderId: requiredEnvVars.messagingSenderId || '',
  appId: requiredEnvVars.appId || '',
  databaseURL: 'https://christmas-2025-76726-default-rtdb.firebaseio.com/',
};

// Only initialize Firebase if we have the minimum required config
const isFirebaseConfigured = requiredEnvVars.apiKey && requiredEnvVars.projectId;

let app;
let database: Database | undefined;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase not initialized due to missing configuration');
}

export { database };

