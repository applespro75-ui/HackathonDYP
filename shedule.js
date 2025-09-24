document.getElementById('planForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Collect Lifestyle info
  const lifestyle = {
    activity: document.getElementById('activity').value,
    workSchedule: document.getElementById('workSchedule').value,
    sleep: document.getElementById('sleep').value
  };

  // Collect Goals
  const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
                     .map(g => g.value);

  // Collect Preferences
  const preferences = {
    workoutType: document.getElementById('workoutType').value,
    duration: document.getElementById('duration').value,
    intensity: document.getElementById('intensity').value
  };

  // Collect Schedule
  const schedule = {
    days: Array.from(document.querySelectorAll('input[name="days"]:checked'))
                .map(day => day.value),
    time: document.getElementById('time').value
  };

  // Final JSON to send
  const userPlanData = { lifestyle, goals, preferences, schedule };

  console.log("Sending user info to backend:", userPlanData);

  try {
    // ✅ Send data to your backend API
    const response = await fetch("http://localhost:5000/api/generate-plan", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPlanData)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI plan");
    }

    // ✅ Get AI plan from backend
    const aiPlan = await response.json();

    // Show plan
    const planSection = document.getElementById('aiPlanSection');
    const planOutput = document.getElementById('aiPlanOutput');
    planOutput.innerHTML = "";

    for (let day in aiPlan) {
      const p = document.createElement("p");
      p.textContent = `${day}: ${aiPlan[day]}`;
      planOutput.appendChild(p);
    }

    planSection.classList.remove('hidden');
  } catch (err) {
    alert("Error getting AI plan: " + err.message);
    console.error(err);
  }
});
