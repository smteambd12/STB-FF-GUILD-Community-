import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCiAmiH01c4MI8A6xkLpSwqJN-HCRoziPE",
  authDomain: "stb-test-62964.firebaseapp.com",
  databaseURL: "https://stb-test-62964-default-rtdb.firebaseio.com",
  projectId: "stb-test-62964",
  storageBucket: "stb-test-62964.firebasestorage.app",
  messagingSenderId: "716138296053",
  appId: "1:716138296053:web:e1b7ceb4bccf85b47b8bbc",
  measurementId: "G-RDVHRQDTE7"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  if (typeof window !== 'undefined') {
    getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db };
export const googleProvider = new GoogleAuthProvider();
