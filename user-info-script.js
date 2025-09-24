import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCyMUrKQNX6-clW4wsaDiDeGC4HRdJfvrE",
  authDomain: "hackathon-app-c790e.firebaseapp.com",
  projectId: "hackathon-app-c790e",
  storageBucket: "hackathon-app-c790e.firebasestorage.app",
  messagingSenderId: "563910612296",
  appId: "1:563910612296:web:103b49f5874e62c4928f7d",
  measurementId: "G-GJX9RZNG16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const addMemberBtn = document.getElementById("add-member-btn");
const membersContainer = document.getElementById("members-container");
const submitBtn = document.getElementById("submit-btn");
const memberTemplate = document.getElementById("member-template");

// Add new member card
addMemberBtn.addEventListener("click", () => {
  const clone = memberTemplate.content.cloneNode(true);
  const newCard = clone.querySelector(".member-card");
  membersContainer.appendChild(clone);

  // Remove button for this card only
  newCard.querySelector(".remove-member-btn").addEventListener("click", () => {
    newCard.remove();
  });
});

// Submit members
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const userId = auth.currentUser?.uid || localStorage.getItem("userId") || "guest";

  const members = [];
  membersContainer.querySelectorAll(".member-card").forEach(card => {
    const member = {
      userId,
      name: card.querySelector('input[name="name"]').value,
      gender: card.querySelector('select[name="gender"]').value,
      age: card.querySelector('input[name="age"]').value,
      workout_time: card.querySelector('select[name="workout_time"]').value,
      medical: card.querySelector('input[name="medical"]').value,
      createdAt: serverTimestamp()
    };
    members.push(member);
  });

  try {
    for (const m of members) {
      await addDoc(collection(db, "members"), m);
    }
    alert("✅ Members saved to Firestore!");
    localStorage.setItem("members", JSON.stringify(members));
    window.location.href = "shedule.html";
  } catch (err) {
    console.error("Error saving members:", err);
    alert("❌ Failed to save members. Check console.");
  }
});

