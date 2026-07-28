"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  message: string;
  seen: boolean;
  createdAt: string;
  sender: { name: string; image?: string };
}

export function ChatWindow({ receiverId, groupId }: { receiverId?: string; groupId?: string }) {
  const { data: session } = useSession();
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(receiverId || null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:message", (msg: Message & { clientId?: string }) => {
      if (msg.receiverId === userId || msg.senderId === userId || msg.groupId === groupId) {
        setMessages(prev => {
          if (msg.clientId) {
            const filtered = prev.filter(m => m.id !== msg.clientId);
            return [...filtered, msg];
          }
          return [...prev, msg];
        });
      }
    });

    socket.on("users:online", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    socket.on("chat:seen", ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, seen: true } : m));
    });

    return () => {
      socket.off("chat:message");
      socket.off("users:online");
      socket.off("chat:seen");
    };
  }, [socket, userId, groupId]);

  const fetchMessages = async () => {
    const params = new URLSearchParams();
    if (selectedContact) params.set("userId", selectedContact);
    if (groupId) params.set("groupId", groupId);
    const res = await fetch(`/api/chat?${params}`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const fetchContacts = async () => {
    const res = await fetch("/api/chat/contacts");
    const data = await res.json();
    setContacts(data.contacts || []);
  };

  useEffect(() => {
    fetchMessages();
    fetchContacts();
  }, [selectedContact]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    const clientId = Date.now().toString();
    const msg = {
      clientId,
      senderId: userId,
      senderName: session?.user?.name || "Unknown",
      senderImage: session?.user?.image || "",
      receiverId: selectedContact,
      groupId,
      message: input.trim(),
    };
    socket.emit("chat:send", msg);
    setMessages(prev => [...prev, {
      id: clientId,
      senderId: userId,
      receiverId: selectedContact || undefined,
      groupId,
      message: input.trim(),
      seen: false,
      createdAt: new Date().toISOString(),
      sender: { name: session?.user?.name || "", image: session?.user?.image || "" },
    } as Message]);
    setInput("");
  };

  return (
    <div className="flex h-[70vh] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-72 border-r border-gray-100 overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-primary">Chats</h3>
          {connected && <span className="text-xs text-green-500">● Connected</span>}
        </div>
        {contacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact.id)}
            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
              selectedContact === contact.id ? "bg-primary/5" : "hover:bg-gray-50"
            }`}
          >
            <div className="relative">
              <img src={contact.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} alt="" className="w-10 h-10 rounded-full" />
              {onlineUsers.has(contact.id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-800 text-sm">{contact.name}</div>
              <div className="text-xs text-gray-500">{contact.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                msg.senderId === userId
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}>
                <div className="text-sm">{msg.message}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${
                  msg.senderId === userId ? "text-white/70" : "text-gray-500"
                }`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.senderId === userId && (msg.seen ? " ✓✓" : " ✓")}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none"
            />
            <button onClick={sendMessage} className="bg-primary text-white p-2 rounded-xl hover:bg-primary-light transition-colors">
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
