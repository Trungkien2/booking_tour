import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getTours } from '@/lib/api/tours';
import { TourFilters } from '@/lib/types/tour';
import { HeroSection } from '@/components/tours/hero-section';
import {
  TourGrid,
  TourFiltersBar,
  TourGridSkeleton,
  EmptyState,
  ShowMoreTours,
} from '@/components/tours';

export const metadata: Metadata = {
  title: 'Discover Your Next Adventure | TravelCo',
  description:
    "Explore the world's most beautiful destinations with our curated tours. Hand-picked for your next holiday.",
  keywords: ['tours', 'travel', 'vacation', 'adventure', 'destinations'],
  openGraph: {
    title: 'Discover Your Next Adventure | TravelCo',
    description:
      "Explore the world's most beautiful destinations with our curated tours.",
    images: ['/og-tours.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Next Adventure | TravelCo',
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
    <main className="grow w-full flex flex-col gap-12 sm:gap-16 pb-12 sm:pb-20">
      <HeroSection initialSearch={filters.search} />

      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 sm:pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="min-w-0">
            <h2 className="text-[#111518] dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
              Popular Tours This Season
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm sm:text-base">
              Hand-picked destinations for your next holiday.
            </p>
          </div>
          <div className="shrink-0 flex items-center">
            <Suspense fallback={null}>
              <TourFiltersBar />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<TourGridSkeleton count={8} />}>
          <ToursContent filters={filters} />
        </Suspense>
      </section>
    </main>
  );
}

async function ToursContent({ filters }: { filters: TourFilters }) {
  try {
    const { tours, pagination } = await getTours(filters);

    if (tours.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="space-y-10">
        <TourGrid tours={tours} />
        <Suspense fallback={null}>
          <ShowMoreTours pagination={pagination} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading tours:', error);
    return <ToursErrorState />;
  }
}

function ToursErrorState() {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm"
      role="alert"
      aria-live="polite"
    >
      <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5 text-amber-600 dark:text-amber-400">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-[#111518] dark:text-white mb-2 tracking-tight">
        Unable to load tours
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6 text-sm leading-relaxed">
        Something went wrong on our end. Please try again in a moment or head
        back to explore from the start.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-opacity"
      >
        Back to home
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
