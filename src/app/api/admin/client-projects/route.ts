import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function GET() {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const projects = await prisma.clientProject.findMany({
    include: {
      client: { select: userSelect },
      task: {
        include: {
          assignedTo: { select: userSelect },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const { projectId, headId } = await req.json();
    if (!projectId || !headId) {
      return NextResponse.json({ error: "projectId and headId required" }, { status: 400 });
    }

    const project = await prisma.clientProject.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const head = await prisma.user.findUnique({ where: { id: headId } });
    if (!head || head.role !== "HEAD") {
      return NextResponse.json({ error: "Selected user is not a Head" }, { status: 400 });
    }

    const adminId = (auth.session.user as any).id;

    await prisma.task.update({
      where: { id: project.taskId },
      data: { assignedToId: headId, assignedById: adminId, status: "PENDING" },
    });

    const updatedProject = await prisma.clientProject.update({
      where: { id: projectId },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({ project: updatedProject });
  } catch {
    return NextResponse.json({ error: "Failed to assign project" }, { status: 500 });
  }
}
