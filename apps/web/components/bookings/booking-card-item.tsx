"use client";

import Image from "next/image";
import Link from "next/link";
import { BookingListItem } from "@/lib/types/booking";
import { BookingStatusBadge } from "./booking-status-badge";

interface BookingCardItemProps {
  booking: BookingListItem;
  onCancel: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export const BookingCardItem = ({
  booking,
  onCancel,
  onViewDetail,
}: BookingCardItemProps) => {
  const isPending = booking.status === "PENDING";
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Tour Image */}
        <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-48">
          {booking.tour.coverImage ? (
            <Image
              src={booking.tour.coverImage}
              alt={booking.tour.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <svg
                className="h-12 w-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                {booking.tour.name}
              </h3>
              <BookingStatusBadge status={booking.status} />
            </div>

            <p className="mb-3 text-xs text-gray-500">
              Booking #{booking.id}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {booking.schedule.startDate && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date(booking.schedule.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              )}

              {booking.tour.location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">{booking.tour.location}</span>
                </div>
              )}

              {booking.travelerCount != null && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                  <span>
                    {booking.travelerCount}{" "}
                    {booking.travelerCount === 1 ? "traveler" : "travelers"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Price & Actions */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ${booking.totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onViewDetail(booking.id)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                View Details
              </button>
              {isPending && (
                <Link
                  href={`/bookings/${booking.id}/pay`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Complete Payment
                </Link>
              )}
              {booking.canCancel && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Cancel Booking
                </button>
              )}
              <button
                disabled
                title="Modify is not available yet"
                className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400"
              >
                Modify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
