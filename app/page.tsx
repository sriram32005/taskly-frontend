"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth-context";
import { fetchApi } from "../utils/api";
import { Plus, ListTodo, LogOut } from "lucide-react";
import { TaskModal } from "../components/TaskModal";
import { TaskItem } from "../components/TaskItem";
import { useRouter } from "next/navigation";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  due_date: string | null;
}

export default function Dashboard() {
  const { token, isAuthenticated, isLoading, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated) {
      loadTasks();
    }
  }, [isLoading, isAuthenticated, router]);

  const loadTasks = async () => {
    try {
      const data = await fetchApi("/tasks");
      // Backend might return an array directly, or inside a data field.
      setTasks(data.data || data || []);
    } catch (e) {
      console.error("Failed to load tasks");
    }
  };

  const handleUpdate = async (id: number, updates: Partial<Task>) => {
    try {
      await fetchApi(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchApi(`/tasks/${id}`, {
        method: "DELETE",
      });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto w-full p-6 pt-12">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <ListTodo className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800 px-4 py-2 rounded-xl transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Wait, Sign Out</span>
        </button>
      </header>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-zinc-300">
          Latest Tasks <span className="text-zinc-600 ml-2">({tasks.length})</span>
        </h2>
        <button 
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] font-medium"
        >
          <Plus className="h-5 w-5" /> Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center text-zinc-500 border-dashed border-2 border-zinc-800/50">
            <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">You have no tasks yet.</p>
            <p className="text-sm mt-1">Create one to get started!</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={(updates) => handleUpdate(task.id, updates)}
              onDelete={() => handleDelete(task.id)}
              onEdit={() => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <TaskModal 
          task={editingTask!}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}