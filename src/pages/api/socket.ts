import { Server as NetServer } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServerResponse extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io?: ServerIO;
    };
  };
}

export default function handler(req: NextApiRequest, res: SocketServerResponse) {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const onlineUsers = new Set<string>();

    io.on("connection", (socket) => {
      socket.on("user:online", ({ userId }: { userId: string }) => {
        onlineUsers.add(userId);
        io.emit("users:online", Array.from(onlineUsers));
      });

      socket.on("user:offline", ({ userId }: { userId: string }) => {
        onlineUsers.delete(userId);
        io.emit("users:online", Array.from(onlineUsers));
      });

      socket.on("chat:send", async (data) => {
        try {
          const saved = await prisma.chatMessage.create({
            data: {
              senderId: data.senderId,
              receiverId: data.receiverId || null,
              groupId: data.groupId || null,
              message: String(data.message || "").trim(),
            },
          });
          io.emit("chat:message", {
            ...data,
            id: saved.id,
            createdAt: saved.createdAt.toISOString(),
            seen: false,
            sender: { name: data.senderName, image: data.senderImage },
          });
        } catch (e) {
          console.error("Failed to save chat message:", e);
        }
      });

      socket.on("chat:seen", async ({ messageId }: { messageId: string }) => {
        try {
          if (messageId) {
            await prisma.chatMessage.update({ where: { id: messageId }, data: { seen: true } });
          }
        } catch {
          // message may not exist; ignore
        }
        io.emit("chat:seen", { messageId });
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("users:online", Array.from(onlineUsers));
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
