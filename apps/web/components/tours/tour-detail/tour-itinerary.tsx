"use client";

import { useState } from "react";
import { ItineraryDay } from "@/lib/types/tour";

interface TourItineraryProps {
  itinerary: ItineraryDay[];
}

export function TourItinerary({ itinerary }: TourItineraryProps) {
  const [openDay, setOpenDay] = useState<number | null>(
    itinerary[0]?.day ?? null,
  );

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Itinerary
      </h2>
      <div className="space-y-2">
        {itinerary.map((day) => (
          <div
            key={day.day}
            className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {day.day}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {day.title}
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-gray-400 transition-transform ${
                  openDay === day.day ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            {openDay === day.day && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {day.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
