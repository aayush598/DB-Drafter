import { apiCall } from "./client";
import { GeneratedSchema } from "@/types";

export interface GenerateSchemaRequest {
  session_id: string;
  table_name: string;
}

export async function generateTableSchema(
  request: GenerateSchemaRequest
): Promise<GeneratedSchema> {
  try {
    return await apiCall<GeneratedSchema>("/api/v1/generate-table-schema", {
      method: "POST",
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error("generateTableSchema error:", error);
    throw error;
  }
}

export async function getSupportedLanguages() {
  try {
    return await apiCall<any>("/api/v1/supported-languages", {
      method: "GET",
    });
  } catch (error) {
    console.error("getSupportedLanguages error:", error);
    throw error;
  }
}
