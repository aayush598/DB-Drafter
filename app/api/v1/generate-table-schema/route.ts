// app/api/v1/generate-table-schema/route.ts
import { NextResponse } from "next/server";
import { sessions, generateGeminiContent, extractJsonFromResponse } from "@/lib/utils";

interface TableSchemaRequest {
  session_id: string;
  table_name: string;
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const body: TableSchemaRequest = await req.json();
    const { session_id, table_name } = body;

    // Validate session
    const session = sessions[session_id];
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Ensure detailed design exists
    if (!session.detailed_design || !session.detailed_design.tables) {
      return NextResponse.json(
        { error: "Detailed design not generated yet" },
        { status: 400 }
      );
    }

    // Find the requested table
    const tableInfo = session.detailed_design.tables.find(
      (t: any) => t.table_name === table_name
    );

    if (!tableInfo) {
      return NextResponse.json(
        { error: `Table ${table_name} not found in detailed design` },
        { status: 404 }
      );
    }

    // Gather all table names for context
    const allTables = session.detailed_design.tables.map((t: any) => t.table_name);

    // Build Gemini prompt
    const prompt = `
Generate a complete SQL CREATE TABLE statement for the following table.

Table Information:
${tableInfo.description}

Available tables in database: ${allTables.join(", ")}

Requirements:
1. Use PostgreSQL syntax (but keep it compatible with most SQL databases)
2. Include all appropriate columns with proper data types
3. Define PRIMARY KEY constraint
4. Define FOREIGN KEY constraints where applicable
5. Add NOT NULL constraints where appropriate
6. Include CHECK constraints for validation
7. Add indexes for performance (as separate CREATE INDEX statements)
8. Add comments explaining the purpose of the table

Return the response in the following JSON format:
{
  "sql_schema": "Complete SQL CREATE TABLE statement with all constraints",
  "indexes": ["CREATE INDEX statements"],
  "relationships": ["Description of relationships with other tables"],
  "notes": "Additional implementation notes"
}

Ensure the SQL is production-ready and follows best practices.
`;

    // Call Gemini
    const responseText = await generateGeminiContent({
      model: session.model_name || "gemini-2.5-flash",
      apiKey: session.api_key,
      contents: prompt,
    });

    // Extract JSON from Gemini response
    const schemaData = extractJsonFromResponse(responseText);

    // Combine SQL schema with indexes and notes
    let fullSchema = schemaData.sql_schema || "";
    if (schemaData.indexes && schemaData.indexes.length > 0) {
      fullSchema += "\n\n-- Indexes\n" + schemaData.indexes.join("\n");
    }
    if (schemaData.notes) {
      fullSchema += `\n\n-- Notes: ${schemaData.notes}`;
    }

    // Store table schema in session for later code generation
    if (!session.table_schemas) session.table_schemas = {};
    session.table_schemas[table_name] = {
      sql_schema: fullSchema,
      relationships: schemaData.relationships || [],
    };

    // Return response
    return NextResponse.json({
      table_name,
      sql_schema: fullSchema,
      relationships: schemaData.relationships || [],
    });
  } catch (error: any) {
    console.error("Error in generate-table-schema:", error);
    return NextResponse.json(
      { error: `Error generating table schema: ${error.message}` },
      { status: 500 }
    );
  }
}
