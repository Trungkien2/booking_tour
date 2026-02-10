export default function TourDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 animate-pulse">
        {/* Breadcrumbs skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Title skeleton */}
        <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="flex gap-3 mb-6">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Gallery skeleton */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[300px] sm:h-[400px] mb-8">
          <div className="col-span-4 sm:col-span-2 row-span-2 bg-gray-200 dark:bg-gray-700" />
          <div className="hidden sm:block bg-gray-200 dark:bg-gray-700" />
          <div className="hidden sm:block bg-gray-200 dark:bg-gray-700" />
          <div className="hidden sm:block bg-gray-200 dark:bg-gray-700" />
          <div className="hidden sm:block bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Content Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Highlights */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm space-y-3">
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* Booking card skeleton */}
          <div className="hidden lg:block">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg space-y-4">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
                  />
                ))}
              </div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
