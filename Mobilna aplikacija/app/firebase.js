import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB6o_pSDPaZYwhZTabAQYMca9m7OtP_l8",
  authDomain: "seminar-30a3c.firebaseapp.com",
  projectId: "seminar-30a3c",
  storageBucket: "seminar-30a3c.firebasestorage.app",
  messagingSenderId: "278489722826",
  appId: "1:278489722826:web:245d6b565c531bea3e6933",
  measurementId: "G-XC8E16N9L8",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
