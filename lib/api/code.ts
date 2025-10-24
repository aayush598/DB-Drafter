import { apiCall } from "./client";
import { GeneratedCode, CodeGenerationOptions } from "@/types";

export interface GenerateCodeRequest extends CodeGenerationOptions {
  session_id: string;
}

export async function generateDatabaseCode(
  request: GenerateCodeRequest
): Promise<GeneratedCode> {
  try {
    return await apiCall<GeneratedCode>("/api/v1/generate-database-code", {
      method: "POST",
      body: JSON.stringify({
        session_id: request.session_id,
        language: request.language,
        framework: request.framework,
        include_models: request.includeModels,
        include_migrations: request.includeMigrations,
        include_repositories: request.includeRepositories,
      }),
    });
  } catch (error) {
    console.error("generateDatabaseCode error:", error);
    throw error; // Already handled with toast in apiCall
  }
}
