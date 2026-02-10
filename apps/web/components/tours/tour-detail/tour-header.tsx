"use client";

import Link from "next/link";
import { TourDetail } from "@/lib/types/tour";
import { FavoriteButton } from "./favorite-button";
import { ShareModal } from "./share-modal";

interface TourHeaderProps {
  tour: TourDetail;
}

export function TourHeader({ tour }: TourHeaderProps) {
  const difficultyLabel = {
    EASY: "Easy",
    MODERATE: "Moderate",
    CHALLENGING: "Challenging",
  }[tour.difficulty];

  const difficultyColor = {
    EASY: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    MODERATE:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    CHALLENGING: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }[tour.difficulty];

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/tours"
          className="hover:text-gray-700 dark:hover:text-gray-200"
        >
          Tours
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{tour.name}</span>
      </nav>

      {/* Title Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            {tour.location && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                {tour.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">
                schedule
              </span>
              {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">group</span>
              Max {tour.maxGroupSize} people
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColor}`}
            >
              {difficultyLabel}
            </span>
            {tour.ratingAverage > 0 && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-yellow-500">
                  star
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {tour.ratingAverage.toFixed(1)}
                </span>
                <span>({tour.reviewCount} reviews)</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ShareModal tourName={tour.name} tourSlug={tour.slug} />
          <FavoriteButton tourId={tour.id} />
        </div>
      </div>
    </div>
  );
}
