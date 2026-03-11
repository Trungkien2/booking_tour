import { getAccessToken } from "@/lib/utils/token";
import type { UserProfile } from "@/lib/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = `Request failed: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function getMyProfile(): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse<UserProfile>(response);
}

export async function updateMyProfile(
  data: Partial<
    Pick<UserProfile, "fullName" | "phone" | "address" | "bio" | "preferences">
  >,
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<UserProfile>(response);
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse<{ avatarUrl: string }>(response);
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/users/me/password`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ message: string }>(response);
}

export async function sendVerificationEmail(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/send-verification`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}

// --- Notification Preferences ---

export interface NotificationPreferences {
  bookingConfirmations: boolean;
  tourUpdates: boolean;
  promotions: boolean;
  tripReminders: boolean;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await fetch(`${API_BASE_URL}/users/me/notifications`, {
    headers: authHeaders(),
  });
  return handleResponse<NotificationPreferences>(response);
}

export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const response = await fetch(`${API_BASE_URL}/users/me/notifications`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<NotificationPreferences>(response);
}

// --- Login History ---

export interface LoginHistoryEntry {
  id: number;
  loginAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}

export async function getLoginHistory(): Promise<LoginHistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/users/me/sessions`, {
    headers: authHeaders(),
  });
  return handleResponse<LoginHistoryEntry[]>(response);
}

// --- Account Deletion ---

export async function deleteMyAccount(
  password: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ password }),
  });
  return handleResponse<{ message: string }>(response);
}
