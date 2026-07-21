import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function GET() {
  const auth = await requireRole("DEVELOPER");
  if ("error" in auth) return auth.error;

  const devId = (auth.session.user as any).id;
  const subtasks = await prisma.subTask.findMany({
    where: { developerId: devId },
    include: { task: { include: { assignedBy: { select: userSelect } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ subtasks });
}

export async function PATCH(req: Request) {
  const auth = await requireRole("DEVELOPER");
  if ("error" in auth) return auth.error;

  try {
    const { subTaskId, progress } = await req.json();
    if (!subTaskId || typeof progress !== "number" || progress < 0 || progress > 100) {
      return NextResponse.json({ error: "Invalid progress value" }, { status: 400 });
    }
    const devId = (auth.session.user as any).id;

    const subtask = await prisma.subTask.findUnique({ where: { id: subTaskId } });
    if (!subtask || subtask.developerId !== devId) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }
    if (subtask.status === "APPROVED" || subtask.status === "SUBMITTED") {
      return NextResponse.json({ error: "Task is already submitted or approved" }, { status: 400 });
    }

    const updated = await prisma.subTask.update({ where: { id: subTaskId }, data: { progress } });
    return NextResponse.json({ subtask: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("DEVELOPER");
  if ("error" in auth) return auth.error;

  try {
    const { subTaskId, status } = await req.json();
    if (!subTaskId || status !== "SUBMITTED") {
      return NextResponse.json({ error: "You can only submit your task" }, { status: 400 });
    }
    const devId = (auth.session.user as any).id;

    const subtask = await prisma.subTask.findUnique({ where: { id: subTaskId } });
    if (!subtask || subtask.developerId !== devId) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }
    if (subtask.status === "APPROVED" || subtask.status === "SUBMITTED") {
      return NextResponse.json({ error: "Task is already submitted or approved" }, { status: 400 });
    }
    if (subtask.progress < 100) {
      return NextResponse.json({ error: "Complete 100% progress before submitting" }, { status: 400 });
    }

    const updated = await prisma.subTask.update({ where: { id: subTaskId }, data: { status } });
    return NextResponse.json({ subtask: updated });
  } catch {
    return NextResponse.json({ error: "Failed to submit task" }, { status: 500 });
  }
}
