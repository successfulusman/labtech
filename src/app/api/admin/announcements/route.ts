import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guard";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true };

export async function GET() {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  const announcements = await prisma.announcement.findMany({
    include: { user: { select: userSelect } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ announcements });
}

export async function POST(req: Request) {
  const auth = await requireRole("ADMIN");
  if ("error" in auth) return auth.error;

  try {
    const { title, message, rewardPoints, paymentMessage } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message required" }, { status: 400 });
    }
    const fullMessage = paymentMessage ? `${message}\n\n💵 ${paymentMessage}` : message;
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message: fullMessage,
        rewardPoints: rewardPoints || 0,
        userId: (auth.session.user as any).id,
      },
    });
    return NextResponse.json({ announcement });
  } catch {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
