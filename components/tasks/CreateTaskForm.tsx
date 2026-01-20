"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { createMutation } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Jalankan mutasi create
    createMutation.mutate(title, {
      onSuccess: () => {
        setTitle(""); // Reset input
        setIsOpen(false); // Tutup form
      },
    });
  };

  return (
    <div>
      {/* Tombol Buka Form */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium flex items-center gap-2"
      >
        <span>+</span> Add New Task
      </button>

      {/* Form Sederhana (Muncul jika isOpen = true) */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              autoFocus
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-black disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
