"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Call API to authenticate
      const response = await login(data);

      // Check if user has ADMIN role
      if (response.user.role !== "ADMIN") {
        setApiError("Access denied. Admin privileges required.");
        setIsLoading(false);
        return;
      }

      // Store tokens and user info in auth state
      setAuth(
        {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
        },
        response.accessToken,
        response.refreshToken,
      );

      // Redirect to admin dashboard
      router.push("/admin/tours");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="admin-email"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined text-xl">mail</span>
          </span>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@travelco.com"
            {...register("email")}
            className="h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">error</span>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined text-xl">lock</span>
          </span>
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className="h-12 pl-12 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">error</span>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* API Error Alert */}
      {apiError && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">
              warning
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                Authentication Failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {apiError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">login</span>
            Sign In to Admin Panel
          </span>
        )}
      </Button>

      {/* Security Notice */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-base">shield</span>
          <p>
            This is a secure area. All login attempts are monitored and logged.
            Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </form>
  );
}
