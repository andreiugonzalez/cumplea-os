import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACrUvBGaljfNYyjcgmeoh1np7MtLspNrY",
  authDomain: "cumpleandriu.firebaseapp.com",
  projectId: "cumpleandriu",
  storageBucket: "cumpleandriu.firebasestorage.app",
  messagingSenderId: "231006254154",
  appId: "1:231006254154:web:b5d05cf6d634b6af13a2b3",
  measurementId: "G-HVB4DWQXKM"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
