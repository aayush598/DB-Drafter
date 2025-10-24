// prompts/v1/generateTableSchemaPrompt.ts
export const generateTableSchemaPrompt = (
  tableInfo: any,
  allTables: string[]
) => `
Generate a complete SQL CREATE TABLE statement for this table.

Table Info:
${tableInfo.description}

All tables in the database: ${allTables.join(", ")}

Requirements:
1. PostgreSQL syntax (portable)
2. Include columns with proper data types
3. Define PRIMARY KEY
4. Define FOREIGN KEYS
5. Add NOT NULL & CHECK constraints
6. Include indexes for performance
7. Comment each part

Return JSON:
{
  "sql_schema": "CREATE TABLE statement",
  "indexes": ["CREATE INDEX ..."],
  "relationships": ["table dependencies"],
  "notes": "Implementation details"
}
`;
