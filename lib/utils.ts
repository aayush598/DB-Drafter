// lib/utils.ts
import { GoogleGenAI } from "@google/genai";

// ✅ Initialize default Gemini client (uses env API key)
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// ✅ Optional per-request client (for dynamic API keys)
export function getGeminiClient(apiKey?: string) {
  return new GoogleGenAI({
    apiKey: apiKey || process.env.GEMINI_API_KEY || "",
  });
}

// ✅ Extract JSON safely from model responses
export function extractJsonFromResponse(text: string): any {
  // Remove Markdown code blocks (Gemini often wraps responses in ```json)
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  // Try to extract JSON
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No valid JSON found in response");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", err);
    throw new Error("Invalid JSON format from Gemini response");
  }
}

// ✅ Simple in-memory session store (replace with Redis/DB in production)
export const sessions: Record<string, any> = {};

// ✅ Helper to call Gemini model and return text
export async function generateGeminiContent({
  model = "gemini-2.5-flash",
  apiKey,
  contents,
}: {
  model?: string;
  apiKey?: string;
  contents: string;
}): Promise<string> {
  const client = getGeminiClient(apiKey);

  const response = await client.models.generateContent({
    model,
    contents,
  });

  const candidates = response.candidates ?? [];
  if (!candidates.length) {
    throw new Error("No candidates returned from Gemini model");
  }

  const contentParts = Array.isArray(candidates[0].content)
    ? candidates[0].content
    : [];

  if (!contentParts.length || !contentParts[0]?.text) {
    throw new Error("No text found in Gemini response content");
  }

  return contentParts[0].text.trim();
}
