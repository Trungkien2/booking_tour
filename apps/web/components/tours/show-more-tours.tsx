'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Pagination } from '@/lib/types/tour';

interface ShowMoreToursProps {
  pagination: Pagination;
}

export function ShowMoreTours({ pagination }: ShowMoreToursProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { hasNext, page } = pagination;

  if (!hasNext) return null;

  const goToNextPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page + 1));
    startTransition(() => {
      router.push(`/?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="flex justify-center pt-2">
      <button
        type="button"
        onClick={goToNextPage}
        disabled={isPending}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[#111518] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-70"
      >
        <span>Show More Tours</span>
        <span className="material-symbols-outlined text-[20px]">
          expand_more
        </span>
      </button>
    </div>
  );
}
