import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs25PvCdKqlR40pwk5dD-A6-EbBfZJ1W4",
  authDomain: "awautofinancing.firebaseapp.com",
  projectId: "awautofinancing",
  storageBucket: "awautofinancing.appspot.com",
  messagingSenderId: "1070604237912",
  appId: "1:1070604237912:web:d0c12f23df1efa26bb1e2d",
  measurementId: "G-KCKD7WN5L2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

export { auth, provider, firestore };