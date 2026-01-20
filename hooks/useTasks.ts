import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Tipe Data
export type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
};

// 2. Fungsi API (Fetchers) - Diletakkan di luar hook agar bersih
async function fetchTasks() {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function deleteTask(id: string) {
  await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
}

async function updateStatus({ id, status }: { id: string; status: string }) {
  await fetch("/api/tasks", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
}

async function createTask(title: string) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Kita hardcode userId dulu karena belum login
    body: JSON.stringify({ title, userId: "user-dummy-id" }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// 3. Custom Hook Utama (Gabungan Semuanya)
export function useTasks() {
  const queryClient = useQueryClient();

  // A. Query: Ambil Data
  const tasksQuery = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // B. Mutation: Hapus Data
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // C. Mutation: Update Status
  const updateMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // D. Mutation: Buat Task Baru
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Return semua fungsi agar bisa dipakai di component
  return { tasksQuery, deleteMutation, updateMutation, createMutation };
}
