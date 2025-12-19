import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration - hardcoded for private repository
const firebaseConfig = {
  apiKey: 'AIzaSyC8S19DYHafqA30OMQG68uedWewd99_qAk',
  authDomain: 'christmas-2025-76726.firebaseapp.com',
  projectId: 'christmas-2025-76726',
  storageBucket: 'christmas-2025-76726.firebasestorage.app',
  messagingSenderId: '881980158194',
  appId: '1:881980158194:web:0cc9a535852a8a5d9d606b',
  databaseURL: 'https://christmas-2025-76726-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
