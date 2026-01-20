"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskForm from "@/components/tasks/TaskForm";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => (await fetch(`/api/tasks/${id}`)).json(),
  });

  if (isLoading)
    return <div className="p-8 text-center">Loading task data...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <TaskForm isEdit id={id} initialData={data} key={data?.updatedAt || id} />
    </div>
  );
}
