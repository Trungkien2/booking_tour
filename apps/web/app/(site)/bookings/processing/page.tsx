"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { getBookingStatus } from "@/lib/api/bookings";
import { ProcessingSteps } from "@/components/bookings/processing-steps";
import type { BookingStatusResponse } from "@/lib/types/booking";

const POLL_INTERVAL = 2000;
const MAX_POLL_DURATION = 5 * 60 * 1000; // 5 minutes

export default function BookingProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const { accessToken, isAuthenticated } = useAuth();

  const [statusData, setStatusData] = useState<BookingStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!bookingId) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }

    const numericId = Number(bookingId);

    const poll = async () => {
      try {
        const data = await getBookingStatus(numericId, accessToken!);
        setStatusData(data);
        setLoading(false);

        if (data.status === "PAID") {
          stopPolling();
          router.push(`/bookings/${bookingId}/confirmation`);
          return;
        }

        if (data.status === "CANCELLED") {
          stopPolling();
          setError("This booking has been cancelled.");
          return;
        }
      } catch (err: unknown) {
        setLoading(false);
        const message = err instanceof Error ? err.message : "An error occurred while checking status.";
        setError(message);
        stopPolling();
      }
    };

    // Initial fetch
    poll();

    // Start polling
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    // Auto-stop after 5 minutes
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setTimedOut(true);
      setError(
        "Processing is taking longer than expected. Please check your bookings page for the latest status."
      );
    }, MAX_POLL_DURATION);

    return () => {
      stopPolling();
    };
  }, [bookingId, accessToken, isAuthenticated, router, stopPolling]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="mx-auto h-8 w-64 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-96 rounded bg-gray-200" />
          <div className="space-y-4 rounded-lg border border-gray-200 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="h-4 flex-1 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
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
            {timedOut ? "Processing Timeout" : "Processing Error"}
          </h1>
          <p className="mb-6 text-gray-600">{error}</p>
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Processing Your Booking
          </h1>
          <p className="mt-2 text-gray-600">
            Please wait while we confirm your reservation...
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p className="text-sm font-medium text-amber-800">
              Do not close this page while processing your booking.
            </p>
          </div>
        </div>

        {statusData?.steps && statusData.steps.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <ProcessingSteps steps={statusData.steps} />
          </div>
        )}
      </div>
    </div>
  );
}
