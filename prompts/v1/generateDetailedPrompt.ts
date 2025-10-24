// prompts/v1/generateDetailedPrompt.ts
export const generateDetailedPrompt = (
  projectDescription: string,
  answersText: string
) => `
You are a senior database architect. Based on the project description and user answers,
create a comprehensive database design plan.

Project Description:
${projectDescription}

User Requirements:
${answersText}

Output JSON format:
{
  "design_overview": "Summary of database structure and reasoning",
  "tables": [
    {
      "table_name": "users",
      "sequence_order": 1,
      "description": "Detailed description with columns, keys, indexes, and relationships",
      "dependencies": []
    }
  ]
}
Ensure dependency order (no foreign keys first). 
Provide detailed, production-quality design information.
`;
