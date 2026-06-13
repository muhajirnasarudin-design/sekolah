import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIzGxSPcufTRMVyRcbKJAvzhelVnHIPNQ",
  authDomain: "eduschool-premium.firebaseapp.com",
  projectId: "eduschool-premium",
  storageBucket: "eduschool-premium.firebasestorage.app",
  messagingSenderId: "472368333107",
  appId: "1:472368333107:web:508878a6f29edbf45bfe46"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
