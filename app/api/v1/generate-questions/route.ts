import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getGeminiClient, extractJsonFromResponse, sessions } from "@/lib/utils";
import { PromptService } from "@/lib/promptService";

export async function POST(req: Request) {
  try {
    const { description, api_key, model_name = "gemini-2.5-flash" } = await req.json();

    if (!description || !api_key)
      return NextResponse.json({ error: "Missing description or api_key" }, { status: 400 });

    const client = getGeminiClient(api_key);
    const prompts = PromptService.getPrompt("v1");

    const prompt = prompts.generateQuestionsPrompt(description);

    const result = await client.models.generateContent({ model: model_name, contents: prompt });
    const responseText = result.text?.trim() ?? "";
    const data = extractJsonFromResponse(responseText);

    if (!data?.questions) throw new Error("Invalid Gemini response format");

    const sessionId = `session_${uuidv4()}`;
    sessions[sessionId] = { project_description: description, api_key, model_name, questions: data.questions };

    return NextResponse.json({ session_id: sessionId, questions: data.questions, project_description: description });
  } catch (err: any) {
    console.error("Error generating questions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
