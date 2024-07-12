// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-project-f8d63.firebaseapp.com",
  projectId: "mern-project-f8d63",
  storageBucket: "mern-project-f8d63.appspot.com",
  messagingSenderId: "41627239305",
  appId: "1:41627239305:web:55a3f5b20d19ba25b3d758"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);