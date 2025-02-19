import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "home.html";
    } else {
        window.location.href = "login.html";
    }
});
