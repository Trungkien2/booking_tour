'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

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
    <section className="relative w-full">
      <div
        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 relative"
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

        {/* Search Bar - bám design: 4 ô ngang, nút Search bên phải */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-[800px] z-10 mt-4 px-2"
        >
          <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl gap-2">
            <div className="flex-1 flex items-center px-3 h-12 md:h-14 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined text-gray-400 mr-3">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full bg-transparent border-none focus:ring-0 text-[#111518] dark:text-white placeholder-gray-400 text-base outline-none"
              />
            </div>
            <div className="flex-1 flex items-center px-3 h-12 md:h-14 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined text-gray-400 mr-3">
                calendar_month
              </span>
              <input
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => {
                  e.target.type = 'text';
                  setDates(e.target.value);
                }}
                onChange={(e) => setDates(e.target.value)}
                placeholder="Add dates"
                className="w-full bg-transparent border-none focus:ring-0 text-[#111518] dark:text-white placeholder-gray-400 text-base outline-none"
                style={{ colorScheme: 'light' }}
              />
            </div>
            <div className="flex-1 flex items-center px-3 h-12 md:h-14">
              <span className="material-symbols-outlined text-gray-400 mr-3">
                group
              </span>
              <input
                type="number"
                min={1}
                value={guests || ''}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Guests"
                className="w-full bg-transparent border-none focus:ring-0 text-[#111518] dark:text-white placeholder-gray-400 text-base outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#1392ec] hover:bg-blue-600 text-white font-bold rounded-lg px-8 h-12 md:h-14 transition-all shadow-md md:ml-2 mt-2 md:mt-0 w-full md:w-auto disabled:opacity-70"
            >
              {isPending ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
