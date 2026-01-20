import TaskTable from "@/components/tasks/TaskTable";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your daily productivity.
          </p>
        </div>

        <CreateTaskForm />
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="p-4">
          <TaskTable />
        </div>
      </div>
    </div>
  );
}
