"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

const priceOptions = [
  { label: "All Prices", value: "" },
  { label: "Under $500", value: "0-500" },
  { label: "$500 - $1,000", value: "500-1000" },
  { label: "$1,000 - $2,000", value: "1000-2000" },
  { label: "Over $2,000", value: "2000-" },
];

const difficultyOptions = [
  { label: "All Levels", value: "" },
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Challenging", value: "challenging" },
];

const durationOptions = [
  { label: "Any Duration", value: "" },
  { label: "1-3 Days", value: "1-3" },
  { label: "4-7 Days", value: "4-7" },
  { label: "8+ Days", value: "8+" },
];

function FilterPill({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="relative flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 min-w-[100px] hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer shadow-sm">
      <span className="text-[#111518] dark:text-gray-200 text-sm font-medium pointer-events-none whitespace-nowrap">
        {label}
      </span>
      <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[18px] pointer-events-none shrink-0">
        expand_more
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
        aria-label={label}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value || "any"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TourFiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      startTransition(() => router.push(`/?${params.toString()}`));
    },
    [router, searchParams],
  );

  const handlePriceChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        const [min, max] = value.split("-");
        if (min) params.set("priceMin", min);
        else params.delete("priceMin");
        if (max) params.set("priceMax", max);
        else params.delete("priceMax");
      } else {
        params.delete("priceMin");
        params.delete("priceMax");
      }
      params.delete("page");
      startTransition(() => router.push(`/?${params.toString()}`));
    },
    [router, searchParams],
  );

  const currentSort = searchParams.get("sort") || "popular";
  const currentDifficulty = searchParams.get("difficulty") || "";
  const currentDuration = searchParams.get("duration") || "";
  const currentPriceMin = searchParams.get("priceMin");
  const currentPriceMax = searchParams.get("priceMax");
  const currentPrice =
    currentPriceMin || currentPriceMax
      ? `${currentPriceMin || ""}-${currentPriceMax || ""}`
      : "";

  return (
    <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      <FilterPill
        label="Price"
        value={currentPrice}
        options={priceOptions.filter((o) => o.value !== "")}
        onChange={handlePriceChange}
        disabled={isPending}
      />
      <FilterPill
        label="Duration"
        value={currentDuration}
        options={durationOptions.filter((o) => o.value !== "")}
        onChange={(v) => updateFilter("duration", v)}
        disabled={isPending}
      />
      <FilterPill
        label="Difficulty"
        value={currentDifficulty}
        options={difficultyOptions.filter((o) => o.value !== "")}
        onChange={(v) => updateFilter("difficulty", v)}
        disabled={isPending}
      />
      <FilterPill
        label="Rating"
        value={currentSort}
        options={sortOptions}
        onChange={(v) => updateFilter("sort", v)}
        disabled={isPending}
      />
    </div>
  );
}
