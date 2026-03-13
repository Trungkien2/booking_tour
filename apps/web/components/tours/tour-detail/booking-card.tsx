"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import {
  TourDetail,
  TourSchedule,
  AvailabilityResponse,
} from "@/lib/types/tour";
import { checkAvailability } from "@/lib/api/tours";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/hooks/use-cart";
import { SchedulePicker } from "./schedule-picker";
import { TravelerSelector } from "./traveler-selector";
import { PriceBreakdown } from "./price-breakdown";

interface BookingCardProps {
  tour: TourDetail;
  initialSchedules: TourSchedule[];
}

export function BookingCard({ tour, initialSchedules }: BookingCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const addItem = useCart((s) => s.addItem);
  const [selectedSchedule, setSelectedSchedule] = useState<TourSchedule | null>(
    null,
  );
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartAdded, setCartAdded] = useState(false);

  const totalTravelers = adults + children;
  const estimatedTotal = adults * tour.priceAdult + children * tour.priceChild;

  const handleCheckAvailability = async () => {
    if (!selectedSchedule) return;

    setLoading(true);
    setError(null);
    try {
      const result = await checkAvailability(
        selectedSchedule.id,
        adults,
        children,
      );
      setAvailability(result);
      if (!result.available) {
        setError(result.message || "Not enough spots available");
      }
    } catch {
      setError("Failed to check availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedSchedule || !availability?.available) return;

    // Store booking intent
    const bookingIntent = {
      tourId: tour.id,
      tourSlug: tour.slug,
      tourName: tour.name,
      scheduleId: selectedSchedule.id,
      startDate: selectedSchedule.startDate,
      adults,
      children,
      priceBreakdown: availability.priceBreakdown,
    };

    sessionStorage.setItem("bookingIntent", JSON.stringify(bookingIntent));

    if (isAuthenticated()) {
      router.push(`/booking/process?schedule=${selectedSchedule.id}`);
    } else {
      router.push(`/login?redirect=/tours/${tour.slug}`);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSchedule || totalTravelers === 0) return;

    const travelers = [
      ...Array.from({ length: adults }, (_, i) => ({
        fullName: `Adult ${i + 1}`,
        ageGroup: "ADULT" as const,
      })),
      ...Array.from({ length: children }, (_, i) => ({
        fullName: `Child ${i + 1}`,
        ageGroup: "CHILD" as const,
      })),
    ];

    const itemTotal = adults * tour.priceAdult + children * tour.priceChild;

    addItem({
      tourId: tour.id,
      tourName: tour.name,
      tourSlug: tour.slug,
      coverImage: tour.coverImage || "",
      scheduleId: selectedSchedule.id,
      startDate: selectedSchedule.startDate,
      travelers,
      pricePerAdult: tour.priceAdult,
      pricePerChild: tour.priceChild,
      itemTotal,
    });

    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 3000);
  };

  const canAddToCart = !!selectedSchedule && totalTravelers > 0;

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block sticky top-4">
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-5">
          {/* Price Display */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${tour.priceAdult.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                / adult
              </span>
            </div>
            {tour.priceChild > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${tour.priceChild.toFixed(2)} / child
              </p>
            )}
          </div>

          {/* Schedule Picker */}
          <SchedulePicker
            schedules={initialSchedules}
            selected={selectedSchedule}
            onSelect={(schedule) => {
              setSelectedSchedule(schedule);
              setAvailability(null);
              setError(null);
              setCartAdded(false);
            }}
          />

          {/* Traveler Selector */}
          {selectedSchedule && (
            <TravelerSelector
              adults={adults}
              childCount={children}
              maxSpots={selectedSchedule.availableSpots}
              onAdultsChange={(v) => {
                setAdults(v);
                setAvailability(null);
              }}
              onChildrenChange={(v) => {
                setChildren(v);
                setAvailability(null);
              }}
            />
          )}

          {/* Price Breakdown */}
          {availability?.available && availability.priceBreakdown && (
            <PriceBreakdown breakdown={availability.priceBreakdown} />
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {!availability?.available ? (
            <button
              onClick={handleCheckAvailability}
              disabled={!selectedSchedule || totalTravelers === 0 || loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
          ) : (
            <button
              onClick={handleBookNow}
              className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Book Now - ${availability.priceBreakdown!.total.toFixed(2)}
            </button>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {cartAdded ? (
              <>
                <Check className="size-4 text-green-600" />
                <span className="text-green-600">Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" />
                Add to Cart
              </>
            )}
          </button>

          {/* Cart Added Toast */}
          {cartAdded && (
            <p className="text-center text-xs text-green-600 dark:text-green-400">
              Item added to your cart.{" "}
              <a href="/cart" className="underline font-medium">
                View Cart
              </a>
            </p>
          )}

          {/* Estimated Total */}
          {!availability && selectedSchedule && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Estimated total: ${estimatedTotal.toFixed(2)} (before taxes)
            </p>
          )}

          {/* Cancellation Policy */}
          {tour.cancellationPolicy && (
            <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
              {tour.cancellationPolicy}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${tour.priceAdult.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                / adult
              </span>
            </div>
            {selectedSchedule && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(selectedSchedule.startDate).toLocaleDateString()} ·{" "}
                {totalTravelers} travelers
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedSchedule && (
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="rounded-lg border-2 border-gray-200 dark:border-gray-600 p-2.5 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary disabled:opacity-50 transition-colors"
                aria-label="Add to cart"
              >
                {cartAdded ? (
                  <Check className="size-5 text-green-600" />
                ) : (
                  <ShoppingCart className="size-5" />
                )}
              </button>
            )}
            <button
              onClick={selectedSchedule ? handleCheckAvailability : undefined}
              disabled={!selectedSchedule || loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {selectedSchedule ? "Check Availability" : "Select a Date"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
