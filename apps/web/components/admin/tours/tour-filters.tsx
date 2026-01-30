"use client";

import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface TourFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
}

export function TourFilters({
  onSearchChange,
  onStatusChange,
}: TourFiltersProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="w-full sm:w-1/3">
        <Input
          placeholder="Search tours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        {["", "PUBLISHED", "DRAFT", "ARCHIVED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              onStatusChange(s);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              status === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {s ? s.charAt(0) + s.slice(1).toLowerCase() : "All Status"}
          </button>
        ))}
      </div>
    </div>
  );
}
