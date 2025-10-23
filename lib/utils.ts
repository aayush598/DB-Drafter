// lib/utils.ts
import { GoogleGenAI } from "@google/genai";

// ✅ Initialize Gemini client
// If you want to use dynamic API keys (like your FastAPI version),
// you can call `getGeminiClient(apiKey)` instead of the default `ai` instance below.
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "", // fallback for env-based auth
});

// ✅ Optional per-request client (for user-supplied API keys)
export function getGeminiClient(apiKey?: string) {
  return new GoogleGenAI({
    apiKey: apiKey || process.env.GEMINI_API_KEY || "",
  });
}

// ✅ Extract JSON safely from model responses
export function extractJsonFromResponse(text: string): any {
  // Clean up Markdown code blocks (Gemini often wraps responses in ```json)
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

// ✅ Helper to call Gemini model with consistent structure
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

  // Depending on the SDK version, the text field may differ
  const text = (response?.response?.text ?? response?.text ?? "").trim();
  if (!text) throw new Error("Empty response from Gemini model");
  return text;
}
