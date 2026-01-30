"use client";

import { Tour } from "@/lib/api/admin/tours";
import { Button } from "@/components/ui/button";

interface TourDeleteDialogProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function TourDeleteDialog({
  tour,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: TourDeleteDialogProps) {
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Tour</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <strong>{tour.name}</strong>? This
          action will archive the tour if there are no active bookings.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white border-none"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
