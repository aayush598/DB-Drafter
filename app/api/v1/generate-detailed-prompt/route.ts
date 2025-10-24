import { NextResponse } from "next/server";
import { getGeminiClient, extractJsonFromResponse, sessions } from "@/lib/utils";
import { PromptService } from "@/lib/promptService";

export async function POST(req: Request) {
  try {
    const { session_id, answers } = await req.json();
    const session = sessions[session_id];
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const client = getGeminiClient(session.api_key);
    const prompts = PromptService.getPrompt("v1");

    const answersText = Object.entries(answers)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const prompt = prompts.generateDetailedPrompt(session.project_description, answersText);
    const response = await client.models.generateContent({ model: session.model_name, contents: prompt });

    const responseText = response.text?.trim() ?? "";
    const designData = extractJsonFromResponse(responseText);
    sessions[session_id].detailed_design = designData;

    const detailedPrompt = `${designData.design_overview}\n\n${designData.tables
      .map((t: any) => `${t.sequence_order}. ${t.table_name}: ${t.description}`)
      .join("\n\n")}`;

    return NextResponse.json({
      session_id,
      detailed_prompt: detailedPrompt,
      tables: designData.tables,
    });
  } catch (err: any) {
    console.error("Error generating detailed prompt:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
