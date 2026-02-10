"use client";

import { useState } from "react";
import { ReviewListResponse } from "@/lib/types/tour";
import { getTourReviews } from "@/lib/api/tours";

interface TourReviewsProps {
  tourId: number;
  initialData: ReviewListResponse;
}

export function TourReviews({ tourId, initialData }: TourReviewsProps) {
  const [data, setData] = useState(initialData);
  const [sort, setSort] = useState<"recent" | "rating_desc" | "rating_asc">(
    "recent",
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { summary, reviews, pagination } = data;

  const handleSortChange = async (newSort: typeof sort) => {
    setSort(newSort);
    setPage(1);
    setLoading(true);
    try {
      const result = await getTourReviews(tourId, 1, 5, newSort);
      setData(result);
    } catch {
      // keep current data
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const result = await getTourReviews(tourId, nextPage, 5, sort);
      setData((prev) => ({
        ...result,
        reviews: [...prev.reviews, ...result.reviews],
      }));
      setPage(nextPage);
    } catch {
      // keep current data
    } finally {
      setLoading(false);
    }
  };

  if (summary.totalReviews === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Reviews
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to review this tour!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm"
      id="reviews"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Reviews ({summary.totalReviews})
        </h2>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as typeof sort)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300"
        >
          <option value="recent">Most Recent</option>
          <option value="rating_desc">Highest Rating</option>
          <option value="rating_asc">Lowest Rating</option>
        </select>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-gray-200 dark:sm:border-gray-600">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {summary.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`material-symbols-outlined text-base ${
                  star <= Math.round(summary.averageRating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {summary.totalReviews} reviews
          </div>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-1.5">
          {["5", "4", "3", "2", "1"].map((star) => {
            const count = summary.distribution[star] || 0;
            const pct =
              summary.totalReviews > 0
                ? (count / summary.totalReviews) * 100
                : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-600 dark:text-gray-400">
                  {star}
                </span>
                <span
                  className="material-symbols-outlined text-xs text-yellow-500"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-600">
                  <div
                    className="h-full rounded-full bg-yellow-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0">
                {review.user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {review.user.fullName}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`material-symbols-outlined text-xs ${
                          star <= review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.helpful > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        thumb_up
                      </span>
                      {review.helpful} helpful
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {pagination.hasNext && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Reviews"}
        </button>
      )}
    </div>
  );
}
