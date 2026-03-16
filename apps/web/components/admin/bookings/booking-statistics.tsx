"use client";

import { BookingStats } from "@/lib/api/admin/bookings";

interface BookingStatisticsProps {
  stats: BookingStats | null;
  loading: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function BookingStatistics({ stats, loading }: BookingStatisticsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <StatCard
        icon="payments"
        iconBg="bg-green-50"
        iconColor="text-green-600"
        label="Total Revenue"
        value={currencyFormatter.format(stats.totalRevenue)}
      />
      <StatCard
        icon="confirmation_number"
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        label="Active Bookings"
        value={String(stats.activeBookings)}
      />
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <span className={`material-symbols-outlined ${iconColor}`}>
            {icon}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
