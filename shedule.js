document.getElementById("planForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // 🔹 Collect Lifestyle
  const lifestyle = {
    activity: document.getElementById("activity").value,
    workSchedule: document.getElementById("workSchedule").value,
    sleep: document.getElementById("sleep").value,
  };

  // 🔹 Collect Goals
  const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
                     .map(g => g.value);

  // 🔹 Collect Preferences
  const preferences = {
    workoutType: document.getElementById("workoutType").value,
    duration: document.getElementById("duration").value,
    intensity: document.getElementById("intensity").value,
    goals,
    schedule: {
      days: Array.from(document.querySelectorAll('input[name="days"]:checked'))
                 .map(d => d.value),
      time: document.getElementById("time").value,
    }
  };

  // 🔹 Collect Members from localStorage (saved in user-info.html)
  const members = JSON.parse(localStorage.getItem("members")) || [];

  console.log("📤 Sending to backend:", { members, preferences });

  try {
    const response = await fetch("https://fitness-backend.onrender.com/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members, preferences })
    });

    if (!response.ok) throw new Error("Failed to fetch AI plan");

    const aiPlan = await response.json();

    console.log("✅ AI Plan received:", aiPlan);

    // 🔹 Show AI Plan in results section
    const planSection = document.getElementById("aiPlanSection");
    const planOutput = document.getElementById("aiPlanOutput");
    planOutput.innerHTML = "";

    Object.entries(aiPlan).forEach(([day, task]) => {
      const p = document.createElement("p");
      p.textContent = `${day}: ${task}`;
      planOutput.appendChild(p);
    });

    planSection.classList.remove("hidden");
  } catch (err) {
    alert("❌ Error: " + err.message);
    console.error(err);
  }
});

