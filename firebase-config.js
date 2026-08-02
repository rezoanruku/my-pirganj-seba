import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpTzM5ABQ_vGT_6_FNCX0CNanUehzU6Fs",
  authDomain: "my-pirganj-app.firebaseapp.com",
  projectId: "my-pirganj-app",
  storageBucket: "my-pirganj-app.firebasestorage.app",
  messagingSenderId: "892652647821",
  appId: "1:892652647821:web:10b7790e59b54ae194b9c4",
  measurementId: "G-5CHVY24TMB"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const auth = getAuth(app);
