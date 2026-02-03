import Image from 'next/image';
import Link from 'next/link';
import { Tour } from '@/lib/types/tour';
import {
  formatCurrency,
  formatRating,
  formatDuration,
  getDifficultyColor,
} from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface TourCardProps {
  tour: Tour;
  priority?: boolean;
}

export function TourCard({ tour, priority = false }: TourCardProps) {
  return (
    <article className="group flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <Link
        href={`/tours/${tour.slug}`}
        className="relative w-full aspect-[4/3] overflow-hidden"
      >
        <Image
          src={tour.coverImage || '/images/placeholder-tour.jpg'}
          alt={tour.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black/70 transition-colors"
          aria-label="Add to favorites"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Featured Badge */}
        {tour.featured && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 md:p-5">
        {/* Title & Rating */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link href={`/tours/${tour.slug}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tour.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 flex-shrink-0">
            <svg
              className="w-4 h-4 text-orange-400 fill-orange-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatRating(tour.ratingAverage)}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatDuration(tour.durationDays)}</span>

          {tour.location && (
            <>
              <span className="mx-1">•</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{tour.location}</span>
            </>
          )}
        </div>

        {/* Summary */}
        {tour.summary && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-grow">
            {tour.summary}
          </p>
        )}

        {/* Difficulty Badge */}
        {tour.difficulty && (
          <div className="mb-4">
            <span
              className={cn(
                'inline-block text-xs font-semibold px-2 py-1 rounded',
                getDifficultyColor(tour.difficulty),
              )}
            >
              {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Starting from
            </span>
            <div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(tour.priceAdult)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                /person
              </span>
            </div>
          </div>

          <Link
            href={`/tours/${tour.slug}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
