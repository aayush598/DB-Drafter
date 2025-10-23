// app/api/v1/session/[session_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sessions } from "@/lib/utils";

/**
 * GET /api/v1/session/{session_id}
 * Returns session details (excluding sensitive info like API key)
 */
export async function GET(req: NextRequest, { params }: { params: { session_id: string } }) {
  const { session_id } = params;

  const session = sessions[session_id];
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Copy session and remove sensitive info
  const safeSession = { ...session };
  delete safeSession.api_key;

  return NextResponse.json(safeSession);
}

/**
 * DELETE /api/v1/session/{session_id}
 * Deletes a session
 */
export async function DELETE(req: NextRequest, { params }: { params: { session_id: string } }) {
  const { session_id } = params;

  if (sessions[session_id]) {
    delete sessions[session_id];
    return NextResponse.json({ message: "Session deleted successfully" });
  }

  return NextResponse.json({ error: "Session not found" }, { status: 404 });
}
