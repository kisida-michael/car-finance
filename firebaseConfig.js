import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBs25PvCdKqlR40pwk5dD-A6-EbBfZJ1W4",
  authDomain: "awautofinancing.firebaseapp.com",
  projectId: "awautofinancing",
  storageBucket: "awautofinancing.appspot.com",
  messagingSenderId: "1070604237912",
  appId: "1:1070604237912:web:d0c12f23df1efa26bb1e2d",
  measurementId: "G-KCKD7WN5L2",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
