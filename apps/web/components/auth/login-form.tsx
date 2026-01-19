'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { login } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SocialButtons } from './social-buttons';

export function LoginForm() {
  const router = useRouter();
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
    // TODO: Implement login submission logic
    setIsLoading(true);
    setApiError(null);

    try {
      // Call API
      const response = await login(data);

      // Store tokens
      // TODO: Implement token storage

      // Redirect to home or previous page
      router.push('/');
    } catch (error: any) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Login Buttons - First */}
      <SocialButtons />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px bg-[#dbe1e6] dark:bg-[#22303c] flex-1"></div>
        <span className="text-[#617989] dark:text-gray-500 text-sm font-medium">
          Or continue with email
        </span>
        <div className="h-px bg-[#dbe1e6] dark:bg-[#22303c] flex-1"></div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Email or Username Field */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
            Email or Username
          </p>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            {...register('email')}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1392ec]/50 border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] focus:border-[#1392ec] h-12 placeholder:text-[#617989] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </label>

        {/* Password Field */}
        <label className="flex flex-col min-w-40 flex-1">
          <div className="flex justify-between items-center pb-2">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal">
              Password
            </p>
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
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1392ec]/50 border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] focus:border-[#1392ec] h-12 placeholder:text-[#617989] dark:placeholder:text-gray-500 p-[15px] pr-12 text-base font-normal leading-normal transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617989] hover:text-[#111518] dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </label>

        {/* API Error */}
        {apiError && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#1392ec] hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] mt-2 transition-colors shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Footer Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-[#617989] dark:text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-[#1392ec] font-bold hover:underline ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
