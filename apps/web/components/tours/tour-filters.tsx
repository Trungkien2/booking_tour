'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

const priceOptions = [
  { label: 'All Prices', value: '' },
  { label: 'Under $500', value: '0-500' },
  { label: '$500 - $1,000', value: '500-1000' },
  { label: '$1,000 - $2,000', value: '1000-2000' },
  { label: 'Over $2,000', value: '2000-' },
];

const difficultyOptions = [
  { label: 'All Levels', value: '' },
  { label: 'Easy', value: 'easy' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Challenging', value: 'challenging' },
];

const durationOptions = [
  { label: 'Any Duration', value: '' },
  { label: '1-3 Days', value: '1-3' },
  { label: '4-7 Days', value: '4-7' },
  { label: '8+ Days', value: '8+' },
];

export function TourFiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset to page 1 when filter changes
      params.delete('page');

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const handlePriceChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        const [min, max] = value.split('-');
        if (min) params.set('priceMin', min);
        else params.delete('priceMin');
        if (max) params.set('priceMax', max);
        else params.delete('priceMax');
      } else {
        params.delete('priceMin');
        params.delete('priceMax');
      }

      params.delete('page');

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  // Current values
  const currentSort = searchParams.get('sort') || 'popular';
  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentDuration = searchParams.get('duration') || '';
  const currentPriceMin = searchParams.get('priceMin');
  const currentPriceMax = searchParams.get('priceMax');
  const currentPrice =
    currentPriceMin || currentPriceMax
      ? `${currentPriceMin || ''}-${currentPriceMax || ''}`
      : '';

  const hasActiveFilters =
    currentSort !== 'popular' ||
    currentPrice ||
    currentDifficulty ||
    currentDuration;

  return (
    <div className="flex flex-wrap gap-2 mb-6 pb-2 overflow-x-auto scrollbar-hide">
      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => updateFilter('sort', e.target.value)}
        disabled={isPending}
        className="h-10 shrink-0 px-4 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-200 hover:border-blue-600 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Price */}
      <select
        value={currentPrice}
        onChange={(e) => handlePriceChange(e.target.value)}
        disabled={isPending}
        className="h-10 shrink-0 px-4 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-200 hover:border-blue-600 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {priceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Duration */}
      <select
        value={currentDuration}
        onChange={(e) => updateFilter('duration', e.target.value)}
        disabled={isPending}
        className="h-10 shrink-0 px-4 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-200 hover:border-blue-600 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {durationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Difficulty */}
      <select
        value={currentDifficulty}
        onChange={(e) => updateFilter('difficulty', e.target.value)}
        disabled={isPending}
        className="h-10 shrink-0 px-4 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-200 hover:border-blue-600 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {difficultyOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            startTransition(() => {
              router.push('/');
            });
          }}
          disabled={isPending}
          className="h-10 shrink-0 px-4 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors disabled:opacity-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
