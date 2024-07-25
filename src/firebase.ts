// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmM0_Z3wk3JjYT0wKUfOYiVwpFuwktI6g",
  authDomain: "interactive-comments-sec-38213.firebaseapp.com",
  projectId: "interactive-comments-sec-38213",
  storageBucket: "interactive-comments-sec-38213.appspot.com",
  messagingSenderId: "416490737419",
  appId: "1:416490737419:web:94e5f078e097d1a9c7dc0e",
  measurementId: "G-PHJJK3XGXL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
