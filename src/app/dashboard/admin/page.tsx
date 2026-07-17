"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUsers, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "tasks" | "announcements" | "projects">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.users) setUsers(data.users);
  };

  const fetchTasks = async () => {
    const res = await fetch("/api/admin/tasks");
    const data = await res.json();
    if (data.tasks) setTasks(data.tasks);
  };

  const fetchProjects = async () => {
    const res = await fetch("/api/admin/client-projects");
    const data = await res.json();
    if (data.projects) setProjects(data.projects);
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
    fetchProjects();
  }, []);

  const tabs = [
    { id: "users" as const, label: "Users", icon: FiUsers },
    { id: "tasks" as const, label: "Tasks", icon: FiCheckCircle },
    { id: "projects" as const, label: "Projects", icon: FiClock },
    { id: "announcements" as const, label: "Announcements", icon: FiStar },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: FiUsers, color: "from-blue-500 to-cyan-500" },
          { label: "Active Tasks", value: tasks.filter(t => t.status !== "APPROVED").length, icon: FiCheckCircle, color: "from-green-500 to-teal-500" },
          { label: "Pending", value: tasks.filter(t => t.status === "PENDING").length, icon: FiClock, color: "from-yellow-500 to-orange-500" },
          { label: "Completed", value: tasks.filter(t => t.status === "APPROVED").length, icon: FiStar, color: "from-purple-500 to-pink-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-primary">User Management</h3>
            <AddUserModal onAdded={fetchUsers} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Points</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.category || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                        {user.points ?? 0} pts
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
                            fetchUsers();
                            toast.success("User deleted");
                          }}
                          className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-primary">Task Management</h3>
            <CreateTaskModal onCreated={fetchTasks} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Assigned To</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Priority</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, i) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{task.title}</td>
                    <td className="px-6 py-4 text-gray-600">{task.assignedTo?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">{task.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{task.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high" ? "bg-red-100 text-red-700" :
                        task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }                      `}>{task.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      {task.status === "SUBMITTED" && (
                        <RewardButton taskId={task.id} onRewarded={fetchTasks} />
                      )}
                      {task.status === "APPROVED" && task.points > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          +{task.points} pts
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Client Projects Tab */}
      {activeTab === "projects" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-primary">Client Projects</h3>
            <p className="text-sm text-gray-500 mt-1">Assign client projects to a Head to start work.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Project</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Client</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Assigned To</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{p.task?.title || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{p.companyName}</td>
                    <td className="px-6 py-4 text-gray-600">{p.client?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        p.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        p.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                        p.status === "REJECTED" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {p.task?.assignedTo?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === "PENDING" && (
                        <AssignProjectModal project={p} onAssigned={() => { fetchProjects(); }} />
                      )}
                    </td>
                  </motion.tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No client projects yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-primary">Announcements</h3>
            <CreateAnnouncementModal onCreated={() => {}} />
          </div>
          <div className="p-6">
            <AnnouncementList />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AddUserModal({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "DEVELOPER", category: "WEB" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("User added!");
      setOpen(false);
      onAdded();
    } else {
      toast.error("Failed to add user");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-light transition-colors">
        + Add User
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-primary mb-4">Add User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                <option value="DEVELOPER">Developer</option>
                <option value="HEAD">Head</option>
                <option value="ADMIN">Admin</option>
                <option value="CLIENT">Client</option>
              </select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                <option value="WEB">Web</option>
                <option value="APP">App</option>
                <option value="AI">AI</option>
                <option value="CYBER_SECURITY">Cyber Security</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl">Add</button>
                <button type="button" onClick={() => setOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

function CreateTaskModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [heads, setHeads] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", assignedToId: "", category: "WEB", priority: "medium", points: 0 });

  useEffect(() => {
    if (open) {
      fetch("/api/admin/users?role=HEAD").then(r => r.json()).then(d => setHeads(d.users || []));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Task created!");
      setOpen(false);
      onCreated();
    } else {
      toast.error("Failed to create task");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-secondary text-white px-4 py-2 rounded-xl text-sm hover:bg-opacity-90 transition-colors">
        + New Task
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">Create Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" rows={3} />
              <select value={form.assignedToId} onChange={e => setForm({ ...form, assignedToId: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200">
                <option value="">Select Head</option>
                {heads.map(h => <option key={h.id} value={h.id}>{h.name} ({h.category})</option>)}
              </select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                <option value="WEB">Web</option>
                <option value="APP">App</option>
                <option value="AI">AI</option>
                <option value="CYBER_SECURITY">Cyber Security</option>
              </select>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input type="number" placeholder="Points" value={form.points} onChange={e => setForm({ ...form, points: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl">Create</button>
                <button type="button" onClick={() => setOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

function RewardButton({ taskId, onRewarded }: { taskId: string; onRewarded: () => void }) {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState(100);
  const [paymentMsg, setPaymentMsg] = useState("You have received $100 in your account. Check please.");

  const handleReward = async () => {
    const res = await fetch("/api/admin/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, points, paymentMessage: paymentMsg }),
    });
    if (res.ok) {
      toast.success("Reward assigned! Payment message sent.");
      setOpen(false);
      onRewarded();
    } else {
      toast.error("Failed to assign reward");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-accent text-white px-3 py-1 rounded-xl text-xs hover:bg-opacity-90">
        Reward
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">Assign Reward</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Points / Tokens</label>
                <input type="number" value={points} onChange={e => setPoints(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Payment Message</label>
                <textarea value={paymentMsg} onChange={e => setPaymentMsg(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 font-medium">Demo Payment:</p>
                <p className="text-sm text-green-600">{paymentMsg}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleReward} className="flex-1 bg-accent text-white py-2 rounded-xl">Confirm Reward</button>
                <button onClick={() => setOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function CreateAnnouncementModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", rewardPoints: 0, paymentMessage: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Announcement created!");
      setOpen(false);
      onCreated();
    } else {
      toast.error("Failed to create announcement");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-accent text-white px-4 py-2 rounded-xl text-sm hover:bg-opacity-90 transition-colors">
        + New Announcement
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">New Announcement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" rows={3} />
              <input type="number" placeholder="Reward Points" value={form.rewardPoints} onChange={e => setForm({ ...form, rewardPoints: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <input type="text" placeholder="Payment Message (e.g. You have received $100...)" value={form.paymentMessage} onChange={e => setForm({ ...form, paymentMessage: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl">Create</button>
                <button type="button" onClick={() => setOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

function AssignProjectModal({ project, onAssigned }: { project: any; onAssigned: () => void }) {
  const [open, setOpen] = useState(false);
  const [heads, setHeads] = useState<any[]>([]);
  const [headId, setHeadId] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/admin/users?role=HEAD").then(r => r.json()).then(d => setHeads(d.users || []));
    }
  }, [open]);

  const handleAssign = async () => {
    if (!headId) {
      toast.error("Select a Head first");
      return;
    }
    const res = await fetch("/api/admin/client-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, headId }),
    });
    if (res.ok) {
      toast.success("Project assigned to Head!");
      setOpen(false);
      onAssigned();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to assign");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-primary text-white px-3 py-1 rounded-xl text-xs hover:bg-primary-light">
        Assign to Head
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">Assign Project to Head</h3>
            <p className="text-sm text-gray-600 mb-4">Project: <span className="font-semibold">{project.task?.title}</span></p>
            <select value={headId} onChange={e => setHeadId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 mb-4">
              <option value="">Select Head</option>
              {heads.map(h => <option key={h.id} value={h.id}>{h.name} ({h.category || "No category"})</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAssign} className="flex-1 bg-primary text-white py-2 rounded-xl hover:bg-primary-light">Assign</button>
              <button onClick={() => setOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function AnnouncementList({ refreshKey }: { refreshKey?: number }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/announcements").then(r => r.json()).then(d => setAnnouncements(d.announcements || []));
  }, [refreshKey]);

  return (
    <div className="space-y-4">
      {announcements.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-gray-100"
        >
            <h4 className="font-semibold text-primary">{a.title}</h4>
          <p className="text-gray-600 text-sm mt-1">{a.message}</p>
          {a.rewardPoints > 0 && (
            <p className="text-accent font-semibold text-sm mt-2">+{a.rewardPoints} points</p>
          )}
          {a.message?.includes("$") && (
            <p className="text-green-600 font-semibold text-sm mt-1 bg-green-50 p-2 rounded-lg">
              💵 {a.message}
            </p>
          )}
          <p className="text-gray-400 text-xs mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
        </motion.div>
      ))}
    </div>
  );
}
