import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTours } from '@/lib/api/tours';
import { TourFilters } from '@/lib/types/tour';
import {
  TourGrid,
  TourFiltersBar,
  TourPagination,
  TourGridSkeleton,
  TourSearch,
  EmptyState,
  ErrorState,
} from '@/components/tours';

export const metadata: Metadata = {
  title: 'Browse All Tours | TourBooking',
  description:
    'Browse our complete collection of tours. Filter by price, difficulty, duration, and more to find your perfect adventure.',
  keywords: [
    'tours',
    'travel',
    'vacation',
    'adventure',
    'destinations',
    'browse tours',
  ],
  openGraph: {
    title: 'Browse All Tours | TourBooking',
    description: 'Browse our complete collection of tours.',
    images: ['/og-tours.jpg'],
    type: 'website',
  },
};

interface ToursPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
    priceMin?: string;
    priceMax?: string;
    difficulty?: string;
    location?: string;
    duration?: string;
  }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;

  // Parse search params into filters
  const filters: TourFilters = {
    search: params.search,
    page: params.page ? parseInt(params.page, 10) : 1,
    sort: params.sort as TourFilters['sort'],
    priceMin: params.priceMin ? parseInt(params.priceMin, 10) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax, 10) : undefined,
    difficulty: params.difficulty as TourFilters['difficulty'],
    location: params.location,
    duration: params.duration,
    limit: 12,
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
            Explore Our Tours
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover amazing destinations and unforgettable experiences
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <Suspense fallback={null}>
              <TourSearch
                initialValue={filters.search}
                placeholder="Search by tour name or destination..."
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <Suspense fallback={null}>
          <TourFiltersBar />
        </Suspense>

        {/* Tour Grid with Suspense */}
        <Suspense fallback={<TourGridSkeleton count={12} />}>
          <ToursContent filters={filters} />
        </Suspense>
      </section>
    </main>
  );
}

/**
 * Async component to fetch and display tours.
 */
async function ToursContent({ filters }: { filters: TourFilters }) {
  try {
    const { tours, pagination } = await getTours(filters);

    if (tours.length === 0) {
      return <EmptyState />;
    }

    return (
      <>
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold">{tours.length}</span> of{' '}
            <span className="font-semibold">{pagination.total}</span> tours
          </p>
        </div>

        {/* Tour Grid */}
        <TourGrid tours={tours} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Suspense fallback={null}>
            <TourPagination pagination={pagination} />
          </Suspense>
        )}
      </>
    );
  } catch (error) {
    console.error('Error loading tours:', error);
    return (
      <ErrorState
        error={error instanceof Error ? error : 'Failed to load tours'}
        title="Unable to load tours"
      />
    );
  }
}
