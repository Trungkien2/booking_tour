export default function BookingsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Heading skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="mb-2 h-8 w-40 rounded bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-200" />
      </div>

      {/* Tab bar skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="flex gap-4 border-b border-gray-200 pb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-28 rounded bg-gray-200" />
          ))}
        </div>
      </div>

      {/* Search skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>

      {/* Booking cards skeleton */}
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 rounded bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="flex gap-3">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
              </div>
            </div>
            <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
              <div className="h-9 w-24 rounded bg-gray-200" />
              <div className="h-9 w-20 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
