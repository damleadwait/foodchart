import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn7RYAGCUxl8BspOSUQOOSUuM2Ft93Sqw",
  authDomain: "foodchart-7338a.firebaseapp.com",
  projectId: "foodchart-7338a",
  storageBucket: "foodchart-7338a.firebasestorage.app",
  messagingSenderId: "1035593541086",
  appId: "1:1035593541086:web:8d3866c934bdc653dee94f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);