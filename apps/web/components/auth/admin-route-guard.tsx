"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const REHYDRATE_DELAY_MS = 150;

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Wait for Zustand persist to rehydrate from localStorage before running auth check.
  // Otherwise on first load user/accessToken are still null and we redirect to login even when stored.
  useEffect(() => {
    const timer = setTimeout(() => setHasCheckedAuth(true), REHYDRATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasCheckedAuth || pathname === "/admin/login") {
      return;
    }

    if (!isAuthenticated()) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [hasCheckedAuth, pathname, isAuthenticated, user?.role, router]);

  const isLoginPage = pathname === "/admin/login";
  const isAuthorized =
    hasCheckedAuth && isAuthenticated() && user?.role === "ADMIN";

  if (!isLoginPage && (!hasCheckedAuth || !isAuthorized)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
