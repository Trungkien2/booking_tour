"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  getUserBookings,
  getBookingDetail,
  getCancellationPreview,
  cancelBooking,
} from "@/lib/api/bookings";
import { BookingTabs } from "@/components/bookings/booking-tabs";
import { BookingCardItem } from "@/components/bookings/booking-card-item";
import { CancelBookingDialog } from "@/components/bookings/cancel-booking-dialog";
import { BookingDetailModal } from "@/components/bookings/booking-detail-modal";
import type {
  BookingListItem,
  BookingDetail,
  CancellationPreview as CancellationPreviewType,
} from "@/lib/types/booking";

type TabType = "upcoming" | "completed" | "cancelled";

const EMPTY_MESSAGES: Record<TabType, string> = {
  upcoming: "No upcoming bookings",
  completed: "No completed trips",
  cancelled: "No cancelled bookings",
};

const PAGE_SIZE = 10;

export default function MyBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get("tab") as TabType) || "upcoming"
  );
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [tabCounts, setTabCounts] = useState({ upcoming: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cancel dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelPreview, setCancelPreview] = useState<CancellationPreviewType | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {
        tab: activeTab,
        page: String(page),
        limit: String(PAGE_SIZE),
      };
      if (search) params.search = search;

      const data = await getUserBookings(params, accessToken);
      setBookings(data.bookings);
      setTabCounts(data.tabs);
      setTotalPages(data.pagination.totalPages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load bookings.";
      setError(message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, activeTab, search, page]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchBookings();
  }, [isAuthenticated, router, fetchBookings]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCancelClick = async (bookingId: number) => {
    if (!accessToken) return;

    setCancelBookingId(bookingId);
    setCancelLoading(true);
    setCancelDialogOpen(true);

    try {
      const preview = await getCancellationPreview(bookingId, accessToken);
      setCancelPreview(preview);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load cancellation details.";
      setCancelPreview(null);
      setError(message);
      setCancelDialogOpen(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelConfirm = async (reason?: string, confirmNoRefund?: boolean) => {
    if (cancelBookingId == null || !accessToken) return;

    setCancelLoading(true);

    try {
      await cancelBooking(cancelBookingId, { reason, confirmNoRefund }, accessToken);
      setCancelDialogOpen(false);
      setCancelBookingId(null);
      setCancelPreview(null);
      fetchBookings();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cancel booking.";
      setError(message);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setCancelBookingId(null);
    setCancelPreview(null);
  };

  const handleViewDetail = async (bookingId: number) => {
    if (!accessToken) return;

    setDetailModalOpen(true);

    try {
      const detail = await getBookingDetail(bookingId, accessToken);
      setSelectedBooking(detail);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load booking details.";
      setSelectedBooking(null);
      setError(message);
      setDetailModalOpen(false);
    }
  };

  const handleDetailClose = () => {
    setDetailModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and track all your tour reservations.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <BookingTabs
          tabs={tabCounts}
          activeTab={activeTab}
          onTabChange={(tab) => handleTabChange(tab as TabType)}
        />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-64 rounded bg-gray-200" />
                </div>
                <div className="h-8 w-20 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900">
            {EMPTY_MESSAGES[activeTab]}
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === "upcoming"
              ? "Browse our tours and book your next adventure!"
              : activeTab === "completed"
                ? "Your completed trips will appear here."
                : "You have no cancelled bookings."}
          </p>
          {activeTab === "upcoming" && (
            <a
              href="/tours"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Browse Tours
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCardItem
              key={booking.id}
              booking={booking}
              onCancel={handleCancelClick}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && bookings.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Cancel Dialog */}
      {cancelBookingId != null && (
        <CancelBookingDialog
          bookingId={cancelBookingId}
          isOpen={cancelDialogOpen}
          onClose={handleCancelClose}
          onConfirm={handleCancelConfirm}
          preview={cancelPreview}
          loading={cancelLoading}
        />
      )}

      {/* Booking Detail Modal */}
      <BookingDetailModal
        isOpen={detailModalOpen}
        onClose={handleDetailClose}
        booking={selectedBooking}
      />
    </div>
  );
}
