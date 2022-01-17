import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyDZL4a3e9N69dRFhf1hgw--5qUXTWJjAy0',
  authDomain: 'board-98d8a.firebaseapp.com',
  projectId: 'board-98d8a',
  storageBucket: 'board-98d8a.appspot.com',
  messagingSenderId: '448337846350',
  appId: '1:448337846350:web:5cf8d0c5343df646bb231f',
  measurementId: 'G-5QPKW17VQ3',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
