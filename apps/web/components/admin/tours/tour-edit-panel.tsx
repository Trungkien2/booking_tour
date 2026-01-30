"use client";

import { Tour } from "@/lib/api/admin/tours";
import { TourForm } from "./tour-form";
import { TourFormData } from "@/lib/validations/tour";
import { X } from "lucide-react";

interface TourEditPanelProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TourFormData) => void;
  loading?: boolean;
}

export function TourEditPanel({
  tour,
  isOpen,
  onClose,
  onSave,
  loading,
}: TourEditPanelProps) {
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Tour</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <TourForm initialData={tour} onSubmit={onSave} loading={loading} />
      </div>
    </div>
  );
}
