"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { guestRegister } from "@/lib/api/auth";
import { useAuth } from "@/lib/hooks/use-auth";

const guestSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  fullName: z.string().min(1, "Full name is required").max(100),
});

type GuestFormData = z.infer<typeof guestSchema>;

interface GuestCheckoutFormProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export function GuestCheckoutForm({
  onAuthenticated,
  onCancel,
}: GuestCheckoutFormProps) {
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const onSubmit = async (data: GuestFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await guestRegister(data.email, data.fullName);
      setAuth(result.user, result.accessToken, result.refreshToken);
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Continue as Guest
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your details to proceed with checkout. No password needed.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
          {error.includes("already exists") && (
            <Link
              href="/login?redirect=/cart"
              className="mt-1 inline-block text-sm font-medium text-red-700 underline hover:text-red-800"
            >
              Log in to your account
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="guest-fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="guest-fullName"
            type="text"
            {...register("fullName")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="guest-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="guest-email"
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Processing..." : "Continue as Guest"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login?redirect=/cart"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
