import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

export async function POST(req: Request) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const { taskId, points, paymentMessage } = await req.json();
    if (!taskId || !points) {
      return NextResponse.json({ error: "taskId and points required" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true, subtasks: { include: { developer: true } } },
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await prisma.task.update({ where: { id: taskId }, data: { status: "APPROVED", points } });

    const developerIds = Array.from(new Set(task.subtasks.map((s) => s.developerId)));
    if (developerIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: developerIds } },
        data: { points: { increment: points } },
      });
    } else if (task.assignedToId) {
      await prisma.user.update({
        where: { id: task.assignedToId },
        data: { points: { increment: points } },
      });
    }

    const clientProject = await prisma.clientProject.findFirst({ where: { taskId } });
    if (clientProject) {
      await prisma.clientProject.update({
        where: { id: clientProject.id },
        data: { status: "APPROVED" },
      });
    }

    if (paymentMessage) {
      await prisma.announcement.create({
        data: {
          title: "Reward Released!",
          message: paymentMessage,
          rewardPoints: points,
          userId: (auth.session.user as any).id,
        },
      });
    }

    return NextResponse.json({ success: true, task });
  } catch {
    return NextResponse.json({ error: "Failed to assign reward" }, { status: 500 });
  }
}
