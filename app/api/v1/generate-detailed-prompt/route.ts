// app/api/v1/generate-detailed-prompt/route.ts
import { NextResponse } from "next/server";
import {
  getGeminiClient,
  extractJsonFromResponse,
  sessions,
} from "@/lib/utils";

/**
 * POST /api/v1/generate-detailed-prompt
 * 
 * Request Body:
 * {
 *   "session_id": string,
 *   "answers": { "q1": "Simple", "q2": "Small (<1K)" }
 * }
 * 
 * Response:
 * {
 *   "session_id": string,
 *   "detailed_prompt": string,
 *   "tables": [
 *     { "table_name": string, "description": string, "sequence_order": number }
 *   ]
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, answers } = body;

    // Validate session
    const session = sessions[session_id];
    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const client = getGeminiClient(session.api_key);
    const modelName = session.model_name || "gemini-2.5-flash";

    // Format user answers
    const answersText = Object.entries(answers)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join("\n");

    // Build prompt
    const prompt = `
You are a database architect. Based on the project description and answers provided, create a comprehensive database design plan.

Project Description:
${session.project_description}

User Requirements:
${answersText}

Create a detailed database design that includes:
1. All necessary tables with clear descriptions
2. Table relationships and dependencies
3. Proper sequencing for table creation (considering foreign key dependencies)
4. Data types considerations
5. Indexing recommendations
6. Constraints and validations

Return the response in the following JSON format:
{
  "design_overview": "Overall database design explanation",
  "tables": [
    {
      "table_name": "users",
      "sequence_order": 1,
      "description": "Detailed description including columns, keys, indexes, and relationships",
      "dependencies": []
    },
    {
      "table_name": "orders",
      "sequence_order": 2,
      "description": "Detailed description including columns, keys, indexes, and relationships",
      "dependencies": ["users"]
    }
  ]
}

Ensure tables are ordered by dependency (no foreign keys first, dependent tables after).
Provide comprehensive details for each table so it can be used to generate SQL schema.
`;

    // Call Gemini model
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    console.log(response)
    // Extract text and parse JSON
    // const responseText = response.response.text;
    const responseText = response.text?.trim() ?? "";
    const designData = extractJsonFromResponse(responseText);

    // Save in-memory session data
    sessions[session_id].detailed_design = designData;

    // Build detailed prompt text
    const detailedPrompt = `${designData.design_overview}\n\nTables:\n${designData.tables
      .map(
        (t: any) =>
          `${t.sequence_order}. ${t.table_name}: ${t.description}`
      )
      .join("\n\n")}`;

    // Format response
    const result = {
      session_id,
      detailed_prompt: detailedPrompt,
      tables: designData.tables.map((t: any) => ({
        table_name: t.table_name,
        description: t.description,
        sequence_order: t.sequence_order,
      })),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error generating detailed prompt:", error);
    return NextResponse.json(
      { error: `Error generating detailed prompt: ${error.message}` },
      { status: 500 }
    );
  }
}
