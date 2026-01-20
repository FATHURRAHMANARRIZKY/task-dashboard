// Perhatikan: TIDAK ADA 'use client' di sini. Ini Server Component.
import Link from "next/link";
import { LayoutDashboard, Settings } from "lucide-react";
import { getUser } from "@/lib/auth";
import UserNav from "@/components/UserNav"; // Import komponen client tadi

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil data user langsung di server (Cepat & Aman)
  const user = await getUser();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 tracking-tight">
            TaskPro
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
          >
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg cursor-not-allowed opacity-50">
            <Settings size={20} />
            Settings
          </div>
        </nav>

        {/* User Profile & Logout (Dynamic) */}
        {/* Kita oper data user asli ke komponen Client */}
        {user && <UserNav name={user.name} email={user.email} />}
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Mobile Header (Opsional, user profile sederhana) */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <span className="font-bold text-blue-600">TaskPro</span>
          <span className="text-sm text-gray-600">{user?.name}</span>
        </div>

        {children}
      </main>
    </div>
  );
}
