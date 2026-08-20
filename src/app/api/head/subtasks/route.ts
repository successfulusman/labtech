import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

export async function PUT(req: Request) {
  const auth = await requireRole("HEAD");
  if ("error" in auth) return auth.error;

  try {
    const { taskId, developerIds, progress } = await req.json();
    if (!taskId || !Array.isArray(developerIds) || developerIds.length === 0) {
      return NextResponse.json({ error: "taskId and developerIds required" }, { status: 400 });
    }
    const headId = (auth.session.user as any).id;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.assignedToId !== headId) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const validDevs = await prisma.user.findMany({
      where: { id: { in: developerIds }, role: "DEVELOPER" },
      select: { id: true },
    });
    const validIds = validDevs.map((d) => d.id);

    const subtasks = await Promise.all(
      validIds.map((devId: string) =>
        prisma.subTask.create({
          data: { taskId, developerId: devId, headId, progress: progress || 0 },
        })
      )
    );

    await prisma.task.update({ where: { id: taskId }, data: { status: "IN_PROGRESS" } });

    return NextResponse.json({ subtasks });
  } catch {
    return NextResponse.json({ error: "Failed to assign developers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("HEAD");
  if ("error" in auth) return auth.error;

  try {
    const { subTaskId, status } = await req.json();
    if (!subTaskId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const headId = (auth.session.user as any).id;

    const subtask = await prisma.subTask.findUnique({
      where: { id: subTaskId },
      include: { task: true },
    });
    if (!subtask || subtask.headId !== headId) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }
    if (subtask.status === "APPROVED" || subtask.status === "REJECTED") {
      return NextResponse.json({ error: "Already decided" }, { status: 400 });
    }

    const updated = await prisma.subTask.update({ where: { id: subTaskId }, data: { status } });

    if (status === "APPROVED" && subtask.task) {
      const allSubtasks = await prisma.subTask.findMany({ where: { taskId: subtask.taskId } });
      const allDone = allSubtasks.every((s) => s.status === "APPROVED");
      if (allDone) {
        await prisma.task.update({ where: { id: subtask.taskId }, data: { status: "SUBMITTED" } });
        await prisma.clientProject.updateMany({
          where: { taskId: subtask.taskId },
          data: { status: "SUBMITTED" },
        });
      }
    }

    return NextResponse.json({ subtask: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}
