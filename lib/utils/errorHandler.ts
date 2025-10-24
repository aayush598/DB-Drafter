// lib/utils/errorHandler.ts
import { toast } from "react-toastify";

// Optional: Custom error type for Gemini API
interface GeminiError {
  code?: string;
  message?: string;
}

export const handleApiError = (
  error: any,
  defaultMessage: string = "Something went wrong"
) => {
  // Network / Fetch errors
  if (!error?.response) {
    toast.error(`Network error: ${error.message || defaultMessage}`);
    return;
  }

  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 400:
      toast.error(data?.error || "Bad Request (400)");
      break;
    case 401:
      toast.error("Unauthorized (401) — Check your API key");
      break;
    case 403:
      toast.error("Forbidden (403) — You do not have permission");
      break;
    case 404:
      toast.error(data?.error || "Not Found (404)");
      break;
    case 429:
      toast.error("Rate Limit Exceeded (429) — Slow down requests");
      break;
    case 500:
      toast.error("Internal Server Error (500) — Try again later");
      break;
    default:
      toast.error(data?.error || defaultMessage);
  }

  // Gemini-specific errors
  if (data?.geminiError) {
    const ge: GeminiError = data.geminiError;
    toast.error(`Gemini API Error: ${ge.code || ""} — ${ge.message || ""}`);
  }
};
