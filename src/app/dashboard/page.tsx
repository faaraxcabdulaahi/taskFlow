"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskList from "@/components/taskList";
import TaskForm from "@/components/taskform";
import { Task, TaskInput, User } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch tasks once user is authenticated
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      if (!data.user) {
        router.push("/signin");
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/signin");
    }
  };

  // Fetch all tasks for the user
  const fetchTasks = async () => {
    try {
      setError(null);
      console.log("Fetching tasks...");

      const res = await fetch("/api/tasks");

      console.log("Response status:", res.status);

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/signin");
          return;
        }
        if (res.status === 405) {
          throw new Error("API route not properly configured");
        }
        throw new Error(`Failed to fetch tasks: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched tasks data:", data);

      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        console.error("Unexpected data format:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle creating a new task
  const handleCreateTask = async (taskData: TaskInput) => {
    try {
      setError(null);
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      await fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  // Handle updating an existing task
  const handleUpdateTask = async (id: string, taskData: TaskInput) => {
    try {
      setError(null);
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      await fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Handle changing task status
  const handleStatusChange = async (id: string, status: Task["status"]) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      try {
        await handleUpdateTask(id, { ...task, status });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  // Handle logo click - stays on dashboard
  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo - FIXED: Now stays on dashboard */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="text-2xl font-bold text-white hover:text-white/80 transition duration-300 cursor-pointer"
              >
                TaskFlow
              </button>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-white hidden sm:inline">
                Welcome, {user?.name || user?.email}
              </span>
              <span className="text-white sm:hidden">
                Hi, {user?.name?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white/80 hover:text-white transition duration-300 border border-white/20 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with New Task Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-white">My Tasks</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 shadow-lg w-full sm:w-auto"
          >
            + New Task
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg backdrop-blur-lg">
            {error}
          </div>
        )}

        {/* Task List Component */}
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />

        {/* Task Form Modal - Shows when creating or editing */}
        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={async (data) => {
              try {
                if (editingTask) {
                  await handleUpdateTask(editingTask.id, data);
                } else {
                  await handleCreateTask(data);
                }
              } catch (error) {
                console.error("Form submission error:", error);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}