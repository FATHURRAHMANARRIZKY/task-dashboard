import TaskTable from "@/components/tasks/TaskTable";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Task Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your daily goals efficiently.
          </p>
        </div>

        {/* Component Form Disini */}
        <CreateTaskForm />
      </div>

      <TaskTable />
    </div>
  );
}
