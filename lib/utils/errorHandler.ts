// lib/utils/errorHandler.ts
import { toast } from "react-toastify";

interface GeminiErrorDetails {
  code?: number | string;
  message?: string;
  status?: string;
  details?: any[];
}

/**
 * Main error handler that displays actionable, user-friendly toasts
 */
export function handleApiError(error: any) {
  console.error("❌ API Error:", error);

  if (error?.name === "ApiError") {
    return showFriendlyError(error.statusCode, error.details);
  }

  // Network or fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    toast.error(
      "⚠️ Connection issue detected.\nPlease check your internet connection or VPN and try again."
    );
    return;
  }

  // Fallback for unrecognized issues
  toast.error(
    "❌ Something went wrong on our side.\nPlease reload the page or try again in a few minutes."
  );
}

/**
 * Maps Gemini and HTTP errors to user-friendly guidance messages
 */
function showFriendlyError(statusCode?: number, details?: any) {
  const geminiError: GeminiErrorDetails | undefined =
    details?.error || details?.geminiError;

  // 🧠 Gemini API–specific handling
  if (geminiError) {
    switch (geminiError.status) {
      case "INVALID_ARGUMENT":
        toast.error(
          "🚫 Your Gemini API key is invalid or missing.\n➡️ Go to your project settings and add a valid Google Generative AI API key (GEMINI_API_KEY)."
        );
        return;
      case "PERMISSION_DENIED":
        toast.error(
          "🔒 Permission denied by Gemini API.\n➡️ Check that your API key has access to the Gemini model in your Google Cloud Console."
        );
        return;
      case "RESOURCE_EXHAUSTED":
        toast.warning(
          "⏳ You've reached your Gemini usage limit.\n➡️ Wait a few minutes or upgrade your Google AI quota to continue."
        );
        return;
      case "INTERNAL":
        toast.error(
          "⚙️ Gemini API encountered an internal error.\n➡️ Try again later — this is likely temporary on Google’s servers."
        );
        return;
      case "UNAUTHENTICATED":
        toast.error(
          "🔑 Authentication failed.\n➡️ Please verify that your Gemini API key is set correctly in your environment variables."
        );
        return;
      default:
        toast.error(
          `⚠️ Gemini service error: ${geminiError.message || "Unexpected issue."}\n➡️ Please retry after a few seconds or contact support if it persists.`
        );
        return;
    }
  }

  // 🌐 HTTP-level error handling
  switch (statusCode) {
    case 400:
      toast.error(
        "🧾 Invalid request data.\n➡️ Please double-check your inputs or refresh and try again."
      );
      break;
    case 401:
      toast.error(
        "🔑 Unauthorized request.\n➡️ Make sure your API key or session is valid, then retry."
      );
      break;
    case 403:
      toast.error(
        "🚫 Access forbidden.\n➡️ You might not have permission for this resource. Contact your admin or check your API access."
      );
      break;
    case 404:
      toast.info(
        "🔍 Requested resource not found.\n➡️ It may have been removed or renamed — please check your inputs."
      );
      break;
    case 408:
      toast.warning(
        "⏱️ Request timed out.\n➡️ The server took too long to respond. Check your network and try again."
      );
      break;
    case 429:
      toast.warning(
        "🐢 Too many requests.\n➡️ You’ve hit the rate limit. Please wait a few seconds before retrying."
      );
      break;
    case 500:
      toast.error(
        "💥 Internal server error.\n➡️ This isn’t your fault — please wait a moment and retry."
      );
      break;
    case 503:
      toast.error(
        "🧩 Service temporarily unavailable.\n➡️ Try again later once the service is back online."
      );
      break;
    default:
      toast.error(
        "⚠️ Unexpected error.\n➡️ Please try again or contact support if the issue continues."
      );
  }
}
