"use client";

import Link from "next/link";
import { AdminBooking } from "@/lib/api/admin/bookings";

interface BookingTableProps {
  bookings: AdminBooking[];
  loading: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    SUCCESS: "bg-green-100 text-green-800",
    CONFIRMED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-red-100 text-red-800",
    FAILED: "bg-red-100 text-red-800",
  };

  const label: Record<string, string> = {
    PAID: "Paid",
    SUCCESS: "Confirmed",
    CONFIRMED: "Confirmed",
    PENDING: "Pending",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
    FAILED: "Failed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {label[status] || status}
    </span>
  );
}

function getPaymentStatus(booking: AdminBooking): string | null {
  const firstPayment = booking.payments?.[0];
  if (!firstPayment) return null;
  return firstPayment.status;
}

export function BookingTable({ bookings, loading }: BookingTableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Booking ID",
                "Customer",
                "Tour",
                "Date & Time",
                "Amount",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="ml-3">
                      <div className="h-4 bg-gray-200 rounded w-28 mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-36" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded-full w-14" />
                    <div className="h-5 bg-gray-200 rounded-full w-18" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="flex flex-col items-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <span className="material-symbols-outlined text-gray-400 text-[32px]">
              confirmation_number
            </span>
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900">
            No bookings found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Booking ID",
              "Customer",
              "Tour",
              "Date & Time",
              "Amount",
              "Status",
            ].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => {
            const paymentStatus = getPaymentStatus(booking);
            const scheduleDate = new Date(booking.schedule.startDate);

            return (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Booking ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    #{booking.id}
                  </Link>
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {booking.user.avatarUrl ? (
                      <div
                        className="h-8 w-8 rounded-full bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url('${booking.user.avatarUrl}')`,
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                        {getInitials(booking.user.fullName)}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Tour */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {booking.schedule.tour.name}
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {dateFormatter.format(scheduleDate)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {timeFormatter.format(scheduleDate)}
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {currencyFormatter.format(Number(booking.totalPrice))}
                </td>

                {/* Status (dual badges) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {getStatusBadge(booking.status)}
                    {paymentStatus && getStatusBadge(paymentStatus)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
