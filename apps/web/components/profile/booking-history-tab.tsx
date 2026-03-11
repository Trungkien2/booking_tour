"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  MapPin,
  Loader2,
  Search,
} from "lucide-react";
import { getUserBookings, cancelBooking } from "@/lib/api/bookings";
import { getAccessToken } from "@/lib/utils/token";
import type { BookingListItem, BookingsListResponse } from "@/lib/types/booking";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type FilterStatus = "all" | "upcoming" | "completed" | "cancelled";

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export function BookingHistoryTab() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<BookingsListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchBookings = async (status: FilterStatus) => {
    setIsLoading(true);
    try {
      const token = getAccessToken();
      if (!token) return;
      const params: Record<string, string> = { page: "1", limit: "20" };
      if (status !== "all") params.tab = status;
      const result = await getUserBookings(params, token);
      setData(result);
    } catch {
      toast("Failed to load bookings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleCancel = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      const token = getAccessToken();
      if (!token) return;
      await cancelBooking(bookingId, {}, token);
      toast("Booking cancelled successfully", "success");
      fetchBookings(filter);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to cancel booking",
        "error",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          My Bookings
        </h2>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : !data || data.bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <div className="space-y-4">
            {data.bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetail={() => router.push(`/bookings/${booking.id}`)}
                onCancel={() => handleCancel(booking.id)}
                isCancelling={cancellingId === booking.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onViewDetail,
  onCancel,
  isCancelling,
}: {
  booking: BookingListItem;
  onViewDetail: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}) {
  const coverUrl = booking.tour.coverImage
    ? booking.tour.coverImage.startsWith("http")
      ? booking.tour.coverImage
      : `${API_BASE_URL}${booking.tour.coverImage}`
    : null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
      {/* Tour image */}
      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={booking.tour.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {booking.tour.name}
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
              STATUS_COLORS[booking.status] || STATUS_COLORS.PENDING
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(booking.schedule.startDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {booking.travelerCount} traveler{booking.travelerCount !== 1 ? "s" : ""}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${Number(booking.totalPrice).toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetail}>
            View Details
          </Button>
          {booking.canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isCancelling}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {isCancelling ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="text-center py-12">
      <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        No bookings yet
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Start exploring tours and book your next adventure!
      </p>
      <a
        href="/tours"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Browse Tours
      </a>
    </div>
  );
}
