"use client";

import { Info, ArrowRight, Loader2 } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  serviceFee: number;
  total: number;
  onCheckout: () => void;
  loading: boolean;
}

export function CartSummary({
  subtotal,
  serviceFee,
  total,
  onCheckout,
  loading,
}: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
        <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          Price Summary
        </h3>
        <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
            <span>Service Fee</span>
            <span className="font-medium">${serviceFee.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-900 dark:text-white font-bold text-lg">
            Total
          </span>
          <span className="text-gray-900 dark:text-white font-black text-2xl tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Creating bookings...
            </>
          ) : (
            <>
              Proceed to Checkout
              <ArrowRight className="size-5" />
            </>
          )}
        </button>
        <p className="text-center text-gray-400 text-xs mt-4">
          Secure payment powered by Stripe. No hidden fees.
        </p>
      </div>

      {/* Free Cancellation Info */}
      <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20 flex gap-3">
        <Info className="size-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-900 dark:text-gray-200 block mb-1">
            Free Cancellation
          </strong>
          Cancel up to 24 hours in advance for a full refund on most tours.
        </p>
      </div>
    </div>
  );
}
