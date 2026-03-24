"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  AdminBookingDetail,
  getAdminBookingDetail,
} from "@/lib/api/admin/bookings";

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

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
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

const bookingStatusStyles: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-red-100 text-red-800",
};

const paymentStatusStyles: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
};

const refundStatusStyles: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuth();
  const token = accessToken ?? "";
  const bookingId = Number(params.id);

  const [booking, setBooking] = useState<AdminBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    if (user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const fetchBooking = useCallback(async () => {
    if (!token || !bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBookingDetail(bookingId, token);
      setBooking(data);
    } catch (err) {
      console.error("Failed to fetch booking detail", err);
      setError("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  }, [bookingId, token]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-200 rounded w-72" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-gray-400 text-[48px]">
            error_outline
          </span>
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            {error || "Booking not found"}
          </h2>
          <Link
            href="/admin/bookings"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const scheduleDate = new Date(booking.schedule.startDate);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <Link
          href="/admin/bookings"
          className="hover:text-blue-600 transition-colors"
        >
          Bookings
        </Link>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="font-medium text-gray-900">#{booking.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Booking #{booking.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Created on {dateTimeFormatter.format(new Date(booking.bookingDate))}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bookingStatusStyles[booking.status] || "bg-gray-100 text-gray-800"}`}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Info */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Tour Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                {booking.schedule.tour.coverImage && (
                  <div
                    className="h-20 w-28 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url('${booking.schedule.tour.coverImage}')`,
                    }}
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {booking.schedule.tour.name}
                  </h3>
                  {booking.schedule.tour.location && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      {booking.schedule.tour.location}
                    </p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        calendar_month
                      </span>
                      {dateFormatter.format(scheduleDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      {booking.schedule.tour.durationDays} day
                      {booking.schedule.tour.durationDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Travelers */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Travelers ({booking.travelers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {booking.travelers.map((traveler) => (
                    <tr key={traveler.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {traveler.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            traveler.ageGroup === "ADULT"
                              ? "bg-blue-100 text-blue-800"
                              : traveler.ageGroup === "CHILD"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {traveler.ageGroup === "BABY"
                            ? "Infant"
                            : traveler.ageGroup.charAt(0) +
                              traveler.ageGroup.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {traveler.gender || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currencyFormatter.format(Number(traveler.price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan={3}
                      className="px-6 py-3 text-sm font-semibold text-gray-900"
                    >
                      Total
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">
                      {currencyFormatter.format(Number(booking.totalPrice))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Payments */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Payments ({booking.payments.length})
              </h2>
            </div>
            {booking.payments.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No payments recorded.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.payments.map((payment, index) => {
                      const isSuccessful = payment.status === "SUCCESS";
                      const isFailed = payment.status === "FAILED";
                      return (
                        <tr
                          key={payment.id}
                          className={
                            isSuccessful
                              ? "bg-green-50"
                              : isFailed
                                ? "opacity-50"
                                : ""
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{payment.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {payment.provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                            {payment.transactionId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusStyles[payment.status] || "bg-gray-100 text-gray-800"}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dateTimeFormatter.format(
                              new Date(payment.createdAt),
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {currencyFormatter.format(Number(payment.amount))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Refunds */}
          {booking.refunds.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">
                  Refunds ({booking.refunds.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.refunds.map((refund) => (
                      <tr key={refund.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{refund.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {refund.reason || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${refundStatusStyles[refund.status] || "bg-gray-100 text-gray-800"}`}
                          >
                            {refund.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dateTimeFormatter.format(
                            new Date(refund.createdAt),
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                          -{currencyFormatter.format(Number(refund.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Customer
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                {booking.user.avatarUrl ? (
                  <div
                    className="h-12 w-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url('${booking.user.avatarUrl}')`,
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                    {getInitials(booking.user.fullName)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.user.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{booking.user.email}</p>
                </div>
              </div>
              {booking.user.phone && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">
                    phone
                  </span>
                  {booking.user.phone}
                </div>
              )}
            </div>
          </section>

          {/* Booking Summary */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Travelers</span>
                <span className="font-medium text-gray-900">
                  {booking.travelers.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-gray-900">
                  {currencyFormatter.format(Number(booking.totalPrice))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking Status</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bookingStatusStyles[booking.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {booking.status}
                </span>
              </div>
              {booking.note && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Note
                  </p>
                  <p className="text-sm text-gray-700">{booking.note}</p>
                </div>
              )}
              {booking.cancelledAt && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Cancelled
                  </p>
                  <p className="text-sm text-gray-700">
                    {dateTimeFormatter.format(new Date(booking.cancelledAt))}
                  </p>
                  {booking.cancelReason && (
                    <p className="text-sm text-gray-500 mt-1">
                      Reason: {booking.cancelReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
