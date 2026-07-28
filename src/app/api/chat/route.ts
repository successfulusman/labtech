import { NextResponse } from "next/server";
import { requireRole } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await requireRole();
  if ("error" in auth) return auth.error;

  const userId = (auth.session.user as any).id;
  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get("userId");
  const groupId = searchParams.get("groupId");

  let messages: Awaited<ReturnType<typeof prisma.chatMessage.findMany>> = [];
  if (otherUserId) {
    messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: { sender: { select: { name: true, image: true } } },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
  } else if (groupId) {
    messages = await prisma.chatMessage.findMany({
      where: { groupId },
      include: { sender: { select: { name: true, image: true } } },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
  } else {
    messages = [];
  }

  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const auth = await requireRole();
  if ("error" in auth) return auth.error;

  try {
    const { receiverId, groupId, message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }
    if (!receiverId && !groupId) {
      return NextResponse.json({ error: "receiverId or groupId required" }, { status: 400 });
    }
    const senderId = (auth.session.user as any).id;

    const msg = await prisma.chatMessage.create({
      data: { senderId, receiverId: receiverId || null, groupId: groupId || null, message: message.trim() },
      include: { sender: { select: { name: true, image: true } } },
    });

    return NextResponse.json({ message: msg });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
