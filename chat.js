import { auth, database } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, query, push, orderByChild, startAt, endAt } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Get references to DOM elements
const contactNameElement = document.getElementById("contact-name");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const messageArea = document.getElementById("message-area");
const translationToggle = document.getElementById("translation-toggle");

// Function to get current location of the user
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

// Authenticate user and initialize the chat
onAuthStateChanged(auth, (user) => {
  if (user) {
    contactNameElement.textContent = user.email || "Anonymous";
    saveUserLocation(user.uid); // Save user's location to Firebase
    loadMessagesWithinProximity(user); // Load proximity-based messages
  } else {
    window.location.href = "login.html"; // Redirect to login if not authenticated
  }
});

// Save user location in Firebase
async function saveUserLocation(userId) {
  try {
    const location = await getUserLocation();
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      lat: location.latitude,
      lon: location.longitude,
      timestamp: Date.now(),
    });
    console.log("User location saved:", location);
  } catch (error) {
    console.error("Error saving user location:", error);
  }
}

// Haversine formula to calculate distance between two geo-coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of Earth in meters
  const φ1 = lat1 * Math.PI / 180; // Latitude in radians
  const φ2 = lat2 * Math.PI / 180; // Latitude in radians
  const Δφ = (lat2 - lat1) * Math.PI / 180; // Difference in latitude
  const Δλ = (lon2 - lon1) * Math.PI / 180; // Difference in longitude

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

// Load messages within 500 meters of the user
async function loadMessagesWithinProximity(userId) {
  const userLocation = await getUserLocation();
  const messagesRef = ref(database, "messages");

  onValue(messagesRef, (snapshot) => {
    messageArea.innerHTML = ""; // Clear existing messages
    snapshot.forEach((childSnapshot) => {
      const messageData = childSnapshot.val();
      const { text, lat, lon, senderId, displayName } = messageData;

      // Check if the message sender is within 500 meters
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lon);
      if (distance <= 500) {
        displayMessage(text, displayName);
      }
    });
  });
}

// Display a single message in the UI
function displayMessage(text, displayName) {
  const messageElement = document.createElement("div");
  messageElement.textContent = `${displayName}: ${text}`;
  messageArea.appendChild(messageElement);
}

// Translate message using API
async function translateMessage(text, sourceLang) {
  const apiUrl = `https://api.varnamproject.com/tl/${sourceLang}/` + text;
        console.log(apiUrl);
  const response = await fetch(apiUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result[0] || text; // Return translated text or original if translation failed
}

// Send a message
sendButton.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (text === "") return;

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to send a message.");
    return;
  }

  let messageText = text;

  // Check if translation is enabled
  if (translationToggle.checked) {
    try {
      messageText = await translateMessage(text, "ml"); // Translate from Malayalam to English
    } catch (error) {
      console.error("Error translating message:", error);
      alert("Could not translate the message. Sending original.");
    }
  }

  try {
    const location = await getUserLocation();
    const messageRef = push(ref(database, "messages"));
    await set(messageRef, {
      text: messageText,
      senderId: user.uid,
      displayName: user.email,
      lat: location.latitude,
      lon: location.longitude,
      timestamp: Date.now(),
    });
    messageInput.value = ""; // Clear the input
  } catch (error) {
    console.error("Error sending message:", error);
  }
});
