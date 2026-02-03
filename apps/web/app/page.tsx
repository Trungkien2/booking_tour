import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTours } from '@/lib/api/tours';
import { TourFilters } from '@/lib/types/tour';
import {
  HeroSection,
  TourGrid,
  TourFiltersBar,
  TourPagination,
  TourGridSkeleton,
  EmptyState,
} from '@/components/tours';

export const metadata: Metadata = {
  title: 'Discover Amazing Tours | TourBooking',
  description:
    "Explore the world's most beautiful destinations with our curated tours. Find your next adventure today.",
  keywords: ['tours', 'travel', 'vacation', 'adventure', 'destinations'],
  openGraph: {
    title: 'Discover Amazing Tours | TourBooking',
    description:
      "Explore the world's most beautiful destinations with our curated tours.",
    images: ['/og-tours.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Amazing Tours | TourBooking',
    description: "Explore the world's most beautiful destinations.",
    images: ['/og-tours.jpg'],
  },
};

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
    priceMin?: string;
    priceMax?: string;
    difficulty?: string;
    duration?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Parse search params into filters
  const filters: TourFilters = {
    search: params.search,
    page: params.page ? parseInt(params.page, 10) : 1,
    sort: params.sort as TourFilters['sort'],
    priceMin: params.priceMin ? parseInt(params.priceMin, 10) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax, 10) : undefined,
    difficulty: params.difficulty as TourFilters['difficulty'],
    duration: params.duration,
    limit: 8,
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection initialSearch={filters.search} />

      {/* Tours Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        {/* Section Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Popular Tours This Season
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hand-picked destinations for your next holiday.
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={null}>
          <TourFiltersBar />
        </Suspense>

        {/* Tour Grid with Suspense */}
        <Suspense fallback={<TourGridSkeleton count={8} />}>
          <ToursContent filters={filters} />
        </Suspense>
      </section>
    </main>
  );
}

/**
 * Async component to fetch and display tours.
 * Wrapped in Suspense boundary above.
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
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to load tours
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }
}
