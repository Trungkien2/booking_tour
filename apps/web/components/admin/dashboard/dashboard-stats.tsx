"use client";

import { DashboardStats as DashboardStatsType } from "@/lib/api/admin/dashboard";

interface DashboardStatsProps {
  stats: DashboardStatsType | null;
  loading: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const CARDS = [
  {
    key: "totalRevenue" as const,
    label: "Total Revenue",
    icon: "payments",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    format: (v: number) => currencyFormatter.format(v),
  },
  {
    key: "totalBookings" as const,
    label: "Total Bookings",
    icon: "confirmation_number",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "activeTours" as const,
    label: "Active Tours",
    icon: "tour",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: "group",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    format: (v: number) => v.toLocaleString(),
  },
];

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-7 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div className={`p-2 ${card.iconBg} rounded-lg`}>
              <span className={`material-symbols-outlined ${card.iconColor}`}>
                {card.icon}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {card.format(stats[card.key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
