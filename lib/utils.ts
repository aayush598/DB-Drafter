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
    throw new Error("Invalid JSON format from Gemini response");
  }
}

// ✅ Simple in-memory session store (replace with Redis/DB in production)
export const sessions: Record<string, any> = {};

// ✅ Helper to call Gemini model and return text
export async function generateGeminiContent({
  model = "gemini-2.0-flash-lite",
  apiKey,
  contents,
}: {
  model?: string;
  apiKey?: string;
  contents: string;
}): Promise<string> {
  const client = getGeminiClient(apiKey);

  try {
    const response = await client.models.generateContent({
      model,
      contents,
    });

    const candidates = response.candidates ?? [];
    if (!candidates.length) {
      throw new Error("No candidates returned from Gemini model");
    }

    const candidate = candidates[0];
    const content = candidate.content;

    // Try multiple ways to extract text
    let text: string | undefined;

    // Method 1: content.parts[0].text (most common)
    if (content?.parts && Array.isArray(content.parts) && content.parts[0]?.text) {
      text = content.parts[0].text;
    }
    // Method 2: Direct array access (your original code)
    else if (Array.isArray(content) && content[0]?.text) {
      text = content[0].text;
    }
    // Method 3: Direct text property
    else if (typeof content === 'object' && 'text' in content) {
      text = (content as any).text;
    }

    if (!text) {
      throw new Error("No text found in Gemini response content");
    }

    return text.trim();
  } catch (error) {
    throw error;
  }
}