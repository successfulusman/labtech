"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function HeadDashboard() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [view, setView] = useState<"tasks" | "submissions">("tasks");

  const fetchTasks = async () => {
    const res = await fetch("/api/head/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  const fetchDevelopers = async () => {
    const res = await fetch("/api/admin/users?role=DEVELOPER");
    const data = await res.json();
    setDevelopers(data.users || []);
  };

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
  }, []);

  const category = (session?.user as any)?.category;
  const filteredTasks = tasks.filter(t => !category || t.category === category);

  const allSubtasks = filteredTasks.flatMap(t => t.subtasks || []);

  const handleApproveReject = async (subTaskId: string, status: string) => {
    const res = await fetch("/api/head/subtasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subTaskId, status }),
    });
    if (res.ok) {
      toast.success(`Task ${status.toLowerCase()}!`);
      fetchTasks();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Head Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: filteredTasks.length, color: "from-blue-500 to-cyan-500" },
          { label: "In Progress", value: filteredTasks.filter(t => t.status === "IN_PROGRESS").length, color: "from-yellow-500 to-orange-500" },
          { label: "Submissions", value: allSubtasks.filter(s => s.status === "SUBMITTED").length, color: "from-purple-500 to-pink-500" },
          { label: "Completed", value: filteredTasks.filter(t => t.status === "APPROVED").length, color: "from-green-500 to-teal-500" },
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

      <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-fit">
        <button onClick={() => setView("tasks")} className={`px-4 py-2 rounded-xl text-sm transition-all ${view === "tasks" ? "bg-primary text-white" : "text-gray-600"}`}>
          My Tasks
        </button>
        <button onClick={() => setView("submissions")} className={`px-4 py-2 rounded-xl text-sm transition-all ${view === "submissions" ? "bg-primary text-white" : "text-gray-600"}`}>
          Developer Submissions {allSubtasks.filter(s => s.status === "SUBMITTED").length > 0 && `(${allSubtasks.filter(s => s.status === "SUBMITTED").length})`}
        </button>
      </div>

      {view === "tasks" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-primary">Assigned Tasks</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Priority</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Developers</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, i) => (
                  <motion.tr key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{task.title}</td>
                    <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">{task.category}</span></td>
                    <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{task.priority}</span></td>
                    <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${task.status === "APPROVED" ? "bg-green-100 text-green-700" : task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{task.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {(task.subtasks || []).slice(0, 3).map((st: any) => (
                          <img key={st.id} src={st.developer?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.developer?.name}`} alt="" className="w-6 h-6 rounded-full border-2 border-white" title={`${st.developer?.name} (${st.progress}%)`} />
                        ))}
                        {(task.subtasks || []).length > 3 && <span className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center border-2 border-white">+{(task.subtasks || []).length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {task.status !== "APPROVED" && task.status !== "SUBMITTED" && (
                        <button onClick={() => setSelectedTask(task)} className="bg-primary text-white px-3 py-1 rounded-xl text-xs hover:bg-primary-light">
                          Assign Devs
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "submissions" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100"><h3 className="font-semibold text-primary">Developer Submissions</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Task</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Developer</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Progress</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allSubtasks.filter(s => s.status === "SUBMITTED" || s.status === "IN_PROGRESS").map((st, i) => (
                  <motion.tr key={st.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{st.task?.title || "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={st.developer?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.developer?.name}`} alt="" className="w-6 h-6 rounded-full" />
                        <span>{st.developer?.name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${st.progress}%` }} />
                        </div>
                        <span className="text-xs">{st.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${st.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{st.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveReject(st.id, "APPROVED")} className="bg-green-500 text-white px-3 py-1 rounded-xl text-xs hover:bg-green-600">
                          Approve
                        </button>
                        <button onClick={() => handleApproveReject(st.id, "REJECTED")} className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs hover:bg-red-600">
                          Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {allSubtasks.filter(s => s.status === "SUBMITTED" || s.status === "IN_PROGRESS").length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No submissions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTask && (
        <AssignDevelopersModal
          task={selectedTask}
          developers={developers.filter((d: any) => d.category === selectedTask.category || !d.category || d.category === (session?.user as any)?.category)}
          onClose={() => { setSelectedTask(null); fetchTasks(); }}
        />
      )}
    </div>
  );
}

function AssignDevelopersModal({ task, developers, onClose }: { task: any; developers: any[]; onClose: () => void }) {
  const [selectedDevs, setSelectedDevs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleAssign = async () => {
    if (selectedDevs.length === 0) {
      toast.error("Select at least one developer");
      return;
    }
    const res = await fetch("/api/head/subtasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id, developerIds: selectedDevs, progress }),
    });
    if (res.ok) {
      toast.success(`Assigned to ${selectedDevs.length} developer(s)`);
      onClose();
    } else {
      toast.error("Failed to assign");
    }
  };

  const toggleDev = (id: string) => {
    setSelectedDevs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold text-primary mb-4">Assign Developers to: {task.title}</h3>
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-2 block">Initial Progress %</label>
          <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(parseInt(e.target.value))} className="w-full" />
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
          <label className="text-sm text-gray-600 font-semibold">Select Developers:</label>
          {developers.map(dev => (
            <label key={dev.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" checked={selectedDevs.includes(dev.id)} onChange={() => toggleDev(dev.id)} className="rounded" />
              <img src={dev.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`} alt="" className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-medium text-gray-800 text-sm">{dev.name}</div>
                <div className="text-xs text-gray-500">{dev.category || "No category"}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={handleAssign} className="flex-1 bg-primary text-white py-2 rounded-xl hover:bg-primary-light">Assign</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}
