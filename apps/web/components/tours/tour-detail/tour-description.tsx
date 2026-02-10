"use client";

import { useState } from "react";

interface TourDescriptionProps {
  description?: string;
}

export function TourDescription({ description }: TourDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  const isLong = description.length > 300;
  const displayText =
    expanded || !isLong ? description : description.slice(0, 300) + "...";

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        About This Tour
      </h2>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
