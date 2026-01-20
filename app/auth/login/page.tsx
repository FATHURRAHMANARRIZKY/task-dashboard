"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulasi set cookie (biasanya ini via API, tapi untuk portofolio simple bisa di client)
    document.cookie = "auth_session=true; path=/; max-age=3600"; // Expire 1 jam

    setTimeout(() => {
      router.push("/"); // Redirect ke dashboard
      router.refresh();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-6">Please login to manage tasks</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Sign In with Demo Account"}
        </button>
      </div>
    </div>
  );
}
