'use client';

import { useRouter } from 'next/navigation';

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-24 h-24 mb-6 text-gray-300 dark:text-gray-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        No tours found
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        We couldn&apos;t find any tours matching your criteria. Try adjusting
        your filters or search terms.
      </p>

      {/* Suggestions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <p className="font-medium mb-2">Suggestions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Try adjusting your filters</li>
          <li>Search for a different destination</li>
          <li>Clear all filters to see all tours</li>
        </ul>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
