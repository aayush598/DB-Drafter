import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getGeminiClient,
  extractJsonFromResponse,
  sessions,
} from "@/lib/utils";
import type { ProjectDescriptionInput, Question } from "@/lib/types";

// ✅ POST /api/v1/generate-questions
export async function POST(req: Request) {
  try {
    const body: ProjectDescriptionInput = await req.json();

    const { description, api_key, model_name = "gemini-2.5-flash" } = body;

    if (!description || !api_key) {
      return NextResponse.json(
        { error: "Missing required fields: description or api_key" },
        { status: 400 }
      );
    }

    // ✅ Initialize Gemini client with provided API key
    const client = getGeminiClient(api_key);

    // ✅ Build prompt (mirrors your FastAPI version)
    const prompt = `
Based on the following project description, generate 5–7 relevant questions to understand the database requirements better.

Project Description:
${description}

Generate questions about:
1. Project complexity level (Simple/Moderate/Complex/Enterprise)
2. Expected scale/number of users (Small <1K/Medium 1K-100K/Large 100K-1M/Enterprise >1M)
3. Data relationships complexity (Simple/Moderate/Complex)
4. Performance requirements (Basic/Standard/High/Critical)
5. Security level (Basic/Standard/High/Enterprise)
6. Additional domain-specific considerations

Return JSON in this format:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is the complexity level of the project?",
      "options": ["Simple", "Moderate", "Complex", "Enterprise"]
    },
    {
      "id": "q2",
      "question": "What is the expected scale/number of users?",
      "options": ["Small (<1K)", "Medium (1K-100K)", "Large (100K-1M)", "Enterprise (>1M)"]
    }
  ]
}
`;

    // ✅ Generate Gemini response
    const result = await client.models.generateContent({
      model: model_name,
      contents: prompt,
    });

    const responseText =
      result?.response?.text ?? (result as any)?.text ?? "";

    if (!responseText) {
      throw new Error("Empty response from Gemini model");
    }

    // ✅ Extract JSON safely
    const data = extractJsonFromResponse(responseText);

    if (!data?.questions || !Array.isArray(data.questions)) {
      throw new Error("Gemini response does not contain valid 'questions' array");
    }

    // ✅ Create a unique session
    const sessionId = `session_${uuidv4()}`;
    sessions[sessionId] = {
      project_description: description,
      questions: data.questions,
      api_key,
      model_name,
    };

    // ✅ Return response
    return NextResponse.json({
      session_id: sessionId,
      questions: data.questions.map((q: Question) => ({
        id: q.id,
        question: q.question,
        options: q.options,
      })),
      project_description: description,
    });
  } catch (error: any) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: `Error generating questions: ${error.message}` },
      { status: 500 }
    );
  }
}
