"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAdminUser } from "@/lib/api/admin/users";
import { useAuth } from "@/lib/hooks/use-auth";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { accessToken } = useAuth();
  const token = accessToken ?? "";

  const [user, setUser] = useState<Awaited<ReturnType<typeof getAdminUser>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id || isNaN(id)) {
      setLoading(false);
      return;
    }
    getAdminUser(id, token)
      .then(setUser)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load user"))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !user) {
    return (
      <div className="p-6">
        <p className="text-red-600 dark:text-red-400">{error || "User not found"}</p>
        <Link href="/admin/users"><Button variant="outline" className="mt-4">Back to Users</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to Users
      </Link>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Profile</h1>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">ID</dt><dd>{user.id}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Email</dt><dd>{user.email}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Full Name</dt><dd>{user.fullName ?? "—"}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Phone</dt><dd>{user.phone ?? "—"}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Role</dt><dd>{user.role}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt><dd>{user.status}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Active</dt><dd>{user.active ? "Yes" : "No"}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Email Verified</dt><dd>{user.emailVerified ? "Yes" : "No"}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Last Login</dt><dd>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "—"}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-400">Created</dt><dd>{new Date(user.createdAt).toLocaleString()}</dd></div>
        </dl>
      </div>
    </div>
  );
}
