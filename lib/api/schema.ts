import { apiCall } from "./client";
import { GeneratedSchema } from "@/types";

export interface GenerateSchemaRequest {
  session_id: string;
  table_name: string;
}

export async function generateTableSchema(
  request: GenerateSchemaRequest
): Promise<GeneratedSchema> {
  return apiCall<GeneratedSchema>("/api/v1/generate-table-schema", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getSupportedLanguages() {
  return apiCall<any>("/api/v1/supported-languages", {
    method: "GET",
  });
}