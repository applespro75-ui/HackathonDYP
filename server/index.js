import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in environment!");
  process.exit(1);
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Helper: build prompt from incoming preferences + members
 * We ask the model to return a JSON object with keys for each day of week,
 * and short summaries for each workout and whether it's yoga-focused, equipment, duration, intensity, and notes.
 */
function buildPrompt({ members, preferences, lifestyle }) {
  const p = preferences || {};
  const goals = (p.goals || []).join(", ") || "general fitness";
  const days = (p.schedule && p.schedule.days && p.schedule.days.length)
    ? p.schedule.days.join(", ")
    : "No specific days provided";
  const timePref = p.schedule && p.schedule.time ? p.schedule.time : "any time";
  const duration = p.duration || "30";
  const intensity = p.intensity || "medium";
  const workoutType = p.workoutType || "mixed";

  return `You are an expert fitness coach and yoga instructor. Given the user data below, generate a personalized weekly plan.
Return the response as JSON only (no extra text) with top-level keys: "summary" and "plan". 
"plan" should be an object with keys "Monday", "Tuesday", ... "Sunday". Each day value must be an object with:
  - "title" (short),
  - "type" (e.g. "Yoga", "HIIT", "Strength", "Cardio", "Rest"),
  - "duration_minutes" (integer),
  - "intensity" (low|medium|high),
  - "focus" (what body parts or benefits),
  - "equipment" (if any),
  - "exercise_list" (array of 3-8 short steps/exercises or yoga sequence),
  - "notes" (optional coaching tips).

User data (JSON):
${JSON.stringify({ members, preferences: p, lifestyle }, null, 2)}

Design the plan so:
- Align with goals: ${goals}.
- Fit preferred days/time: ${days} / ${timePref}.
- Respect duration ~ ${duration} minutes and intensity ${intensity}.
- Include at least two yoga-focused sessions if "flexibility" or "mental_wellness" is in goals.
- Keep sessions safe for a general adult population; include warm-up and cool-down notes.
- If no days are specified, suggest a 3-5 day/week plan.
- Keep each exercise_list item concise.

Output only valid JSON.`;
}

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { members = [], preferences = {}, lifestyle = {} } = req.body;

    const systemPrompt = "You are a professional certified fitness trainer and yoga teacher. Be concise and output JSON only.";
    const userPrompt = buildPrompt({ members, preferences, lifestyle });

    // Call OpenAI Responses API
    const response = await openai.responses.create({
      model: "gpt-4o-mini",       // change to a model you have access to (gpt-4, gpt-4o, etc.)
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_output_tokens: 1200
    });

    // Find text output (depends on model/response shape)
    // New SDK returns `response.output_text` as convenience on many models; fall back to parsing.
    let textOutput = response.output_text ?? null;
    // If not present, try to find structured output:
    if (!textOutput && response.output && Array.isArray(response.output) && response.output.length) {
      // join any content pieces
      textOutput = response.output.map(o => o.content || "").join(" ");
    }

    if (!textOutput) {
      return res.status(500).json({ error: "No output from OpenAI" });
    }

    // Try to parse JSON from the model's text
    let planJson;
    try {
      // The model should return pure JSON; if it wrapped in code fences, clean it:
      const cleaned = textOutput.replace(/^[\s\S]*?```(?:json)?\s*|```$/g, "").trim();
      planJson = JSON.parse(cleaned);
    } catch (parseErr) {
      // If parsing fails, return raw text and an error flag
      return res.status(200).json({
        success: false,
        raw_text: textOutput,
        message: "OpenAI output was not valid JSON. See raw_text for debugging."
      });
    }

    return res.json({ success: true, plan: planJson });
  } catch (err) {
    console.error("Error generating plan:", err);
    return res.status(500).json({ error: "Server error generating plan", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Spark Fitness AI backend is running.");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
