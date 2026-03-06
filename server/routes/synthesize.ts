import { Router } from "express";
import OpenAI from "openai";
import { getSystemPrompt } from "../prompts";

const router = Router();

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return new OpenAI({ apiKey});
}

router.post("/", async (req, res) => {
  const { transcript, question, category, protocol } = req.body;
  if (!transcript || transcript.trim().length < 10) {
    return res.status(400).json({ error: "Transcript too short" });
  }
  const openai = getOpenAI();
  if (!openai) {
    return res.status(503).json({
      error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env file.",
    });
  }
  try {
    const systemPrompt = getSystemPrompt(protocol, category);
    if (!systemPrompt) {
      return res.status(400).json({ error: "Unknown protocol" });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Question: ${question}\n\nResponse: ${transcript}`,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ error: "Empty response from OpenAI" });
    }
    const result = JSON.parse(content);
    res.json({
      ...result,
      timestamp: new Date().toISOString(),
      questionIndex: req.body.questionIndex,
    });
  } catch (error) {
    console.error("Synthesis error:", error);
    res.status(500).json({ error: "Synthesis failed. Transcript saved." });
  }
});

export { router as synthesizeRouter };
