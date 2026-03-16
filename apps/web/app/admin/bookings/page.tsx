"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  AdminBooking,
  BookingStats,
  BookingPagination,
  BookingQueryParams,
  getAdminBookings,
} from "@/lib/api/admin/bookings";
import { BookingStatistics } from "@/components/admin/bookings/booking-statistics";
import { BookingFilters } from "@/components/admin/bookings/booking-filters";
import { BookingTable } from "@/components/admin/bookings/booking-table";

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuth();
  const token = accessToken ?? "";

  const [authorized, setAuthorized] = useState(false);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [pagination, setPagination] = useState<BookingPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState<BookingQueryParams>({
    page: 1,
    limit: 10,
  });

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

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getAdminBookings(queryParams, token);
      setBookings(res.bookings);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  }, [queryParams, token]);

  useEffect(() => {
    if (authorized) {
      fetchBookings();
    }
  }, [fetchBookings, authorized]);

  // Filter callbacks (useCallback to prevent re-render loops in BookingFilters)
  const handleSearchChange = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setQueryParams((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleDateRangeChange = useCallback(
    (dateFrom: string, dateTo: string) => {
      setQueryParams((prev) => ({ ...prev, dateFrom, dateTo, page: 1 }));
    },
    [],
  );

  // Pagination
  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  if (!authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  const showingFrom =
    pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="font-medium text-gray-900">Booking Management</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Bookings
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Manage tour bookings, track payments, and update reservation statuses
          from a single view.
        </p>
      </div>

      {/* Stats */}
      <BookingStatistics stats={stats} loading={loading && !stats} />

      {/* Filters & Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <BookingFilters
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onDateRangeChange={handleDateRangeChange}
        />

        <BookingTable bookings={bookings} loading={loading} />

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">{showingFrom}</span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">{showingTo}</span> of{" "}
              <span className="font-medium text-gray-900">
                {pagination.total}
              </span>{" "}
              results
            </p>
            <nav className="inline-flex rounded-md shadow-sm isolate">
              {/* Previous */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-white focus:z-20 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>

              {/* Page numbers */}
              {getPageNumbers(pagination.page, pagination.totalPages).map(
                (pageNum, idx) =>
                  pageNum === null ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 bg-white"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 transition-colors ${
                        pageNum === pagination.page
                          ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 bg-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
              )}

              {/* Next */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-white focus:z-20 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generate page numbers with ellipsis for pagination.
 * Returns array of page numbers and nulls (for ellipsis).
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | null)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [1];

  if (currentPage > 3) {
    pages.push(null);
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push(null);
  }

  pages.push(totalPages);

  return pages;
}
