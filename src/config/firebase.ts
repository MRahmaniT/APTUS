import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  projectId: "valid-terminal-mlcf1",
  appId: "1:939567969403:web:606f2d149318cd90eedede",
  apiKey: "AIzaSyDqK-hU_mkQgABuuWjtskdOcg1fV9db4n0",
  authDomain: "valid-terminal-mlcf1.firebaseapp.com",
  storageBucket: "valid-terminal-mlcf1.firebasestorage.app",
  messagingSenderId: "939567969403",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-homepagedesign-8fda91d8-519d-49c2-bbfd-5095f860a578");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const trackPageView = async () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const statRef = doc(db, "analytics", today);
  try {
    await setDoc(statRef, { views: increment(1), date: today }, { merge: true });
  } catch (e) {
    console.error("Failed to track view", e);
  }
};
