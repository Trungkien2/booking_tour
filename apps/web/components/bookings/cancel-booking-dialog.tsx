"use client";

import { useState } from "react";
import { CancellationPreview } from "@/lib/types/booking";

interface CancelBookingDialogProps {
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, confirmNoRefund?: boolean) => void;
  preview: CancellationPreview | null;
  loading: boolean;
}

export const CancelBookingDialog = ({
  bookingId,
  isOpen,
  onClose,
  onConfirm,
  preview,
  loading,
}: CancelBookingDialogProps) => {
  const [reason, setReason] = useState("");
  const [confirmNoRefund, setConfirmNoRefund] = useState(false);

  if (!isOpen) return null;

  const isLateCancel = preview ? preview.refundPercentage < 100 : false;
  const isNoRefund = preview ? preview.refundPercentage === 0 : false;

  const handleConfirm = () => {
    onConfirm(reason || undefined, isNoRefund ? confirmNoRefund : undefined);
  };

  const canConfirm = loading
    ? false
    : isNoRefund
      ? confirmNoRefund
      : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Cancel Booking
              </h2>
              <p className="text-sm text-gray-500">Booking #{bookingId}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <svg
                className="h-8 w-8 animate-spin text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Loading cancellation details...
              </p>
            </div>
          ) : preview ? (
            <div className="space-y-4">
              {/* Refund Info */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cancellation Tier</span>
                    <span className="font-medium text-gray-900">
                      {preview.tier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Refund Percentage</span>
                    <span className="font-medium text-gray-900">
                      {preview.refundPercentage}%
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Refund Amount
                      </span>
                      <span className="text-lg font-bold text-green-700">
                        ${preview.refundAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Late cancellation warning */}
              {isLateCancel && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex gap-2">
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
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-sm text-amber-800">
                      {isNoRefund
                        ? "This cancellation is past the refund deadline. No refund will be issued."
                        : `Late cancellation - only ${preview.refundPercentage}% of your payment will be refunded.`}
                    </p>
                  </div>
                </div>
              )}

              {/* No refund checkbox */}
              {isNoRefund && (
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={confirmNoRefund}
                    onChange={(e) => setConfirmNoRefund(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that no refund will be issued for this
                    cancellation.
                  </span>
                </label>
              )}

              {/* Reason textarea */}
              <div>
                <label
                  htmlFor="cancel-reason"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Reason for cancellation{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="cancel-reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Let us know why you're cancelling..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">
              Unable to load cancellation details. Please try again.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Keep Booking
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
};
