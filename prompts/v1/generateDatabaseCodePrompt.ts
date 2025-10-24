// prompts/v1/generateDatabaseCodePrompt.ts
export const generateDatabaseCodePrompt = (
  language: string,
  framework: string,
  projectDescription: string,
  tablesSql: string,
  include_models: boolean,
  include_migrations: boolean,
  include_repositories: boolean
) => {
  let prompt = `
You are an expert backend developer. Generate production-ready database setup code.

LANGUAGE: ${language}
FRAMEWORK: ${framework}
PROJECT: ${projectDescription}

DATABASE SCHEMA (SQL):
${tablesSql}

REQUIREMENTS:
1. Production-grade, maintainable code
2. Error handling & validation
3. Best practices for ${framework}
4. Include all necessary imports and dependencies
`;

  if (include_models)
    prompt += `\n5. Generate model/entity definitions for all tables with relationships.`;
  if (include_migrations)
    prompt += `\n6. Generate migration files for schema creation.`;
  if (include_repositories)
    prompt += `\n7. Implement repository pattern with CRUD operations.`;

  prompt += `
Return valid JSON:
{
  "files": [
    {
      "filename": "path/to/file.ext",
      "content": "complete code",
      "description": "purpose of file"
    }
  ],
  "setup_instructions": "Setup and run instructions"
}
`;
  return prompt;
};
