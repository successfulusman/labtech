import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function GET(req: Request) {
  const auth = await requireRole("ADMIN", "HEAD");
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") as Role | null;
  const where = role ? { role } : {};
  const users = await prisma.user.findMany({ where, select: userSelect, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const { name, email, password, role, category } = await req.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role, category },
      select: userSelect,
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
