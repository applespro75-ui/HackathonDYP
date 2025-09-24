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
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId") || "guest";

  const members = [];
  membersContainer.querySelectorAll(".member-card").forEach(card => {
    const member = {
      name: card.querySelector('input[name="name"]').value,
      gender: card.querySelector('select[name="gender"]').value,
      age: card.querySelector('input[name="age"]').value,
      workout_time: card.querySelector('select[name="workout_time"]').value,
      medical: card.querySelector('input[name="medical"]').value,
      userId
    };
    members.push(member);
  });

  // 🔹 Save members in localStorage for shedule.html
  localStorage.setItem("members", JSON.stringify(members));

  console.log("Members ready for backend:", members);

  alert("✅ Members saved! Now go to Schedule page.");

  // Optional: redirect to schedule page
  window.location.href = "shedule.html";

  // 🔹 Optional: If you have backend ready, you can send members directly
  // fetch("http://localhost:5000/api/save-members", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(members)
  // });
});

