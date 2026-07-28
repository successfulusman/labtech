"use client";

import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary">Messages</h1>
      <ChatWindow />
    </div>
  );
}
