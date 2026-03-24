"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { createPayment } from "@/lib/api/bookings";

export default function BookingPayPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { accessToken, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!id || !accessToken) return;

    const run = async () => {
      try {
        const returnUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/bookings/${id}/confirmation`
            : "";
        const res = await createPayment(
          Number(id),
          "stripe",
          returnUrl,
          accessToken
        );
        const url = res.checkoutUrl ?? res.payment?.checkoutUrl;
        if (url) {
          window.location.href = url;
          return;
        }
        setError("No checkout URL received.");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to start payment.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, accessToken, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-gray-600">Redirecting to payment...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
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
        <h1 className="mb-2 text-xl font-bold text-gray-900">
          Payment could not be started
        </h1>
        <p className="mb-6 text-gray-600">{error}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/bookings/${id}`}
            className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Booking
          </Link>
          <Link
            href="/bookings"
            className="inline-flex rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
