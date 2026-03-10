import { User } from "@/lib/hooks/use-auth";

/**
 * Check if user has admin role
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN";
}

/**
 * Check if user has specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  return user?.role ? roles.includes(user.role) : false;
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User | null): string {
  if (!user?.email) return "?";
  return (user.email[0] ?? "?").toUpperCase();
}

/**
 * Format user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Guest";
  return user.email.split("@")[0] || "User";
}
