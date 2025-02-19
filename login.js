import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error logging in:", error.message);
    if (error.code === "auth/user-not-found") {
      alert("No user found with this email.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else {
      alert(`Login failed: ${error.message}`);
    }
  }
}

async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in with Google:", user);
    window.location.href = "home.html";
    document.getElementById("login-page").style.display = "none";
    document.getElementById("chat-app").style.display = "block";
  } catch (error) {
    console.error("Error with Google login:", error.message);
    alert(`Google login failed: ${error.message}`);
  }
}

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  logIn(email, password);
});

document.getElementById("google-login-btn").addEventListener("click", () => {
  googleLogin();
});
