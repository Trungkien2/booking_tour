"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/use-auth";
import { getBookingDetail } from "@/lib/api/bookings";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import type { BookingDetail } from "@/lib/types/booking";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { accessToken, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!id) return;

    const fetchBooking = async () => {
      try {
        const data = await getBookingDetail(Number(id), accessToken!);
        setBooking(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load booking details.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, accessToken, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="space-y-4 rounded-lg border border-gray-200 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-4 w-48 rounded bg-gray-200" />
              </div>
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
            {error ?? "You don't have access to this booking or it doesn't exist."}
          </p>
          <Link
            href="/bookings"
            className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const schedule = booking.schedule as { startDate: string; endDate?: string };
  const startDate = schedule?.startDate
    ? new Date(schedule.startDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-1 text-sm text-gray-500">Booking #{booking.id}</p>
        </div>
        <Link
          href="/bookings"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← My Bookings
        </Link>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <BookingStatusBadge status={booking.status} />
            {booking.status === "PENDING" && (
              <Link
                href={`/bookings/${booking.id}/pay`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Complete Payment
              </Link>
            )}
          </div>

          {booking.tour?.coverImage && (
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={booking.tour.coverImage}
                alt={booking.tour.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-900">
            {booking.tour?.name ?? "Tour"}
          </h2>
          {booking.tour?.location && (
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-block h-4 w-4 rounded bg-gray-200" />
              {booking.tour.location}
            </p>
          )}

          <dl className="mt-6 grid gap-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Date</dt>
              <dd className="font-medium text-gray-900">{startDate}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Travelers</dt>
              <dd className="font-medium text-gray-900">
                {booking.travelers?.length ?? booking.travelerCount ?? 0}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Total</dt>
              <dd className="font-bold text-gray-900">
                ${Number(booking.totalPrice).toFixed(2)}
              </dd>
            </div>
          </dl>

          {booking.travelers && booking.travelers.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700">Travelers</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {booking.travelers.map((t) => (
                  <li key={t.id}>
                    {t.fullName} — {t.ageGroup} (${Number(t.price).toFixed(2)})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {booking.payments && booking.payments.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700">Payments</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {booking.payments.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span>
                      {p.provider} — ${Number(p.amount).toFixed(2)}
                    </span>
                    <span
                      className={
                        p.status === "SUCCESS"
                          ? "text-green-600"
                          : p.status === "FAILED"
                            ? "text-red-600"
                            : "text-gray-500"
                      }
                    >
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
