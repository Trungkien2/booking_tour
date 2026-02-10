"use client";

import { BookingDetail } from "@/lib/types/booking";
import { BookingStatusBadge } from "./booking-status-badge";

interface BookingDetailModalProps {
  booking: BookingDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({
  booking,
  isOpen,
  onClose,
}: BookingDetailModalProps) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500">Booking #{booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Status */}
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>

          {/* Tour Info */}
          <div className="space-y-3 border-b border-gray-100 px-6 py-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Tour Information
            </h3>
            <div className="space-y-2">
              <p className="text-base font-semibold text-gray-900">
                {booking.tour.name}
              </p>
              {booking.tour.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
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
                  {booking.tour.location}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Details */}
          <div className="space-y-3 border-b border-gray-100 px-6 py-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {booking.schedule.startDate && (
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.schedule.startDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
              {booking.tour.durationDays && (
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.tour.durationDays}{" "}
                    {booking.tour.durationDays === 1 ? "day" : "days"}
                  </p>
                </div>
              )}
              {booking.travelerCount != null && (
                <div>
                  <p className="text-xs text-gray-500">Participants</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.travelerCount}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Travelers List */}
          {booking.travelers && booking.travelers.length > 0 && (
            <div className="space-y-3 border-b border-gray-100 px-6 py-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Travelers
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Age Group
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {booking.travelers.map((traveler) => (
                      <tr key={traveler.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">
                          {traveler.fullName}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              traveler.ageGroup === "ADULT"
                                ? "bg-blue-50 text-blue-700"
                                : traveler.ageGroup === "CHILD"
                                  ? "bg-pink-50 text-pink-700"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {traveler.ageGroup}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-gray-900">
                          ${traveler.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                  <span className="text-gray-900">
                    ${booking.priceBreakdown.adults.total.toFixed(2)}
                  </span>
                </div>
              )}
              {booking.priceBreakdown.children.count > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Children x {booking.priceBreakdown.children.count}
                  </span>
                  <span className="text-gray-900">
                    ${booking.priceBreakdown.children.total.toFixed(2)}
                  </span>
                </div>
              )}
              {booking.priceBreakdown.taxes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="text-gray-900">
                    ${booking.priceBreakdown.taxes.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {booking.payments && booking.payments.length > 0 && (
            <div className="space-y-3 border-b border-gray-100 px-6 py-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Payment History
              </h3>
              <div className="space-y-3">
                {booking.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.provider}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          payment.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund History */}
          {booking.refunds && booking.refunds.length > 0 && (
            <div className="space-y-3 px-6 py-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Refund History
              </h3>
              <div className="space-y-3">
                {booking.refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="flex items-center justify-between rounded-lg border border-purple-100 bg-purple-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Refund
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(refund.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      {refund.reason && (
                        <p className="mt-1 text-xs text-gray-600">
                          {refund.reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-700">
                        ${refund.amount.toFixed(2)}
                      </p>
                      <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        {refund.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
