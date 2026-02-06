'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Users } from 'lucide-react';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80';

interface HeroSectionProps {
  initialSearch?: string;
}

export function HeroSection({ initialSearch = '' }: HeroSectionProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (dates) params.set('dates', dates);
    if (guests) params.set('guests', guests);
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <section className="relative w-full shrink-0">
      <div
        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 pb-16 md:pb-20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("${HERO_IMAGE}")`,
        }}
        role="img"
        aria-label="Scenic mountain landscape with lake"
      >
        <div className="flex flex-col gap-3 text-center z-10 max-w-3xl">
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
            Discover Your Next Adventure
          </h1>
          <p className="text-gray-100 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
            Explore the world&apos;s most beautiful destinations with our
            curated tours.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl z-10 mt-4 px-4"
        >
          <div className="flex flex-col md:flex-row md:items-center bg-white dark:bg-gray-900 rounded-[28px] shadow-2xl">
            {/* Location Field */}
            <div className="flex-[1.4] flex items-center gap-4 pl-6 pr-4 h-14 md:h-[72px] border-b md:border-b-0 border-gray-100 dark:border-gray-800">
              <Search className="size-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-[15px] outline-none"
              />
            </div>

            {/* Divider 1 */}
            <div className="hidden md:flex items-center h-[72px]">
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Dates Field */}
            <div className="flex-[1.2] flex items-center gap-4 pl-6 pr-4 h-14 md:h-[72px] border-b md:border-b-0 border-gray-100 dark:border-gray-800">
              <Calendar className="size-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text';
                  setDates(e.target.value);
                }}
                onChange={(e) => setDates(e.target.value)}
                placeholder="Add dates"
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-[15px] outline-none"
                style={{ colorScheme: 'light' }}
              />
            </div>

            {/* Divider 2 */}
            <div className="hidden md:flex items-center h-[72px]">
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Guests Field */}
            <div className="flex-1 flex items-center gap-4 pl-6 pr-4 h-14 md:h-[72px]">
              <Users className="size-5 text-gray-400 flex-shrink-0" />
              <input
                type="number"
                min={1}
                value={guests || ''}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Guests"
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-[15px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Search Button */}
            <div className="p-3">
              <button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto bg-primary hover:bg-[#0d7ed4] !text-white font-semibold rounded-full px-10 h-12 md:h-[48px] transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 text-[15px]"
              >
                {isPending ? (
                  <>
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
