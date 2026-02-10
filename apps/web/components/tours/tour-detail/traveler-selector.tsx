"use client";

interface TravelerSelectorProps {
  adults: number;
  childCount: number;
  maxSpots: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
}

export function TravelerSelector({
  adults,
  childCount,
  maxSpots,
  onAdultsChange,
  onChildrenChange,
}: TravelerSelectorProps) {
  const total = adults + childCount;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Travelers
      </label>
      <div className="space-y-3">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Adults
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Age 13+</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAdultsChange(Math.max(1, adults - 1))}
              disabled={adults <= 1}
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                remove
              </span>
            </button>
            <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">
              {adults}
            </span>
            <button
              onClick={() =>
                onAdultsChange(Math.min(maxSpots - childCount, adults + 1))
              }
              disabled={total >= maxSpots}
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Children
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Age 2-12</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChildrenChange(Math.max(0, childCount - 1))}
              disabled={childCount <= 0}
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                remove
              </span>
            </button>
            <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">
              {childCount}
            </span>
            <button
              onClick={() =>
                onChildrenChange(Math.min(maxSpots - adults, childCount + 1))
              }
              disabled={total >= maxSpots}
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>
        </div>

        {total >= maxSpots && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Maximum {maxSpots} travelers for this date
          </p>
        )}
      </div>
    </div>
  );
}
