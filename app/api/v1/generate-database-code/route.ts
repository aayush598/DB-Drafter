import { NextResponse } from "next/server";
import { sessions, generateGeminiContent, extractJsonFromResponse } from "@/lib/utils";
import { CodeGenerationRequest, CodeGenerationResponse, CodeFile } from "@/lib/types";

// Define a type for table info used in mapping
interface TableInfo {
  name: string;
  sql: string;
  relationships: any[];
}

export async function POST(req: Request) {
  try {
    const requestData: CodeGenerationRequest = await req.json();
    const {
      session_id,
      language,
      framework,
      include_migrations = true,
      include_models = true,
      include_repositories = false,
    } = requestData;

    // 1️⃣ Validate session
    const session = sessions[session_id];
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!session.detailed_design) {
      return NextResponse.json(
        { error: "Detailed design not generated yet" },
        { status: 400 }
      );
    }

    if (!session.table_schemas || Object.keys(session.table_schemas).length === 0) {
      return NextResponse.json(
        { error: "No table schemas generated yet. Generate table schemas first." },
        { status: 400 }
      );
    }

    // 2️⃣ Gather table info for prompt
    const tablesInfo: TableInfo[] = session.detailed_design.tables
      .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
      .map((table: any) => {
        const schema = session.table_schemas[table.table_name];
        return {
          name: table.table_name,
          sql: schema?.sql_schema ?? "",
          relationships: schema?.relationships ?? [],
        };
      });

    const tablesSql = tablesInfo.map((t: TableInfo) => `-- ${t.name}\n${t.sql}`).join("\n\n");

    // 3️⃣ Build Gemini prompt
    let prompt = `
You are an expert database developer. Generate production-ready database setup code.

LANGUAGE: ${language}
FRAMEWORK: ${framework}
PROJECT: ${session.project_description}

DATABASE SCHEMA (SQL):
${tablesSql}

REQUIREMENTS:
1. Generate complete, production-ready code
2. Include proper error handling and validation
3. Follow best practices for ${framework}
4. Include all necessary imports and dependencies
`;

    if (include_models) {
      prompt += "\n5. Generate model/entity definitions for all tables with proper relationships";
    }
    if (include_migrations) {
      prompt += "\n6. Generate migration files for database schema creation";
    }
    if (include_repositories) {
      prompt += "\n7. Generate repository pattern implementation with CRUD operations";
    }

    prompt += `
Return response in JSON format:
{
  "files": [
    {
      "filename": "path/to/file.ext",
      "content": "complete file content with all code",
      "description": "brief description of the file purpose"
    }
  ],
  "setup_instructions": "Step-by-step instructions to setup and run the database code"
}
`;

    // 4️⃣ Call Gemini
    const responseText = await generateGeminiContent({
      contents: prompt,
      apiKey: session.api_key,
      model: session.model_name,
    });

    const codeData = extractJsonFromResponse(responseText);

    // 5️⃣ Store generated code in session
    if (!session.generated_code) session.generated_code = {};
    session.generated_code[`${language}_${framework}`] = {
      files: codeData.files,
      setup_instructions: codeData.setup_instructions,
    };

    // 6️⃣ Return typed response
    const files: CodeFile[] = codeData.files.map((f: any) => ({
      filename: f.filename,
      content: f.content,
      description: f.description,
    }));

    const result: CodeGenerationResponse = {
      session_id,
      language,
      framework,
      files,
      setup_instructions: codeData.setup_instructions,
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error generating database code:", error);
    return NextResponse.json(
      { error: `Error generating database code: ${error.message}` },
      { status: 500 }
    );
  }
}
