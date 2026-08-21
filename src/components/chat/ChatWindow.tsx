"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/lib/socket";
import { fetchJson } from "@/lib/fetchClient";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiSend, FiSearch } from "react-icons/fi";

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

interface Contact {
  id: string;
  name: string;
  role: string;
  category?: string;
  image?: string;
  onlineStatus?: boolean;
  isGroup: boolean;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  HEAD: "bg-blue-100 text-blue-700",
  DEVELOPER: "bg-green-100 text-green-700",
  CLIENT: "bg-purple-100 text-purple-700",
  BROADCAST: "bg-amber-100 text-amber-700",
};

export function ChatWindow({ receiverId, groupId }: { receiverId?: string; groupId?: string }) {
  const { data: session } = useSession();
  const { socket, connected, reconnecting } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(receiverId || null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(groupId || null);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as any)?.id;

  const activeId = selectedGroup || selectedContact;
  const isGroup = !!selectedGroup;

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:message", (msg: Message & { clientId?: string }) => {
      if (msg.groupId && msg.groupId === selectedGroup) {
        setMessages(prev => {
          if (msg.clientId) return prev.filter(m => m.id !== msg.clientId).concat(msg);
          return [...prev, msg];
        });
      } else if ((msg.receiverId === userId && msg.senderId === activeId) || (msg.senderId === userId && msg.receiverId === activeId)) {
        setMessages(prev => {
          if (msg.clientId) return prev.filter(m => m.id !== msg.clientId).concat(msg);
          return [...prev, msg];
        });
      }
    });

    socket.on("users:online", (users: string[]) => setOnlineUsers(new Set(users)));
    socket.on("chat:seen", ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, seen: true } : m));
    });

    return () => {
      socket.off("chat:message");
      socket.off("users:online");
      socket.off("chat:seen");
    };
  }, [socket, userId, activeId, selectedGroup]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (isGroup && selectedGroup) params.set("groupId", selectedGroup);
      else if (selectedContact) params.set("userId", selectedContact);
      const data = await fetchJson(`/api/chat?${params}`);
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await fetchJson("/api/chat/contacts");
      setContacts(data.contacts || []);
    } catch {
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedContact, selectedGroup]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    const clientId = Date.now().toString();
    const msg: any = {
      clientId,
      senderId: userId,
      senderName: session?.user?.name || "Unknown",
      senderImage: session?.user?.image || "",
      message: input.trim(),
    };
    if (isGroup && selectedGroup) {
      msg.groupId = selectedGroup;
    } else if (selectedContact) {
      msg.receiverId = selectedContact;
    }
    socket.emit("chat:send", msg);
    setMessages(prev => [...prev, {
      id: clientId,
      senderId: userId,
      receiverId: isGroup ? undefined : selectedContact || undefined,
      groupId: isGroup ? selectedGroup : undefined,
      message: input.trim(),
      seen: false,
      createdAt: new Date().toISOString(),
      sender: { name: session?.user?.name || "", image: session?.user?.image || "" },
    } as Message]);
    setInput("");
  };

  const selectContact = (c: Contact) => {
    if (c.isGroup) {
      setSelectedGroup(c.id);
      setSelectedContact(null);
    } else {
      setSelectedContact(c.id);
      setSelectedGroup(null);
    }
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    (c.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const groups = filtered.filter(c => c.isGroup);
  const people = filtered.filter(c => !c.isGroup);
  const selectedName = contacts.find(c => c.id === activeId)?.name || "";
  const selectedRole = contacts.find(c => c.id === activeId)?.role || "";

  return (
    <div className="flex h-[70vh] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-primary">Chats</h3>
            {connected ? (
              <span className="text-xs text-green-500">● Online</span>
            ) : reconnecting ? (
              <span className="text-xs text-amber-500">⟳ Reconnecting...</span>
            ) : (
              <span className="text-xs text-red-500">● Offline</span>
            )}
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {groups.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Broadcast</div>
              {groups.map(c => (
                <div
                  key={c.id}
                  onClick={() => selectContact(c)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    activeId === c.id ? "bg-amber-50 border-r-2 border-amber-500" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    📢
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">{c.name}</div>
                    {c.lastMessage && (
                      <div className="text-xs text-gray-400 truncate">{c.lastMessage}</div>
                    )}
                  </div>
                  {c.lastMessageTime && (
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Contacts</div>
            {people.map(c => (
              <div
                key={c.id}
                onClick={() => selectContact(c)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  activeId === c.id ? "bg-primary/5 border-r-2 border-primary" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={c.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                    alt="" className="w-10 h-10 rounded-full"
                  />
                  {c.onlineStatus && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm truncate">{c.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${roleColors[c.role] || "bg-gray-100 text-gray-600"}`}>
                      {c.role === "DEVELOPER" ? "DEV" : c.role}
                    </span>
                    {c.category && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{c.category}</span>
                    )}
                  </div>
                  {c.lastMessage && (
                    <div className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage}</div>
                  )}
                </div>
                {c.lastMessageTime && (
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeId ? (
          <>
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <h4 className="font-semibold text-primary">{selectedName}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${roleColors[selectedRole] || "bg-gray-100 text-gray-600"}`}>
                {selectedRole}
              </span>
              {isGroup && <span className="text-xs text-gray-400">— broadcast to all</span>}
            </div>
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
                    {isGroup && msg.senderId !== userId && (
                      <div className="text-xs font-semibold mb-1 opacity-70">{msg.sender?.name}</div>
                    )}
                    <div className="text-sm">{msg.message}</div>
                    <div className={`text-xs mt-1 flex items-center gap-1 ${
                      msg.senderId === userId ? "text-white/70" : "text-gray-500"
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                  placeholder={isGroup ? `Message ${selectedName}...` : `Message ${selectedName}...`}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none"
                />
                <button onClick={sendMessage} className="bg-primary text-white p-2 rounded-xl hover:bg-primary-light transition-colors">
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-3">💬</div>
              <div className="font-medium">Select a contact to start chatting</div>
              <div className="text-sm mt-1">Choose from the contacts list on the left</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
