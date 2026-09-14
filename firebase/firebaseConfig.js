// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNRhJzKRQ1XWpmZPBiDrWD68Ixm8JqC_I",
  authDomain: "homehub-88bb9.firebaseapp.com",
  projectId: "homehub-88bb9",
  storageBucket: "homehub-88bb9.firebasestorage.app",
  messagingSenderId: "466040038836",
  appId: "1:466040038836:web:546f9a36ef311e4d7f3ee1",
  measurementId: "G-VG6VXDZKN6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
