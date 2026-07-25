import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

export async function GET() {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  const clientId = (auth.session.user as any).id;
  const projects = await prisma.clientProject.findMany({
    where: { clientId },
    include: { task: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  try {
    const { companyName, companyDetails, taskTitle, taskDescription, category } = await req.json();
    if (!companyName || !taskTitle || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const clientId = (auth.session.user as any).id;

    const task = await prisma.task.create({
      data: {
        title: taskTitle,
        description: taskDescription,
        category,
        assignedById: clientId,
        assignedToId: clientId,
        status: "PENDING",
      },
    });

    const project = await prisma.clientProject.create({
      data: { clientId, taskId: task.id, companyName, companyDetails, status: "PENDING" },
    });

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: "Failed to register project" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  try {
    const { projectId, status } = await req.json();
    if (!projectId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const clientId = (auth.session.user as any).id;

    const project = await prisma.clientProject.findUnique({ where: { id: projectId } });
    if (!project || project.clientId !== clientId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.status !== "SUBMITTED") {
      return NextResponse.json({ error: "Project is not awaiting your decision" }, { status: 400 });
    }

    const updated = await prisma.clientProject.update({ where: { id: projectId }, data: { status } });
    return NextResponse.json({ project: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
