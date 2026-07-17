import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function GET() {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const tasks = await prisma.task.findMany({
    include: {
      assignedTo: { select: userSelect },
      assignedBy: { select: userSelect },
      subtasks: { include: { developer: { select: userSelect } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const { title, description, assignedToId, category, priority, points } = await req.json();
    if (!title || !assignedToId || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedById: (auth.session.user as any).id,
        assignedToId,
        category,
        priority,
        points: points || 0,
      },
    });
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
