import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI fitness plan
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { members, preferences } = req.body;

    const prompt = `
You are a professional AI fitness coach.
Create a personalized weekly workout and yoga plan.

### Members:
${JSON.stringify(members, null, 2)}

### Preferences:
${JSON.stringify(preferences, null, 2)}

Rules:
- Consider medical issues.
- Align workouts with preferred workout time and schedule.
- Choose exercise type & intensity based on lifestyle, goals, and preferences.
- Output must be in JSON format with days as keys.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI fitness assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    let plan;
    try {
      plan = JSON.parse(aiResponse);
    } catch (e) {
      return res.status(500).json({ error: "AI response invalid JSON", raw: aiResponse });
    }

    res.json(plan);
  } catch (error) {
    console.error("❌ Error generating plan:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
