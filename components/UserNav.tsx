"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

type UserNavProps = {
  name: string | null;
  email: string;
};

export default function UserNav({ name, email }: UserNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <User size={16} />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">
            {name || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
