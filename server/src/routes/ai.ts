import { Router, Request, Response } from "express";
import OpenAI from "openai";

export const aiRouter = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

aiRouter.post("/", async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: query
    });

    const answer = completion.output_text; 

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed." });
  }
});
