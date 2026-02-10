"use client";

import { BookingDetail } from "@/lib/types/booking";
import { BookingStatusBadge } from "./booking-status-badge";

interface ConfirmationSummaryProps {
  booking: BookingDetail;
}

export const ConfirmationSummary = ({ booking }: ConfirmationSummaryProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 border-b border-gray-100 bg-green-50 px-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-800">
          Booking Confirmed!
        </h2>
        <p className="text-sm text-green-600">
          Your tour has been successfully booked.
        </p>
      </div>

      {/* Booking ID & Status */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Booking ID
          </p>
          <p className="text-lg font-semibold text-gray-900">
            #{booking.id}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Tour Info */}
      <div className="space-y-3 border-b border-gray-100 px-6 py-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Tour Details
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
              />
            </svg>
            <span className="text-sm font-medium text-gray-900">
              {booking.tour.name}
            </span>
          </div>
          {booking.tour.location && (
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
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
              <span className="text-sm text-gray-600">{booking.tour.location}</span>
            </div>
          )}
          {booking.schedule.startDate && (
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
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
              <span className="text-sm text-gray-600">
                {new Date(booking.schedule.startDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {booking.tour.durationDays && (
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                {booking.tour.durationDays}{" "}
                {booking.tour.durationDays === 1 ? "day" : "days"}
              </span>
            </div>
          )}
          {booking.travelerCount != null && (
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                {booking.travelerCount}{" "}
                {booking.travelerCount === 1
                  ? "participant"
                  : "participants"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-b border-gray-100 px-6 py-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Price Breakdown
        </h3>
        <div className="space-y-2">
          {booking.priceBreakdown.adults.count > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Adults x {booking.priceBreakdown.adults.count}
              </span>
              <span className="font-medium text-gray-900">
                ${booking.priceBreakdown.adults.total.toFixed(2)}
              </span>
            </div>
          )}
          {booking.priceBreakdown.children.count > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Children x {booking.priceBreakdown.children.count}
              </span>
              <span className="font-medium text-gray-900">
                ${booking.priceBreakdown.children.total.toFixed(2)}
              </span>
            </div>
          )}
          {booking.priceBreakdown.taxes > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium text-gray-900">
                ${booking.priceBreakdown.taxes.toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${booking.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="px-6 py-5">
        <div className="rounded-lg bg-amber-50 p-4">
          <div className="flex gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">
                Cancellation Policy
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Free cancellation up to 24 hours before the tour starts. After
                that, a cancellation fee may apply. Refunds are processed within
                5-10 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
