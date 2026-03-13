"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuth } from "@/lib/hooks/use-auth";
import { createBooking } from "@/lib/api/bookings";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { CartEmpty } from "./cart-empty";

export function CartContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { items, removeItem, clearCart, getSubtotal, getServiceFee, getTotal } =
    useCart();
  const { accessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  const handleCheckout = async () => {
    if (!isAuthenticated() || !accessToken) {
      router.push("/login?redirect=/cart");
      return;
    }

    setLoading(true);
    setError(null);

    const createdBookingIds: number[] = [];
    const failedItems: string[] = [];
    const succeededItemIds: string[] = [];

    for (const item of items) {
      try {
        const result = await createBooking(
          {
            scheduleId: item.scheduleId,
            travelers: item.travelers,
            note: `Cart checkout - ${item.tourName}`,
          },
          accessToken,
        );
        createdBookingIds.push(result.booking.id);
        succeededItemIds.push(item.id);
      } catch (err) {
        failedItems.push(
          `${item.tourName}: ${err instanceof Error ? err.message : "Failed"}`,
        );
      }
    }

    setLoading(false);

    if (failedItems.length > 0 && createdBookingIds.length === 0) {
      setError(
        `All bookings failed:\n${failedItems.join("\n")}`,
      );
      return;
    }

    if (failedItems.length > 0) {
      setError(
        `Some bookings failed:\n${failedItems.join("\n")}\n\nProceeding with successful bookings.`,
      );
    }

    // Only remove successful items from cart (keep failed ones for retry)
    for (const itemId of succeededItemIds) {
      removeItem(itemId);
    }

    if (createdBookingIds.length > 0) {
      // Store remaining booking IDs for sequential payment
      if (createdBookingIds.length > 1) {
        sessionStorage.setItem(
          "pendingBookingIds",
          JSON.stringify(createdBookingIds.slice(1)),
        );
      }
      router.push(`/bookings/${createdBookingIds[0]}/pay`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onRemove={removeItem} />
        ))}

        <Link
          href="/tours"
          className="flex items-center gap-2 text-primary font-semibold hover:underline mt-2"
        >
          <PlusCircle className="size-5" />
          Add another tour
        </Link>
      </div>

      {/* Price Summary */}
      <div>
        <CartSummary
          subtotal={getSubtotal()}
          serviceFee={getServiceFee()}
          total={getTotal()}
          onCheckout={handleCheckout}
          loading={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="lg:col-span-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
}
