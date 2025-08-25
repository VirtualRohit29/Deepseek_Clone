//

import OpenAI from "openai";
import { Promt } from "../model/promt.model.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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", // Use environment variable for security
});

export const sendPromt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Promt content is required" });
  }

  try {
    // Save user prompt
    const userPromt = await Promt.create({
      userId,
      role: "user",
      content,
    });

    // Send to OpenRouter API
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324", // Use OpenRouter DeepSeek model
      messages: [{ role: "user", content }],
    });

    const aiContent = completion.choices[0].message.content;

    // Save assistant prompt
    await Promt.create({
      userId,
      role: "assistant",
      content: aiContent,
    });

    return res.status(200).json({ reply: aiContent });
  } catch (error) {
    console.error("Error in Promt:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong with the AI response" });
  }
};
