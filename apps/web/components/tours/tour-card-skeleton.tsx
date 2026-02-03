export function TourCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700" />

      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow p-4 md:p-5">
        {/* Title & Rating */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>

        {/* Summary */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

interface TourGridSkeletonProps {
  count?: number;
}

export function TourGridSkeleton({ count = 8 }: TourGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <TourCardSkeleton key={index} />
      ))}
    </div>
  );
}
