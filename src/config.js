import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyD_GdrfOLFnhWSFhpTFh4kxkdCxcx9xYbw",
  authDomain: "lawfirm-847fa.firebaseapp.com",
  databaseURL: "https://lawfirm-847fa-default-rtdb.firebaseio.com",
  projectId: "lawfirm-847fa",
  storageBucket: "lawfirm-847fa.appspot.com",
  messagingSenderId: "609784649668",
  appId: "1:609784649668:web:dfb8305b472f61a6c27691",
  measurementId: "G-ECKTV0CFKR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
