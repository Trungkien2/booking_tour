"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUserRole,
  updateAdminUserStatus,
  deleteAdminUser,
  AdminUser,
  AdminUserQueryParams,
  AdminCreateUserPayload,
} from "@/lib/api/admin/users";
import { useAuth } from "@/lib/hooks/use-auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLE_OPTIONS: { value: "" | "USER" | "ADMIN" | "GUIDE"; label: string }[] = [
  { value: "", label: "All" },
  { value: "ADMIN", label: "Admin" },
  { value: "GUIDE", label: "Guide" },
  { value: "USER", label: "Customer" },
];

const STATUS_OPTIONS: { value: "" | "active" | "inactive" | "pending"; label: string }[] = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const SORT_OPTIONS: { value: "created_desc" | "created_asc" | "name_asc"; label: string }[] = [
  { value: "created_desc", label: "Newest" },
  { value: "created_asc", label: "Oldest" },
  { value: "name_asc", label: "Name A-Z" },
];

function roleBadgeClass(role: string) {
  if (role === "ADMIN") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  if (role === "GUIDE") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
}

function statusClass(status: string) {
  if (status === "active") return "text-green-600 dark:text-green-400";
  if (status === "inactive") return "text-red-600 dark:text-red-400";
  return "text-yellow-600 dark:text-yellow-400";
}

function formatRelativeDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const token = accessToken ?? "";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<AdminUserQueryParams>({
    page: 1,
    limit: 10,
    sort: "created_desc",
  });

  const [searchInput, setSearchInput] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [roleModalUser, setRoleModalUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getAdminUsers(params, token);
      setUsers(res.data);
      setMeta(res.meta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const applySearch = () => setParams((p) => ({ ...p, search: searchInput || undefined, page: 1 }));

  const handleRoleFilter = (role: "" | "USER" | "ADMIN" | "GUIDE") =>
    setParams((p) => ({ ...p, role: role || undefined, page: 1 }));
  const handleStatusFilter = (status: "" | "active" | "inactive" | "pending") =>
    setParams((p) => ({ ...p, status: status || undefined, page: 1 }));
  const handleSort = (sort: "created_desc" | "created_asc" | "name_asc") =>
    setParams((p) => ({ ...p, sort, page: 1 }));

  const handleAddUser = async (payload: AdminCreateUserPayload) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await createAdminUser(payload, token);
      setAddModalOpen(false);
      fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (id: number, role: "USER" | "ADMIN" | "GUIDE") => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateAdminUserRole(id, role, token);
      setRoleModalUser(null);
      fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (u: AdminUser) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateAdminUserStatus(u.id, !u.active, token);
      fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!token || !confirm(`Delete user ${u.email}?`)) return;
    setActionLoading(true);
    try {
      await deleteAdminUser(u.id, token);
      fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage access, roles, and account statuses for all platform users.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applySearch()}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={applySearch}>Search</Button>
        </div>
        <select
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          value={params.role ?? ""}
          onChange={(e) => handleRoleFilter(e.target.value as "" | "USER" | "ADMIN" | "GUIDE")}
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          value={params.status ?? ""}
          onChange={(e) => handleStatusFilter(e.target.value as "" | "active" | "inactive" | "pending")}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          value={params.sort ?? "created_desc"}
          onChange={(e) => handleSort(e.target.value as "created_desc" | "created_asc" | "name_asc")}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Login</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          {((u.fullName || u.email || "?")[0] ?? "?").toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{u.fullName || "—"}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${roleBadgeClass(u.role)}`}>
                        {u.role === "USER" ? "Customer" : u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusClass(u.status)}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatRelativeDate(u.lastLoginAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/users/${u.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setRoleModalUser(u)}>
                          Change Role
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionLoading}
                        >
                          {u.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(u)} disabled={actionLoading}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && users.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No users found.</div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} users
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      </div>

      {addModalOpen && (
        <AddUserModal
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddUser}
          loading={actionLoading}
        />
      )}

      {roleModalUser && (
        <ChangeRoleModal
          user={roleModalUser}
          onClose={() => setRoleModalUser(null)}
          onSubmit={(role) => handleChangeRole(roleModalUser.id, role)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

function AddUserModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (p: AdminCreateUserPayload) => Promise<void>;
  loading: boolean;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN" | "GUIDE">("USER");
  const [sendInvite, setSendInvite] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onSubmit({ fullName: fullName.trim(), email: email.trim(), role, sendInvite });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as "USER" | "ADMIN" | "GUIDE")}
            >
              <option value="USER">Customer</option>
              <option value="GUIDE">Guide</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={sendInvite} onChange={(e) => setSendInvite(e.target.checked)} />
            <span className="text-sm">Send invitation email</span>
          </label>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add User"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangeRoleModal({
  user,
  onClose,
  onSubmit,
  loading,
}: {
  user: AdminUser;
  onClose: () => void;
  onSubmit: (role: "USER" | "ADMIN" | "GUIDE") => Promise<void>;
  loading: boolean;
}) {
  const [role, setRole] = useState<"USER" | "ADMIN" | "GUIDE">(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-2">Change User Role</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          {(["USER", "GUIDE", "ADMIN"] as const).map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} />
              <span>{r === "USER" ? "Customer" : r} {r === "USER" && "— Can browse and book tours"}</span>
            </label>
          ))}
          <p className="text-sm text-amber-600 dark:text-amber-400">Changing role may affect user&apos;s access.</p>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Change Role"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
