interface TourIncludedProps {
  included: string[];
  notIncluded: string[];
}

export function TourIncluded({ included, notIncluded }: TourIncludedProps) {
  if (
    (!included || included.length === 0) &&
    (!notIncluded || notIncluded.length === 0)
  ) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        What&apos;s Included
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {included && included.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 uppercase tracking-wide">
              Included
            </h3>
            <ul className="space-y-2">
              {included.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-green-500 text-base mt-0.5">
                    check_circle
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {notIncluded && notIncluded.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">
              Not Included
            </h3>
            <ul className="space-y-2">
              {notIncluded.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-red-500 text-base mt-0.5">
                    cancel
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
