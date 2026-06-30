import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClT7LnWd7C3CT0JloT9dDgb6DthDo_LbI",
  authDomain: "react-ecommerce-f4396.firebaseapp.com",
  projectId: "react-ecommerce-f4396",
  storageBucket: "react-ecommerce-f4396.firebasestorage.app",
  messagingSenderId: "527123053568",
  appId: "1:527123053568:web:ff66643cc01ffb1a8d6ce5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
