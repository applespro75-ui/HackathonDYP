import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase config
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

// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const addMemberBtn = document.getElementById("add-member-btn");
  const membersContainer = document.getElementById("members-container");
  const submitBtn = document.getElementById("submit-btn");
  const memberTemplate = document.getElementById("member-template");

  // Add first member by default
  addMember();

  // Add new member
  addMemberBtn.addEventListener("click", addMember);

  function addMember() {
    const clone = memberTemplate.content.cloneNode(true);
    const newCard = clone.querySelector(".member-card");
    membersContainer.appendChild(clone);

    // Remove button
    const removeBtn = newCard.querySelector(".remove-member-btn");
    removeBtn.addEventListener("click", () => newCard.remove());
  }

  // Submit members
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const userId = auth.currentUser?.uid || localStorage.getItem("userId") || "guest";
    const members = [];

    membersContainer.querySelectorAll(".member-card").forEach(card => {
      const name = card.querySelector('input[name="name"]').value.trim();
      const age = card.querySelector('input[name="age"]').value.trim();
      if (!name || !age) return;

      members.push({
        userId,
        name,
        gender: card.querySelector('select[name="gender"]').value,
        age,
        workout_time: card.querySelector('select[name="workout_time"]').value,
        medical: card.querySelector('input[name="medical"]').value,
        createdAt: serverTimestamp()
      });
    });

    if (members.length === 0) {
      alert("Add at least one complete member before submitting!");
      return;
    }

    try {
      for (const m of members) {
        await addDoc(collection(db, "members"), m);
      }

      localStorage.setItem("members", JSON.stringify(members));
      alert("✅ Members saved successfully!");
      window.location.href = "interface.html";
    } catch (err) {
      console.error("Error saving members:", err);
      alert("❌ Failed to save members. Check console.");
    }
  });
});
