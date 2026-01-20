import { create } from "zustand";

type TaskState = {
  title: string;
  description: string;
  status: string;
  priority: string;
  setTask: (task: Partial<TaskState>) => void;
  reset: () => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  setTask: (updates) => set((state) => ({ ...state, ...updates })),
  reset: () =>
    set({ title: "", description: "", status: "TODO", priority: "MEDIUM" }),
}));
