'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Pagination } from '@/lib/types/tour';

interface TourPaginationProps {
  pagination: Pagination;
}

export function TourPagination({ pagination }: TourPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { page, totalPages, hasNext, hasPrev } = pagination;

  const goToPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage));

      startTransition(() => {
        router.push(`/?${params.toString()}`);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    [router, searchParams],
  );

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(page - 1)}
        disabled={!hasPrev || isPending}
        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum as number)}
              disabled={isPending}
              className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                pageNum === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ),
        )}
      </div>

      {/* Page Info (mobile) */}
      <span className="sm:hidden text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => goToPage(page + 1)}
        disabled={!hasNext || isPending}
        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
