// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDfg0d4Te7gMNfRraWpIDghEl9DJ16hMk4",
  authDomain: "vaarta-bbc3f.firebaseapp.com",
  projectId: "vaarta-bbc3f",
  storageBucket: "vaarta-bbc3f.firebasestorage.app",
  messagingSenderId: "576870426994",
  appId: "1:576870426994:web:13f1d83ea1ada7e0e115eb",
  measurementId: "G-LSP1P2H70F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
