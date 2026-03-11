"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Star, Clock, Loader2 } from "lucide-react";
import {
  getUserFavorites,
  removeFromFavorites,
  type FavoriteItem,
} from "@/lib/api/favorites";
import { getAccessToken } from "@/lib/utils/token";
import { useToast } from "@/components/ui/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function FavoritesTab() {
  const router = useRouter();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = getAccessToken();
        if (!token) return;
        const data = await getUserFavorites(token);
        setFavorites(data);
      } catch {
        toast("Failed to load favorites", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (tourId: number) => {
    // Optimistic update
    setFavorites((prev) => prev.filter((f) => f.tourId !== tourId));
    try {
      const token = getAccessToken();
      if (!token) return;
      await removeFromFavorites(tourId, token);
      toast("Removed from favorites", "success");
    } catch {
      // Revert on error
      const token = getAccessToken();
      if (token) {
        const data = await getUserFavorites(token);
        setFavorites(data);
      }
      toast("Failed to remove from favorites", "error");
    }
  };

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Favorites
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((fav) => (
              <FavoriteCard
                key={fav.id}
                item={fav}
                onRemove={() => handleRemove(fav.tourId)}
                onClick={() => router.push(`/tours/${fav.tour.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoriteCard({
  item,
  onRemove,
  onClick,
}: {
  item: FavoriteItem;
  onRemove: () => void;
  onClick: () => void;
}) {
  const { tour } = item;
  const coverUrl = tour.coverImage
    ? tour.coverImage.startsWith("http")
      ? tour.coverImage
      : `${API_BASE_URL}${tour.coverImage}`
    : null;

  return (
    <div
      className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          title="Remove from favorites"
        >
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        </button>
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
          {tour.name}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
          {tour.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {tour.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {tour.durationDays}d
          </span>
          {tour.ratingAverage > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {tour.ratingAverage.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            ${tour.priceAdult.toFixed(2)}
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
              {" "}
              /person
            </span>
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyFavorites() {
  return (
    <div className="text-center py-12">
      <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        No saved tours yet
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Save tours you love and find them here later!
      </p>
      <a
        href="/tours"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Browse Tours
      </a>
    </div>
  );
}
