// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-d188f.firebaseapp.com",
  projectId: "task-manager-d188f",
  storageBucket: "task-manager-d188f.firebasestorage.app",
  messagingSenderId: "892405595893",
  appId: "1:892405595893:web:14f0d5d8e401b1dbc14fbc",
  measurementId: "G-46VPRLP480"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;