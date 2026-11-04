import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSM33u7YQgfF0PfwbXqOzrcn8fGnFNfx4",
  authDomain: "sn-web-technologies.firebaseapp.com",
  projectId: "sn-web-technologies",
  storageBucket: "sn-web-technologies.firebasestorage.app",
  messagingSenderId: "1053897012044",
  appId: "1:1053897012044:web:07bd5d9d46732703a755e9",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
