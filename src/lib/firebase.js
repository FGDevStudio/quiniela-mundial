import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVDZVNjHhRRtEQw4EWqagc1xhuubIoc6c",

  authDomain: "quiniela-mundial-c1165.firebaseapp.com",

  projectId: "quiniela-mundial-c1165",

  storageBucket: "quiniela-mundial-c1165.firebasestorage.app",

  messagingSenderId: "502772521984",

  appId: "1:502772521984:web:90d7932951d2682a3f8ce5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);