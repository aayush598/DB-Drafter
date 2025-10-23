import { apiCall } from "./client";
import { Question } from "@/types";

export interface GenerateQuestionsRequest {
  description: string;
  api_key: string;
  model_name: string;
}

export interface GenerateQuestionsResponse {
  session_id: string;
  questions: Question[];
}

export async function generateQuestions(
  request: GenerateQuestionsRequest
): Promise {
  return apiCall(
    "/api/v1/generate-questions",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}
