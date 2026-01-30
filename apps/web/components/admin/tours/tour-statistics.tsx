"use client";

import { useEffect, useState } from "react";
import { TourStatistics, getTourStatistics } from "@/lib/api/admin/tours";

export function TourStatisticsSection() {
  const [stats, setStats] = useState<TourStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Get real token from auth context/session
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || ""
        : "";

    if (!token) {
      setLoading(false); // Or redirect
      return;
    }

    getTourStatistics(token)
      .then(setStats)
      .catch((err) => {
        console.error(err);
        setError("Failed to load statistics");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow sm:p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    // Graceful fallback or error message
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Tours" value={stats.total} />
      <StatCard label="Active" value={stats.active} color="text-green-600" />
      <StatCard label="Drafts" value={stats.drafts} color="text-yellow-600" />
      <StatCard
        label="Fully Booked"
        value={stats.fullyBooked}
        color="text-red-600"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow sm:p-6 border border-gray-100">
      <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
      <dd className={`mt-1 text-3xl font-semibold ${color}`}>{value}</dd>
    </div>
  );
}
