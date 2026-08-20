"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiMenu, FiX, FiBell, FiHome, FiMessageSquare } from "react-icons/fi";

const roleColors: Record<string, string> = {
  ADMIN: "from-red-500 to-orange-500",
  HEAD: "from-blue-500 to-cyan-500",
  DEVELOPER: "from-green-500 to-teal-500",
  CLIENT: "from-purple-500 to-pink-500",
};

const navItems: Record<string, { label: string; href: string; icon: any }[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/dashboard/admin", icon: FiHome },
    { label: "Chat", href: "/dashboard/chat", icon: FiMessageSquare },
  ],
  HEAD: [
    { label: "Dashboard", href: "/dashboard/head", icon: FiHome },
    { label: "Chat", href: "/dashboard/chat", icon: FiMessageSquare },
  ],
  DEVELOPER: [
    { label: "Dashboard", href: "/dashboard/developer", icon: FiHome },
    { label: "Chat", href: "/dashboard/chat", icon: FiMessageSquare },
  ],
  CLIENT: [
    { label: "Chat with Team", href: "/dashboard/chat", icon: FiMessageSquare },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);

  const role = (session?.user as any)?.role || "DEVELOPER";
  const name = session?.user?.name || "User";
  const image = session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  const items = navItems[role] || [];

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(d => setNotifications(d.announcements || []));
  }, []);

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40 h-16">
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600">
              {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <Link href="/" className="text-xl font-bold text-primary">
              Lab<span className="text-secondary">Tech</span>
            </Link>
            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${roleColors[role] || "bg-gray-500"} text-white`}>{role}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative text-gray-600 hover:text-primary">
                <FiBell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-white text-xs flex items-center justify-center">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotif && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 font-semibold text-primary">Notifications</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map(n => (
                        <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                          <div className="text-sm font-medium text-gray-800">{n.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{n.message?.substring(0, 60)}...</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              <img src={image} alt="" className="w-8 h-8 rounded-full" />
              <span className="text-sm text-gray-700 hidden md:block">{name}</span>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-500 hover:text-red-500 transition-colors">
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 lg:w-64"} overflow-hidden`}>
        <nav className="p-4 space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
