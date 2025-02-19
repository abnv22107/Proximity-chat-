import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

async function signUp(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    alert("Sign up successful! Please login to confirm identity.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert(`Sign up failed: ${error.message}`);
  }
}

async function googleSignup() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in with Google:", user);
    alert(`Google signup/login successful! Please login to confirm identity.`);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error with Google login:", error.message);
    alert(`Google login failed: ${error.message}`);
  }
}

document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  signUp(email, password, confirmPassword);
});

document.getElementById("google-signup-btn").addEventListener("click", () => {
  googleSignup();
});
