// app/api/v1/session/[session_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sessions } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  context: { params: any } // <-- allow any to satisfy TS
) {
  const { session_id } = context.params;

  const session = sessions[session_id];
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const safeSession = { ...session };
  delete safeSession.api_key;

  return NextResponse.json(safeSession);
}

export async function DELETE(
  req: NextRequest,
  context: { params: any } // <-- allow any
) {
  const { session_id } = context.params;

  if (sessions[session_id]) {
    delete sessions[session_id];
    return NextResponse.json({ message: "Session deleted successfully" });
  }

  return NextResponse.json({ error: "Session not found" }, { status: 404 });
}
