import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_ObKQb4SNAj9NG3Skf9tELjrNhjKD5HU",
  authDomain: "rumaket-id.firebaseapp.com",
  projectId: "rumaket-id",
  storageBucket: "rumaket-id.firebasestorage.app",
  messagingSenderId: "413045896477",
  appId: "1:413045896477:web:42955173178dc69cf6ddf4"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
