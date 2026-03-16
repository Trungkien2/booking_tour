"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  DashboardResponse,
  getAdminDashboard,
} from "@/lib/api/admin/dashboard";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RecentBookings } from "@/components/admin/dashboard/recent-bookings";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuth();
  const token = accessToken ?? "";

  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    if (user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    setAuthorized(true);
  }, [isAuthenticated, user, router]);

  const fetchDashboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getAdminDashboard(token);
      setData(res);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authorized) {
      fetchDashboard();
    }
  }, [fetchDashboard, authorized]);

  if (!authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back, Admin. Here is what is happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500 font-medium">
              Last updated: {timeFormatter.format(lastUpdated)}
            </span>
          )}
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="bg-white border border-gray-200 rounded-lg p-2 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`}
            >
              refresh
            </span>
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <DashboardStats stats={data?.stats ?? null} loading={loading && !data} />

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 px-1 pb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/tours"
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">
              add_circle
            </span>
            Add New Tour
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg text-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              confirmation_number
            </span>
            Create Booking
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg text-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Invite User
          </Link>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookings
            bookings={data?.recentBookings ?? []}
            loading={loading && !data}
          />
        </div>
      </section>
    </div>
  );
}
