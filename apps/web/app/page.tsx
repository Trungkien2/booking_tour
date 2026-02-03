import { Suspense } from 'react';
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
    <main className="grow w-full">
      <HeroSection initialSearch={filters.search} />

      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section Header & Filters - bám design: title trái, filter pills phải */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="min-w-0">
            <h2 className="text-[#111518] dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
              Popular Tours This Season
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Hand-picked destinations for your next holiday.
            </p>
          </div>
          <div className="shrink-0">
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
      <>
        <TourGrid tours={tours} />

        <Suspense fallback={null}>
          <ShowMoreTours pagination={pagination} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error loading tours:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-[#111518] dark:text-white mb-2">
          Unable to load tours
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }
}
