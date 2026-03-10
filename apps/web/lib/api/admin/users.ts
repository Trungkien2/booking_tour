const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN" | "GUIDE";
  active: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  status: "active" | "inactive" | "pending";
}

export interface AdminUserListResponse {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminUserQueryParams {
  search?: string;
  role?: "USER" | "ADMIN" | "GUIDE";
  status?: "active" | "inactive" | "pending";
  page?: number;
  limit?: number;
  sort?: "created_desc" | "created_asc" | "name_asc";
}

export interface AdminCreateUserPayload {
  fullName: string;
  email: string;
  role?: "USER" | "ADMIN" | "GUIDE";
  sendInvite?: boolean;
}

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminUsers(
  params: AdminUserQueryParams,
  token: string,
): Promise<AdminUserListResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") query.set(k, String(v));
  });
  const res = await fetch(
    `${API_BASE_URL}/api/admin/users?${query.toString()}`,
    { headers: headers(token) },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch users");
  }
  return res.json();
}

export async function getAdminUser(
  id: number,
  token: string,
): Promise<AdminUser & { phone?: string | null; updatedAt: string }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    headers: headers(token),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch user");
  }
  return res.json();
}

export async function createAdminUser(
  payload: AdminCreateUserPayload,
  token: string,
): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create user");
  }
  return res.json();
}

export async function updateAdminUser(
  id: number,
  data: { fullName?: string; phone?: string },
  token: string,
): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update user");
  }
  return res.json();
}

export async function updateAdminUserRole(
  id: number,
  role: "USER" | "ADMIN" | "GUIDE",
  token: string,
): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/role`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update role");
  }
  return res.json();
}

export async function updateAdminUserStatus(
  id: number,
  active: boolean,
  token: string,
): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ active }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update status");
  }
  return res.json();
}

export async function deleteAdminUser(
  id: number,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete user");
  }
}
