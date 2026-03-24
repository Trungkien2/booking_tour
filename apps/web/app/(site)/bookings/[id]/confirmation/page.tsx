"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { getBookingDetail, verifyPayment } from "@/lib/api/bookings";
import { ConfirmationSummary } from "@/components/bookings/confirmation-summary";
import { ConfirmationNextSteps } from "@/components/bookings/confirmation-next-steps";
import type { BookingDetail } from "@/lib/types/booking";

const VERIFY_MAX_RETRIES = 3;
const VERIFY_RETRY_DELAY = 2000;

export default function BookingConfirmationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params.id;
  const paymentStatus = searchParams.get("payment_status");

  const { accessToken, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingBookings, setPendingBookings] = useState<number[]>([]);

  const verifyAndFetchBooking = useCallback(async (bookingId: number, token: string) => {
    // If arriving from Stripe success redirect, verify payment first
    if (paymentStatus === "success") {
      for (let attempt = 0; attempt < VERIFY_MAX_RETRIES; attempt++) {
        try {
          const result = await verifyPayment(bookingId, token);
          if (result.bookingStatus === "PAID") break;
        } catch {
          // verifyPayment failed, continue to fetch booking detail anyway
        }
        if (attempt < VERIFY_MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, VERIFY_RETRY_DELAY));
        }
      }
    }

    // Fetch booking detail regardless of verification result
    const data = await getBookingDetail(bookingId, token);
    return data;
  }, [paymentStatus]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!id || !accessToken) return;

    // Check for remaining cart bookings that need payment
    try {
      const stored = sessionStorage.getItem("pendingBookingIds");
      if (stored) {
        const ids: number[] = JSON.parse(stored);
        setPendingBookings(ids);
      }
    } catch {
      // ignore parse errors
    }

    const run = async () => {
      try {
        const data = await verifyAndFetchBooking(Number(id), accessToken);
        setBooking(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load booking details.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, accessToken, isAuthenticated, router, verifyAndFetchBooking]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200" />
            <div className="mx-auto mb-2 h-8 w-72 rounded bg-gray-200" />
            <div className="mx-auto h-4 w-48 rounded bg-gray-200" />
          </div>
          <div className="space-y-4 rounded-lg border border-gray-200 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-4 w-48 rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Booking Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            {error ?? "We couldn't find the booking you're looking for."}
          </p>
          <a
            href="/bookings"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go to My Bookings
          </a>
        </div>
      </div>
    );
  }

  const handlePayNextBooking = () => {
    if (pendingBookings.length === 0) return;
    const [nextId, ...remaining] = pendingBookings;
    if (remaining.length > 0) {
      sessionStorage.setItem("pendingBookingIds", JSON.stringify(remaining));
    } else {
      sessionStorage.removeItem("pendingBookingIds");
    }
    router.push(`/bookings/${nextId}/pay`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Pending cart bookings banner */}
      {pendingBookings.length > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-800">
              You have {pendingBookings.length} more booking{pendingBookings.length > 1 ? "s" : ""} to pay
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Complete payment before they expire (15 min each)
            </p>
          </div>
          <button
            onClick={handlePayNextBooking}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Pay Next Booking
          </button>
        </div>
      )}

      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="mt-2 text-gray-600">
          Your reservation has been successfully confirmed.
        </p>
      </div>

      {/* Booking summary */}
      <div className="mb-6">
        <ConfirmationSummary booking={booking} />
      </div>

      {/* Next steps */}
      <div className="mb-8">
        <ConfirmationNextSteps />
      </div>

      {/* Support contact info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Need Help?
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          If you have any questions about your booking, feel free to reach out to
          our support team.
        </p>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <span>support@bookingtour.com</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href="/bookings"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View My Bookings
        </a>
        <a
          href="/tours"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Browse More Tours
        </a>
      </div>
    </div>
  );
}
