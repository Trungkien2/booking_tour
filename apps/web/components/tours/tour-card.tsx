'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tour } from '@/lib/types/tour';
import {
  formatCurrency,
  formatRating,
  formatDuration,
} from '@/lib/utils/format';

// Padding card (px) — đổi số này để chỉnh khoảng cách mép
const CARD_PADDING_PX = 16;

interface TourCardProps {
  tour: Tour;
  priority?: boolean;
}

export function TourCard({ tour, priority = false }: TourCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const priceStr = formatCurrency(tour.priceAdult);
  const priceNumber = priceStr.replace(/^[^\d]*/, '');
  const priceSymbol = priceStr.startsWith('$') ? '$' : priceStr.slice(0, 1);
  const tourHref = `/tours/${tour.slug}`;

  return (
    <article className={cardRootClass}>
      <CardImage
        tour={tour}
        priority={priority}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite((v) => !v)}
      />

      <div
        className="flex flex-col grow min-w-0 box-border w-full"
        style={{ padding: `${CARD_PADDING_PX}px` }}
      >
        <CardHeader name={tour.name} href={tourHref} rating={tour.ratingAverage} />

        <CardMeta durationDays={tour.durationDays} location={tour.location} />

        {tour.summary && <CardSummary text={tour.summary} />}

        <CardFooter
          priceSymbol={priceSymbol}
          priceNumber={priceNumber}
          bookHref={tourHref}
        />
      </div>
    </article>
  );
}

// ─── Styles (sửa ở đây cho cả card) ───
const cardRootClass =
  'group flex flex-col rounded-2xl bg-white dark:bg-gray-800 overflow-hidden ' +
  'shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] ' +
  'hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)] ' +
  'border border-gray-100/80 dark:border-gray-700 hover:-translate-y-0.5 transition-all duration-300';

// ─── 1. Ảnh + nút yêu thích ───
function CardImage({
  tour,
  priority,
  isFavorite,
  onFavoriteToggle,
}: {
  tour: Tour;
  priority: boolean;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="relative w-full aspect-4/3 overflow-hidden rounded-t-2xl block"
    >
      <Image
        src={tour.coverImage || '/images/placeholder-tour.jpg'}
        alt={tour.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
      <button
        type="button"
        className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full shadow-sm cursor-pointer transition-colors border-0"
        style={{
          backgroundColor: isFavorite
            ? 'rgba(229, 231, 235, 0.95)'
            : 'rgba(224, 242, 254, 0.95)',
        }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.preventDefault();
          onFavoriteToggle();
        }}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
          style={isFavorite ? { fontVariationSettings: '"FILL" 1' } : undefined}
          aria-hidden
        >
          favorite
        </span>
      </button>
    </Link>
  );
}

// ─── 2. Title + rating ───
function CardHeader({
  name,
  href,
  rating,
}: {
  name: string;
  href: string;
  rating: number;
}) {
  return (
    <div className="flex justify-between items-start gap-4 mb-2 min-w-0">
      <Link href={href} className="min-w-0 flex-1">
        <h3 className="text-[#111518] dark:text-white text-lg font-bold leading-snug line-clamp-2 group-hover:text-(--color-primary) transition-colors">
          {name}
        </h3>
      </Link>
      <div className="flex items-center gap-1.5 shrink-0 text-[#111518] dark:text-white">
        <span
          className="material-symbols-outlined text-amber-500 fill-amber-500 text-[18px]"
          aria-hidden
        >
          star
        </span>
        <span className="text-sm font-bold tabular-nums">{formatRating(rating)}</span>
      </div>
    </div>
  );
}

// ─── 3. Duration + location ───
function CardMeta({
  durationDays,
  location,
}: {
  durationDays: number;
  location?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
      <span className="material-symbols-outlined text-[16px] shrink-0">schedule</span>
      <span>{formatDuration(durationDays)}</span>
      {location && (
        <>
          <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
          <span className="truncate">{location}</span>
        </>
      )}
    </div>
  );
}

// ─── 4. Mô tả ngắn ───
function CardSummary({ text }: { text: string }) {
  return (
    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-5 grow leading-relaxed">
      {text}
    </p>
  );
}

// ─── 5. Giá + nút Book Now (có padding riêng, không dính mép) ───
function CardFooter({
  priceSymbol,
  priceNumber,
  bookHref,
}: {
  priceSymbol: string;
  priceNumber: string;
  bookHref: string;
}) {
  return (
    <div
      className="mt-auto border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 min-w-0"
      style={{
        marginLeft: -CARD_PADDING_PX,
        marginRight: -CARD_PADDING_PX,
        marginBottom: -CARD_PADDING_PX,
        padding: CARD_PADDING_PX,
      }}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
          Starting from
        </span>
        <span className="text-(--color-primary) tabular-nums">
          <span className="text-base font-semibold align-top">{priceSymbol}</span>
          <span className="text-xl font-bold">{priceNumber}</span>
        </span>
      </div>
      <BookNowButton href={bookHref} />
    </div>
  );
}

// ─── Nút Book Now (style tập trung 1 chỗ) ───
const bookNowWrapperClass =
  'shrink-0 min-h-11 inline-flex rounded-full shadow-sm hover:shadow-md w-[90px] ' +
  'bg-(--color-primary) hover:bg-[#0d7bc7] active:scale-[0.98] overflow-hidden ' +
  'focus-within:ring-2 focus-within:ring-(--color-primary) focus-within:ring-offset-2 transition-all duration-200';

const bookNowLinkClass =
  'inline-flex items-center justify-center min-h-11 py-2.5 px-5 w-[90px] ' +
  'text-white text-sm font-semibold tracking-wide no-underline focus:outline-none rounded-full whitespace-nowrap';

function BookNowButton({ href }: { href: string }) {
  return (
    <span className={bookNowWrapperClass}>
      <Link href={href} className={bookNowLinkClass}>
        Book Now
      </Link>
    </span>
  );
}
