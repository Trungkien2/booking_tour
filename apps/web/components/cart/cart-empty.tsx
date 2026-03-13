"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
        <ShoppingCart className="size-10 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        Looks like you haven&apos;t added any tours yet. Browse our destinations
        and find your next adventure!
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
      >
        Browse Tours
      </Link>
    </div>
  );
}
