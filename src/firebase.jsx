import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGCnLc1bx2se4BzTm3BhlE9xWjuvajJpI",
  authDomain: "realtime-chat-website-43f8d.firebaseapp.com",
  projectId: "realtime-chat-website-43f8d",
  storageBucket: "realtime-chat-website-43f8d.firebasestorage.app",
  messagingSenderId: "250379537062",
  appId: "1:250379537062:web:ad437561b19855c8644267",
  measurementId: "G-YYDFNW602D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);