// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB74uNQQ4q3eBoXqCsu_7FqD9tmNck-rx4",
  authDomain: "tscc-4e9ba.firebaseapp.com",
  // Add your Firebase Realtime Database URL here:
  databaseURL: "https://tscc-4e9ba-default-rtdb.firebaseio.com/", 
  projectId: "tscc-4e9ba",
  storageBucket: "tscc-4e9ba.appspot.com",
  messagingSenderId: "235453370865",
  appId: "1:235453370865:web:fa85fbe96e63afd6cb3450",
  measurementId: "G-3ZXZVLJ3PE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Initialize and export the Realtime Database
export const db = getDatabase(app);

export default app;
