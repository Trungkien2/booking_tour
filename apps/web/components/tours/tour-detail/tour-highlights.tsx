import { Highlight } from "@/lib/types/tour";

interface TourHighlightsProps {
  highlights: Highlight[];
}

export function TourHighlights({ highlights }: TourHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Experience Highlights
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {highlights.map((highlight, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3"
          >
            <span className="material-symbols-outlined text-xl text-blue-500">
              {highlight.icon}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {highlight.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
