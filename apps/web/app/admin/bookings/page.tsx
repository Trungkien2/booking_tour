"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [authorized, setAuthorized] = useState(false);

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

  if (!authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Bookings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and monitor all bookings across the platform.
        </p>
      </div>

      {/* Stats placeholder */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Bookings", value: "--", color: "bg-blue-50 text-blue-700" },
          { label: "Pending", value: "--", color: "bg-yellow-50 text-yellow-700" },
          { label: "Confirmed", value: "--", color: "bg-green-50 text-green-700" },
          { label: "Cancelled", value: "--", color: "bg-red-50 text-red-700" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.color} inline-block rounded-md px-2 py-1`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Coming soon message */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Bookings
          </h2>
        </div>

        {/* Table header placeholder */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.42 15.17l-5.67-5.67m0 0L11.42 3.83m-5.67 5.67h15.5"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">
                      Admin Bookings - Coming Soon
                    </h3>
                    <p className="text-sm text-gray-500">
                      The admin bookings management interface is currently under
                      development. Check back soon for full booking management
                      capabilities.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
