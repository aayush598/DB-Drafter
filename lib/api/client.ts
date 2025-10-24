// lib/api/client.ts
import { handleApiError } from "@/lib/utils/errorHandler";

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

    const data: T = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        (data as any)?.error?.message || (data as any)?.error || "API request failed",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    handleApiError(error); // ✅ Show actionable toast
    throw error;
  }
}
