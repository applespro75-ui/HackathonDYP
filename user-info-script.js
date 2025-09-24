// user-info.js  (full updated file)

// ✅ Firebase imports & config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// 🔹 Your existing Firebase config (replace with your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyCyMUrKQNX6-clW4wsaDiDeGC4HRdJfvrE",
  authDomain: "hackathon-app-c790e.firebaseapp.com",
  projectId: "hackathon-app-c790e",
  storageBucket: "hackathon-app-c790e.firebasestorage.app",
  messagingSenderId: "563910612296",
  appId: "1:563910612296:web:103b49f5874e62c4928f7d",
  measurementId: "G-GJX9RZNG16"
};

// 🔹 Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 Existing DOM references
const addMemberBtn = document.getElementById("add-member-btn");
const membersContainer = document.getElementById("members-container");
const submitBtn = document.getElementById("submit-btn");
const memberTemplate = document.getElementById("member-template");

// 🔹 Add new member card
addMemberBtn.addEventListener("click", () => {
  const clone = memberTemplate.content.cloneNode(true);
  membersContainer.appendChild(clone);

  // Attach remove button event
  membersContainer.querySelectorAll(".remove-member-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".member-card").remove();
    });
  });
});

// 🔹 Submit members
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

  // ✅ Save each member to Firestore
  try {
    for (const m of members) {
      await addDoc(collection(db, "members"), m);
    }
    alert("✅ Members saved to Firestore!");

    // Optional: also keep local copy and redirect
    localStorage.setItem("members", JSON.stringify(members));
    window.location.href = "shedule.html";
  } catch (err) {
    console.error("Error saving members:", err);
    alert("❌ Failed to save members. Check console.");
  }
});
