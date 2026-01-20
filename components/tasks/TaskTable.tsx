"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Import baru untuk filter
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTasks, Task } from "@/hooks/useTasks";
import { Skeleton } from "@/components/Skeleton";

const columnHelper = createColumnHelper<Task>();

export default function TaskTable() {
  const { tasksQuery, deleteMutation, updateMutation } = useTasks();
  const { data: tasks, isLoading, isError } = tasksQuery;

  // State untuk Sorting dan Filtering
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(""); // Untuk search bar
  const [statusFilter, setStatusFilter] = useState(""); // Untuk dropdown status

  // Definisi Kolom
  const columns = [
    columnHelper.accessor("title", {
      header: "Task Name",
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const id = info.row.original.id;

        const colors: Record<string, string> = {
          TODO: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          DONE: "bg-green-100 text-green-800 hover:bg-green-200",
        };

        const handleStatusClick = () => {
          const nextStatus =
            status === "TODO"
              ? "IN_PROGRESS"
              : status === "IN_PROGRESS"
                ? "DONE"
                : "TODO";
          updateMutation.mutate({ id, status: nextStatus });
        };

        return (
          <button
            onClick={handleStatusClick}
            disabled={updateMutation.isPending}
            className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${colors[status]} ${updateMutation.isPending ? "opacity-50" : ""}`}
          >
            {status.replace("_", " ")}
          </button>
        );
      },
      // Fungsi filter khusus untuk kolom status
      filterFn: "equalsString",
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => {
        const priority = info.getValue();
        const colors = {
          LOW: "text-gray-500",
          MEDIUM: "text-yellow-600 font-medium",
          HIGH: "text-red-600 font-bold",
        };
        return <span className={colors[priority]}>{priority}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <button
          onClick={() => {
            if (confirm("Are you sure?")) {
              deleteMutation.mutate(info.row.original.id);
            }
          }}
          className="text-red-500 hover:text-red-700 font-medium text-sm"
        >
          {deleteMutation.isPending ? "..." : "Delete"}
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: tasks || [],
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters: statusFilter
        ? [{ id: "status", value: statusFilter }]
        : [],
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Aktifkan Sorting
    getFilteredRowModel: getFilteredRowModel(), // Aktifkan Filtering
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Skeleton untuk Search Bar & Filter */}
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Skeleton untuk Tabel */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex justify-between border-b pb-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
            {/* Rows Skeleton (Looping 5 baris) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
        Failed to load data. Please try again.
      </div>
    );

  return (
    <div className="space-y-4">
      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex gap-4 mb-4">
        {/* Search Input */}
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {/* --- TABEL UTAMA --- */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                    onClick={header.column.getToggleSortingHandler()} // Klik header untuk sort
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* Indikator Sorting */}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="text-sm text-gray-500 text-right">
        Showing {table.getRowModel().rows.length} tasks
      </div>
    </div>
  );
}
