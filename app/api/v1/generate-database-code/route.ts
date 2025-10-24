import { NextResponse } from "next/server";
import { sessions, generateGeminiContent, extractJsonFromResponse } from "@/lib/utils";
import { PromptService } from "@/lib/promptService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, language, framework, include_models, include_migrations, include_repositories } = body;

    const session = sessions[session_id];
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const tablesInfo = session.detailed_design.tables.map((t: any) => ({
      name: t.table_name,
      sql: session.table_schemas[t.table_name]?.sql_schema ?? "",
    }));

    const tablesSql = tablesInfo.map((t: any) => `-- ${t.name}\n${t.sql}`).join("\n\n");

    const prompts = PromptService.getPrompt("v1");
    const prompt = prompts.generateDatabaseCodePrompt(
      language,
      framework,
      session.project_description,
      tablesSql,
      include_models,
      include_migrations,
      include_repositories
    );

    const responseText = await generateGeminiContent({
      contents: prompt,
      apiKey: session.api_key,
      model: session.model_name,
    });

    const codeData = extractJsonFromResponse(responseText);
    session.generated_code ??= {};
    session.generated_code[`${language}_${framework}`] = codeData;

    return NextResponse.json({
      session_id,
      language,
      framework,
      ...codeData,
    });
  } catch (err: any) {
    console.error("Error generating DB code:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
