import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA3uHwxGtM9xpzWlq9wlFKTFqzGrCQ8-Z0',
  authDomain: 'zollege-b8acd.firebaseapp.com',
  projectId: 'zollege-b8acd',
  storageBucket: 'zollege-b8acd.firebasestorage.app',
  messagingSenderId: '136697714954',
  appId: '1:136697714954:web:bb5e2c1902f667bcac02f3',
  measurementId: 'G-7BCN03LDTV',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
