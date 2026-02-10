"use client";

import { TourSchedule } from "@/lib/types/tour";

interface SchedulePickerProps {
  schedules: TourSchedule[];
  selected: TourSchedule | null;
  onSelect: (schedule: TourSchedule) => void;
}

export function SchedulePicker({
  schedules,
  selected,
  onSelect,
}: SchedulePickerProps) {
  if (schedules.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
        No available dates at the moment
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Date
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {schedules.map((schedule) => {
          const date = new Date(schedule.startDate);
          const isSelected = selected?.id === schedule.id;
          const isSoldOut =
            schedule.status === "SOLD_OUT" || schedule.availableSpots === 0;

          return (
            <button
              key={schedule.id}
              onClick={() => !isSoldOut && onSelect(schedule)}
              disabled={isSoldOut}
              className={`w-full flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : isSoldOut
                    ? "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              <div>
                <p
                  className={`font-medium ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}
                >
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isSoldOut
                    ? "Sold Out"
                    : `${schedule.availableSpots} spots left`}
                </p>
              </div>
              {isSelected && (
                <span className="material-symbols-outlined text-blue-500 text-base">
                  check_circle
                </span>
              )}
              {isSoldOut && (
                <span className="text-xs font-medium text-red-500 dark:text-red-400">
                  SOLD OUT
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
