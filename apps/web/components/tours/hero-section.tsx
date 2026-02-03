'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  initialSearch?: string;
}

export function HeroSection({ initialSearch = '' }: HeroSectionProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      startTransition(() => {
        router.push(`/?search=${encodeURIComponent(search.trim())}`);
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Discover Your Next Adventure
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore breathtaking destinations and create unforgettable memories
            with our curated tours.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations, tours..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-14 px-8 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">500+</p>
              <p className="text-blue-200 text-sm md:text-base">
                Amazing Tours
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
              <p className="text-blue-200 text-sm md:text-base">Destinations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">10k+</p>
              <p className="text-blue-200 text-sm md:text-base">
                Happy Travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
