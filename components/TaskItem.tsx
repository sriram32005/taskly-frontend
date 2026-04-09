"use client";

import { CheckCircle2, Circle, Clock, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Task } from "../app/page";
import { cn } from "../lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskItemProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function TaskItem({ task, onUpdate, onDelete, onEdit }: TaskItemProps) {
  const [showActions, setShowActions] = useState(false);

  // Helper to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-zinc-400 bg-zinc-800/50 border-zinc-700/50";
    }
  };

  const formattedDate = task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { 
    month: 'short', day: 'numeric' 
  }) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group relative p-5 rounded-2xl border transition-all duration-300",
        task.completed 
          ? "bg-zinc-900/40 border-zinc-800/50 opacity-60" 
          : "glass-card hover:border-zinc-700"
      )}
    >
      <div className="flex items-start gap-4">
        <button 
          onClick={() => onUpdate({ completed: !task.completed })}
          className="mt-0.5 text-zinc-500 hover:text-blue-400 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="h-6 w-6 text-blue-500" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-lg font-medium transition-all",
            task.completed ? "text-zinc-500 line-through" : "text-zinc-100"
          )}>
            {task.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-2">
            <span className={cn(
              "text-xs px-2.5 py-0.5 rounded-full border border-zinc-700/50 uppercase tracking-wider font-semibold",
              getPriorityColor(task.priority)
            )}>
              {task.priority || "Medium"}
            </span>

            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900/50 px-2.5 py-0.5 rounded-full border border-zinc-800">
                <Clock className="h-3.5 w-3.5" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative" onMouseLeave={() => setShowActions(false)}>
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          <AnimatePresence>
            {showActions && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-36 glass bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-10"
              >
                <button 
                  onClick={() => { setShowActions(false); onEdit(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
                <div className="h-px bg-zinc-800 w-full" />
                <button 
                  onClick={() => { setShowActions(false); onDelete(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
