import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function GET() {
  const auth = await requireRole("HEAD");
  if ("error" in auth) return auth.error;

  const headId = (auth.session.user as any).id;
  const tasks = await prisma.task.findMany({
    where: { assignedToId: headId },
    include: { subtasks: { include: { developer: { select: userSelect } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ tasks });
}
