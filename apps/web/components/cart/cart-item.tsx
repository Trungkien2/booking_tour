"use client";

import Image from "next/image";
import { Calendar, Users, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/hooks/use-cart";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  const adultCount = item.travelers.filter(
    (t) => t.ageGroup === "ADULT",
  ).length;
  const childCount = item.travelers.filter(
    (t) => t.ageGroup === "CHILD",
  ).length;
  const travelerLabel = [
    adultCount > 0 ? `${adultCount} Adult${adultCount > 1 ? "s" : ""}` : null,
    childCount > 0 ? `${childCount} Child${childCount > 1 ? "ren" : ""}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const pricePerPerson =
    adultCount > 0 ? item.pricePerAdult : item.pricePerChild;

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
      {/* Tour Image */}
      <div className="relative h-32 w-full md:w-48 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={item.tourName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
              {item.tourName}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {new Date(item.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
              <Users className="size-3.5" />
              {travelerLabel}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Remove from cart"
          >
            <Trash2 className="size-5" />
          </button>
        </div>
        <div className="flex justify-between items-end mt-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            ${pricePerPerson.toFixed(2)} / person
          </p>
          <p className="text-gray-900 dark:text-white text-xl font-bold">
            ${item.itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
