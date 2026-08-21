import { NextResponse } from "next/server";
import { requireRole } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const userSelect = { id: true, name: true, email: true, image: true, role: true, category: true, points: true, onlineStatus: true, lastSeen: true };

async function getLastMessage(userId1: string, userId2: string) {
  const msg = await prisma.chatMessage.findFirst({
    where: { OR: [{ senderId: userId1, receiverId: userId2 }, { senderId: userId2, receiverId: userId1 }] },
    orderBy: { createdAt: "desc" },
    select: { message: true, createdAt: true },
  });
  return msg ? { lastMessage: msg.message, lastMessageTime: msg.createdAt.toISOString() } : { lastMessage: null, lastMessageTime: null };
}

async function getLastGroupMessage(groupId: string) {
  const msg = await prisma.chatMessage.findFirst({
    where: { groupId },
    orderBy: { createdAt: "desc" },
    select: { message: true, createdAt: true },
  });
  return msg ? { lastMessage: msg.message, lastMessageTime: msg.createdAt.toISOString() } : { lastMessage: null, lastMessageTime: null };
}

export async function GET() {
  const auth = await requireRole();
  if ("error" in auth) return auth.error;

  const userId = (auth.session.user as any).id;
  const userRole = (auth.session.user as any).role;
  const userCategory = (auth.session.user as any).category;

  const contacts: any[] = [];

  if (userRole === "ADMIN") {
    const people = await prisma.user.findMany({ where: { role: { in: ["HEAD", "DEVELOPER"] } }, select: userSelect });
    for (const p of people) {
      const last = await getLastMessage(userId, p.id);
      contacts.push({ ...p, isGroup: false, ...last });
    }
    const groupLast = await getLastGroupMessage("admin-broadcast");
    contacts.unshift({
      id: "admin-broadcast",
      name: "All Users",
      role: "BROADCAST",
      category: null,
      image: null,
      onlineStatus: false,
      lastSeen: null,
      isGroup: true,
      ...groupLast,
    });
  } else if (userRole === "HEAD") {
    const people = await prisma.user.findMany({ where: { OR: [{ role: "ADMIN" }, { role: "DEVELOPER", category: userCategory }] }, select: userSelect });
    for (const p of people) {
      const last = await getLastMessage(userId, p.id);
      contacts.push({ ...p, isGroup: false, ...last });
    }
    const groupLast = await getLastGroupMessage(`head-${userId}-devs`);
    contacts.unshift({
      id: `head-${userId}-devs`,
      name: `My Developers${userCategory ? ` (${userCategory})` : ""}`,
      role: "BROADCAST",
      category: userCategory,
      image: null,
      onlineStatus: false,
      lastSeen: null,
      isGroup: true,
      ...groupLast,
    });
  } else if (userRole === "DEVELOPER") {
    const people = await prisma.user.findMany({ where: { role: { in: ["HEAD", "ADMIN"] } }, select: userSelect });
    for (const p of people) {
      const last = await getLastMessage(userId, p.id);
      contacts.push({ ...p, isGroup: false, ...last });
    }
  } else {
    const people = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "HEAD"] } }, select: userSelect });
    for (const p of people) {
      const last = await getLastMessage(userId, p.id);
      contacts.push({ ...p, isGroup: false, ...last });
    }
  }

  return NextResponse.json({ contacts });
}
