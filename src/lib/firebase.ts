// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0Bq95bMTEhqwqpVaD-q_Ynn9q_Am1l84",
  authDomain: "qrcodegen-26384.firebaseapp.com",
  projectId: "qrcodegen-26384",
  storageBucket: "qrcodegen-26384.firebasestorage.app",
  messagingSenderId: "1019067952634",
  appId: "1:1019067952634:web:98447658286e5110ac8843",
  measurementId: "G-N9E6J7VN6E"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
