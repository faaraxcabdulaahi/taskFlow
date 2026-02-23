"use client";

import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
}

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-100 border-yellow-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-100 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-100 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-100 border-gray-500/30";
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
        <p className="text-white text-lg">
          No tasks yet. Create your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-white">
              {task.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
            >
              {task.status}
            </span>
          </div>

          {task.description && (
            <p className="text-blue-100 mb-4 line-clamp-3">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <select
              value={task.status}
              onChange={(e) =>
                onStatusChange(task.id, e.target.value as Task["status"])
              }
              className="text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            >
              <option value="pending" className="bg-blue-600 text-white">Pending</option>
              <option value="in-progress" className="bg-blue-600 text-white">In Progress</option>
              <option value="completed" className="bg-blue-600 text-white">Completed</option>
            </select>

            <div className="space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-white/80 hover:text-white text-sm font-medium transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-300 hover:text-red-200 text-sm font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-blue-200/60">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}