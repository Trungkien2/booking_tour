"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  addToFavorites,
  removeFromFavorites,
  checkIsFavorited,
} from "@/lib/api/favorites";

interface FavoriteButtonProps {
  tourId: number;
}

export function FavoriteButton({ tourId }: FavoriteButtonProps) {
  const { accessToken, isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const authed = isAuthenticated();

  useEffect(() => {
    if (authed && accessToken) {
      checkIsFavorited(tourId, accessToken).then(setIsFavorited);
    }
  }, [authed, accessToken, tourId]);

  const handleToggle = async () => {
    if (!authed || !accessToken) {
      return;
    }

    setLoading(true);
    const prev = isFavorited;
    setIsFavorited(!prev);

    try {
      if (prev) {
        await removeFromFavorites(tourId, accessToken);
      } else {
        await addToFavorites(tourId, accessToken);
      }
    } catch {
      setIsFavorited(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        isFavorited
          ? "border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <span
        className="material-symbols-outlined text-base"
        style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
      {isFavorited ? "Saved" : "Save"}
    </button>
  );
}
