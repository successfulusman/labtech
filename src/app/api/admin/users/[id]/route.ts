import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const data = await req.json();
    const { id } = await params;
    const adminId = (auth.session.user as any).id;

    if (id === adminId && data.role && data.role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot demote yourself" }, { status: 400 });
    }

    const user = await prisma.user.update({ where: { id }, data, select: userSelect });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const { id } = await params;
    const adminId = (auth.session.user as any).id;
    if (id === adminId) {
      return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
