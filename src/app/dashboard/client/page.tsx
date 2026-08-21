"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiBriefcase, FiClock, FiCheckCircle, FiMessageSquare } from "react-icons/fi";

interface Project {
  id: string;
  companyName: string;
  companyDetails?: string;
  status: string;
  createdAt: string;
  task: { id: string; title: string; description: string; category: string; status: string };
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: "", companyDetails: "", taskTitle: "", taskDescription: "", category: "WEB" });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/client/tasks");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const registerProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/client/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Project registered! Admin will review it.");
      setShowForm(false);
      setForm({ companyName: "", companyDetails: "", taskTitle: "", taskDescription: "", category: "WEB" });
      fetchProjects();
    } else {
      toast.error("Failed to register project");
    }
  };

  const total = projects.length;
  const inProgress = projects.filter(p => p.status === "IN_PROGRESS").length;
  const completed = projects.filter(p => p.status === "APPROVED").length;
  const pending = projects.filter(p => p.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Client Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/chat" className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm hover:bg-opacity-90 transition-colors">
            <FiMessageSquare className="w-4 h-4" /> Chat with Team
          </Link>
          <button onClick={() => setShowForm(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-light transition-colors">
            + Register Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: total, color: "from-blue-500 to-cyan-500", icon: FiBriefcase },
          { label: "Pending Review", value: pending, color: "from-yellow-500 to-orange-500", icon: FiClock },
          { label: "In Progress", value: inProgress, color: "from-purple-500 to-pink-500", icon: FiClock },
          { label: "Completed", value: completed, color: "from-green-500 to-teal-500", icon: FiCheckCircle },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-primary">My Projects</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Project</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Company</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{p.task?.title || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{p.companyName}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">{p.task?.category || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      p.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                      p.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No projects yet. Register your first project!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-primary mb-4">Register New Project</h3>
            <form onSubmit={registerProject} className="space-y-4">
              <input type="text" placeholder="Company Name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none" />
              <textarea placeholder="Company Details (optional)" value={form.companyDetails} onChange={e => setForm({ ...form, companyDetails: e.target.value })} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none" />
              <input type="text" placeholder="Project Title" value={form.taskTitle} onChange={e => setForm({ ...form, taskTitle: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none" />
              <textarea placeholder="Project Description" value={form.taskDescription} onChange={e => setForm({ ...form, taskDescription: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-secondary outline-none">
                <option value="WEB">Web Development</option>
                <option value="APP">App Development</option>
                <option value="AI">AI / Machine Learning</option>
                <option value="CYBER_SECURITY">Cyber Security</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl hover:bg-primary-light transition-colors">Register</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
