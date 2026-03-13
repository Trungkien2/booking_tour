import { Metadata } from "next";
import { CartContent } from "@/components/cart/cart-content";

export const metadata: Metadata = {
  title: "Your Shopping Cart | TourBooking",
  description: "Review and confirm your selected adventures",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-[1024px] mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-[-0.033em]">
            Your Shopping Cart
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-2">
            Review and confirm your selected adventures
          </p>
        </div>
        <CartContent />
      </div>
    </div>
  );
}
