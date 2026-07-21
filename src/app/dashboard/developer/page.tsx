"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function DeveloperDashboard() {
  const [subtasks, setSubtasks] = useState<any[]>([]);

  const fetchSubtasks = async () => {
    const res = await fetch("/api/developer/tasks");
    const data = await res.json();
    setSubtasks(data.subtasks || []);
  };

  useEffect(() => { fetchSubtasks(); }, []);

  const updateProgress = async (id: string, progress: number) => {
    await fetch(`/api/developer/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subTaskId: id, progress }),
    });
    fetchSubtasks();
  };

  const submitTask = async (id: string) => {
    await fetch(`/api/developer/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subTaskId: id, status: "SUBMITTED" }),
    });
    toast.success("Task submitted for approval!");
    fetchSubtasks();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Developer Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "My Tasks", value: subtasks.length, color: "from-blue-500 to-cyan-500" },
          { label: "In Progress", value: subtasks.filter(s => s.status === "IN_PROGRESS").length, color: "from-yellow-500 to-orange-500" },
          { label: "Completed", value: subtasks.filter(s => s.status === "APPROVED").length, color: "from-green-500 to-teal-500" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <span className="text-white font-bold">{stat.value}</span>
            </div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-primary">My Tasks</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Task</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Progress</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((st, i) => (
                <motion.tr key={st.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{st.task?.title || "Task"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0} max={100}
                        value={st.progress}
                        onChange={e => updateProgress(st.id, parseInt(e.target.value))}
                        className="w-32"
                        disabled={st.status === "APPROVED" || st.status === "SUBMITTED"}
                      />
                      <span className="text-sm font-semibold text-primary">{st.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      st.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      st.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" :
                      st.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{st.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {st.progress >= 100 && st.status !== "APPROVED" && st.status !== "SUBMITTED" && (
                      <button onClick={() => submitTask(st.id)} className="bg-secondary text-white px-4 py-1 rounded-xl text-xs hover:bg-opacity-90">
                        Submit
                      </button>
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
