"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

let globalSocket: Socket | null = null;

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    if (!globalSocket) {
      globalSocket = io({
        path: "/api/socket",
        transports: ["websocket", "polling"],
      } as any);
    }

    setSocket(globalSocket);

    globalSocket.on("connect", () => {
      setConnected(true);
      globalSocket?.emit("user:online", { userId: (session.user as any).id });
    });

    globalSocket.on("disconnect", () => setConnected(false));

    return () => {
      if (globalSocket) {
        globalSocket.emit("user:offline", { userId: (session.user as any).id });
      }
    };
  }, [session]);

  return { socket, connected };
}
