'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Tour } from '@/lib/types/tour';
import {
  formatCurrency,
  formatRating,
  formatDuration,
} from '@/lib/utils/format';

interface TourCardProps {
  tour: Tour;
  priority?: boolean;
}

export function TourCard({ tour, priority = false }: TourCardProps) {
  return (
    <article className="group flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link
        href={`/tours/${tour.slug}`}
        className="relative w-full aspect-[4/3] overflow-hidden"
      >
        <Image
          src={tour.coverImage || '/images/placeholder-tour.jpg'}
          alt={tour.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        <button
          type="button"
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black/70 transition-colors"
          aria-label="Add to favorites"
          onClick={(e) => e.preventDefault()}
        >
          <span
            className="material-symbols-outlined text-[20px] text-gray-500 dark:text-gray-400"
            aria-hidden
          >
            favorite
          </span>
        </button>
      </Link>

      <div className="flex flex-col flex-grow p-4 md:p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={`/tours/${tour.slug}`} className="min-w-0 flex-1">
            <h3 className="text-[#111518] dark:text-white text-lg font-bold leading-tight line-clamp-2 group-hover:text-[#1392ec] transition-colors">
              {tour.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-orange-400 flex-shrink-0">
            <span
              className="material-symbols-outlined text-[16px] fill-current"
              aria-hidden
            >
              star
            </span>
            <span className="text-sm font-bold text-[#111518] dark:text-white">
              {formatRating(tour.ratingAverage)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
          <span className="material-symbols-outlined text-[16px]">
            schedule
          </span>
          <span>{formatDuration(tour.durationDays)}</span>
          {tour.location && (
            <>
              <span className="mx-1">•</span>
              <span>{tour.location}</span>
            </>
          )}
        </div>

        {tour.summary && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-grow">
            {tour.summary}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Starting from
            </span>
            <span className="text-[#1392ec] text-lg font-bold">
              {formatCurrency(tour.priceAdult)}
            </span>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="shrink-0 h-10 inline-flex items-center justify-center bg-[#1392ec] hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
