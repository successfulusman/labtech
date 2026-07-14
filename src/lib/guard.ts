import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireRole(
  ...roles: string[]
): Promise<{ session: Session } | { error: NextResponse }> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = (session.user as any)?.role;
  if (roles.length > 0 && !roles.includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}
