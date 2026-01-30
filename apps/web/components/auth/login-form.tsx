'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { login } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SocialButtons } from './social-buttons';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

      // Store tokens and user info in auth state
      setAuth(
        {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
        },
        response.accessToken,
        response.refreshToken
      );

      // Redirect to home or previous page (if redirect param exists)
      const redirectTo = searchParams.get('redirect') || '/';
      router.push(redirectTo);
      router.refresh(); // Refresh to update server-side auth state
    } catch (error: unknown) {
      // Handle different error types
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Login Buttons - First */}
      <SocialButtons />

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-[#dbe1e6] dark:bg-[#22303c] flex-1"></div>
        <span className="text-[#617989] dark:text-gray-500 text-sm font-medium whitespace-nowrap">
          Or continue with email
        </span>
        <div className="h-px bg-[#dbe1e6] dark:bg-[#22303c] flex-1"></div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Email or Username Field */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2"
          >
            Email or Username
          </label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            {...register('email')}
            className="h-12 py-3 px-5 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white placeholder:text-[#617989] dark:placeholder:text-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec] transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center pb-2">
            <label
              htmlFor="password"
              className="text-[#111518] dark:text-white text-base font-medium leading-normal"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[#1392ec] text-sm font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className="h-12 py-3 px-5 pr-12 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white placeholder:text-[#617989] dark:placeholder:text-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#617989] hover:text-[#111518] dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-lg bg-[#1392ec] hover:bg-[#1180d4] text-white text-base font-bold tracking-[0.015em] mt-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Footer Sign Up Link */}
      <div className="text-center pt-2">
        <p className="text-[#617989] dark:text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-[#1392ec] font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
