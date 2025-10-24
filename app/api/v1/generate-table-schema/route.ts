import { NextResponse } from "next/server";
import { sessions, generateGeminiContent, extractJsonFromResponse } from "@/lib/utils";
import { PromptService } from "@/lib/promptService";

export async function POST(req: Request) {
  try {
    const { session_id, table_name } = await req.json();
    const session = sessions[session_id];
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const tableInfo = session.detailed_design.tables.find((t: any) => t.table_name === table_name);
    const allTables = session.detailed_design.tables.map((t: any) => t.table_name);

    const prompts = PromptService.getPrompt("v1");
    const prompt = prompts.generateTableSchemaPrompt(tableInfo, allTables);

    const responseText = await generateGeminiContent({
      model: session.model_name,
      apiKey: session.api_key,
      contents: prompt,
    });

    const schemaData = extractJsonFromResponse(responseText);
    const fullSchema =
      schemaData.sql_schema +
      (schemaData.indexes?.length ? "\n\n-- Indexes\n" + schemaData.indexes.join("\n") : "") +
      (schemaData.notes ? `\n\n-- Notes: ${schemaData.notes}` : "");

    session.table_schemas ??= {};
    session.table_schemas[table_name] = { sql_schema: fullSchema, relationships: schemaData.relationships || [] };

    return NextResponse.json({ table_name, sql_schema: fullSchema });
  } catch (err: any) {
    console.error("Error generating table schema:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
