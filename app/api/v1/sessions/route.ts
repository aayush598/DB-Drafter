import { NextResponse } from "next/server";
import { sessions } from "@/lib/utils";

/**
 * GET /api/v1/sessions
 * List all active sessions with count
 */
export async function GET() {
  try {
    // Get all session IDs
    const sessionIds = Object.keys(sessions);

    return NextResponse.json({
      sessions: sessionIds,
      count: sessionIds.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to list sessions: ${error.message}` },
      { status: 500 }
    );
  }
}
