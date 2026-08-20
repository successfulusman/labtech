import { NextResponse } from "next/server";
import { requireRole } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true, onlineStatus: true, lastSeen: true };

export async function GET() {
  const auth = await requireRole();
  if ("error" in auth) return auth.error;

  const userRole = (auth.session.user as any).role;

  let contacts;
  if (userRole === "ADMIN") {
    contacts = await prisma.user.findMany({ where: { role: { in: ["HEAD", "DEVELOPER"] } }, select: userSelect });
  } else if (userRole === "HEAD") {
    contacts = await prisma.user.findMany({ where: { OR: [{ role: "ADMIN" }, { role: "DEVELOPER" }] }, select: userSelect });
  } else if (userRole === "DEVELOPER") {
    contacts = await prisma.user.findMany({ where: { role: { in: ["HEAD", "ADMIN"] } }, select: userSelect });
  } else {
    contacts = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "HEAD"] } }, select: userSelect });
  }

  return NextResponse.json({ contacts });
}
