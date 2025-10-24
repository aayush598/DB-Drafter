import { apiCall } from "./client";
import { Table } from "@/types";

export interface GenerateDesignRequest {
  session_id: string;
  answers: Record<string, string>;
}

export interface GenerateDesignResponse {
  tables: Table[];
  detailed_prompt: string;
}

export async function generateDesign(
  request: GenerateDesignRequest
): Promise<GenerateDesignResponse> {
  try {
    return await apiCall<GenerateDesignResponse>(
      "/api/v1/generate-detailed-prompt",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    console.error("generateDesign error:", error);
    throw error;
  }
}
