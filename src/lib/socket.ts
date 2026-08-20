"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

let globalSocket: Socket | null = null;

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    if (!globalSocket) {
      globalSocket = io({
        path: "/api/socket",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
        timeout: 20000,
      } as any);
    }

    setSocket(globalSocket);

    globalSocket.on("connect", () => {
      setConnected(true);
      setReconnecting(false);
      globalSocket?.emit("user:online", { userId: (session.user as any).id });
    });

    globalSocket.on("disconnect", () => setConnected(false));
    globalSocket.on("reconnect_attempt", () => setReconnecting(true));
    globalSocket.on("reconnect", () => setReconnecting(false));

    return () => {
      if (globalSocket) {
        globalSocket.emit("user:offline", { userId: (session.user as any).id });
      }
    };
  }, [session]);

  return { socket, connected, reconnecting };
}
