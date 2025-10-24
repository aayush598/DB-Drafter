import { toast } from "react-toastify";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data: T = await response.json();

    if (!response.ok) {
      const message = (data as any)?.error?.message || (data as any)?.error || "API request failed";
      // ✅ Only toast here, before throwing
      toast.error(`Error ${response.status}: ${message}`);
      throw new ApiError(message, response.status, data);
    }

    return data;
  } catch (error) {
    // ✅ Only toast for non-ApiError (network/JS errors)
    if (!(error instanceof ApiError)) {
      const message =
        error instanceof Error
          ? error.message
          : "Network or unexpected error occurred";
      toast.error(message);
      throw new ApiError(message);
    }
    // ApiError already toasted above, just rethrow
    throw error;
  }
}
