"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

export function AdminHeader() {
  const router = useRouter();
  const { user, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Page Title (can be dynamic) */}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Admin Dashboard
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
