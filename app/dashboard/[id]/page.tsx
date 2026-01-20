"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DetailTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => (await fetch(`/api/tasks/${id}`)).json(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Details</h1>
        <div className="space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
          <Link href={`/dashboard/${id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {task.status}
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              {task.priority}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">
            {task.description || "No description provided."}
          </p>
          <p className="text-xs text-gray-400 mt-8">
            Created at: {new Date(task.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
