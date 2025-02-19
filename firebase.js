import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnMonX4A3TciLeCZsCkey96_i-BPoZ-hM",
  authDomain: "cloud-763e7.firebaseapp.com",
  projectId: "cloud-763e7",
  storageBucket: "cloud-763e7.firebasestorage.app",
  messagingSenderId: "617436926092",
  appId: "1:617436926092:web:6587ea9fc1ef1fafedaba9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
