"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showRegister, setShowRegister] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch("/api/client/tasks");
    const data = await res.json();
    setProjects(data.projects || []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAction = async (id: string, status: string) => {
    await fetch(`/api/client/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id, status }),
    });
    toast.success(`Project ${status.toLowerCase()}`);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Client Dashboard</h1>
        <button onClick={() => setShowRegister(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-light">
          + Register Project
        </button>
      </div>

      {showRegister && (
        <RegisterProjectForm onClose={() => { setShowRegister(false); fetchProjects(); }} />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-primary">My Projects</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Project</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Company</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
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
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      p.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      p.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {p.status === "SUBMITTED" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(p.id, "APPROVED")} className="bg-green-500 text-white px-3 py-1 rounded-xl text-xs">Approve</button>
                        <button onClick={() => handleAction(p.id, "REJECTED")} className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs">Reject</button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RegisterProjectForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ companyName: "", companyDetails: "", taskTitle: "", taskDescription: "", category: "WEB" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/client/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Project registered!");
      onClose();
    } else {
      toast.error("Failed to register");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-primary mb-4">Register New Project</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Company Name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
        <textarea placeholder="Company Details" value={form.companyDetails} onChange={e => setForm({ ...form, companyDetails: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200" rows={2} />
        <input type="text" placeholder="Project Title" value={form.taskTitle} onChange={e => setForm({ ...form, taskTitle: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
        <textarea placeholder="Project Description" value={form.taskDescription} onChange={e => setForm({ ...form, taskDescription: e.target.value })} required className="w-full px-4 py-2 rounded-xl border border-gray-200" rows={3} />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200">
          <option value="WEB">Web</option>
          <option value="APP">App</option>
          <option value="AI">AI</option>
          <option value="CYBER_SECURITY">Cyber Security</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl">Register</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
