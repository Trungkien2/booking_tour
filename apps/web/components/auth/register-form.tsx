'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';

import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { register as registerUser, checkEmail } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialButtons } from './social-buttons';
import { PasswordStrength } from './password-strength';
import { CountrySelect } from './country-select';

type EmailStatus = 'idle' | 'checking' | 'available' | 'taken';

/**
 * Registration form component with email availability check,
 * password strength indicator, and country/phone selection.
 */
export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    dialCode: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const password = watch('password');
  const email = watch('email');

  // Debounced email availability check (500ms)
  const checkEmailAvailability = useDebouncedCallback(
    async (emailValue: string) => {
      // Don't check if email is invalid or empty
      if (!emailValue || errors.email) {
        setEmailStatus('idle');
        return;
      }

      // Basic email format check before API call
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        setEmailStatus('idle');
        return;
      }

      setEmailStatus('checking');
      try {
        const result = await checkEmail(emailValue);
        setEmailStatus(result.available ? 'available' : 'taken');
      } catch {
        // On error, don't block the user - just reset status
        setEmailStatus('idle');
      }
    },
    500
  );

  // Check email when it changes
  useEffect(() => {
    if (email) {
      checkEmailAvailability(email);
    } else {
      setEmailStatus('idle');
    }
  }, [email, checkEmailAvailability]);

  // Handle country selection
  const handleCountryChange = useCallback(
    (country: { code: string; dialCode: string }) => {
      setSelectedCountry(country);
      setValue('country', country.code);
    },
    [setValue]
  );

  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    // Prevent submission if email is taken
    if (emailStatus === 'taken') {
      setApiError('This email is already registered. Please use a different email.');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Format phone with country dial code if both are present
      const phone =
        data.phone && selectedCountry
          ? `${selectedCountry.dialCode}${data.phone}`
          : data.phone || undefined;

      await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone,
        country: data.country || undefined,
      });

      // Success - redirect to login with success indicator
      router.push('/login?registered=true');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email status indicator icon
  const renderEmailStatusIcon = () => {
    switch (emailStatus) {
      case 'checking':
        return (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617989]">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        );
      case 'available':
        return (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">
            ✓
          </span>
        );
      case 'taken':
        return (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">
            ✗
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Login Buttons */}
      <SocialButtons />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px bg-[#dbe1e6] dark:bg-[#22303c] flex-1" />
        <span className="text-[#617989] dark:text-gray-500 text-sm font-medium">
          OR CONTINUE WITH EMAIL
        </span>
        <div className="h-px bg-[#dbe1e6] dark:bg-[#22303c] flex-1" />
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Full Name */}
        <label className="flex flex-col">
          <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
            Full Name <span className="text-red-500">*</span>
          </p>
          <Input
            type="text"
            placeholder="e.g. Jane Doe"
            {...register('fullName')}
            className="h-12 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec]"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
            Email Address <span className="text-red-500">*</span>
          </p>
          <div className="relative">
            <Input
              type="email"
              placeholder="e.g. jane@example.com"
              {...register('email')}
              className="h-12 pr-10 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec]"
            />
            {renderEmailStatusIcon()}
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          {emailStatus === 'taken' && !errors.email && (
            <p className="mt-1 text-sm text-red-600">
              This email is already registered.{' '}
              <Link href="/login" className="text-[#1392ec] hover:underline">
                Log in instead
              </Link>
            </p>
          )}
        </label>

        {/* Phone & Country Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country */}
          <label className="flex flex-col">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Country
            </p>
            <CountrySelect
              value={selectedCountry?.code}
              onChange={handleCountryChange}
            />
          </label>

          {/* Phone */}
          <label className="flex flex-col">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Phone Number
            </p>
            <div className="flex">
              <span className="flex items-center px-3 bg-gray-100 dark:bg-[#22303c] border border-r-0 border-[#dbe1e6] dark:border-[#22303c] rounded-l-lg text-sm text-[#617989] dark:text-gray-400 min-w-[60px] justify-center">
                {selectedCountry?.dialCode || '+1'}
              </span>
              <Input
                type="tel"
                placeholder="5550000000"
                {...register('phone')}
                className="h-12 rounded-l-none rounded-r-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec]"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </label>
        </div>

        {/* Password */}
        <label className="flex flex-col">
          <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
            Password <span className="text-red-500">*</span>
          </p>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="h-12 pr-12 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617989] hover:text-[#111518] dark:hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          {/* Password Strength Indicator */}
          {password && <PasswordStrength password={password} />}
        </label>

        {/* Confirm Password */}
        <label className="flex flex-col">
          <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
            Confirm Password <span className="text-red-500">*</span>
          </p>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="h-12 pr-12 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617989] hover:text-[#111518] dark:hover:text-white transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </label>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeTerms"
            {...register('agreeTerms')}
            className="mt-1"
          />
          <label
            htmlFor="agreeTerms"
            className="text-sm text-[#617989] dark:text-gray-400 cursor-pointer"
          >
            By creating an account, I agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-[#1392ec] hover:underline"
            >
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-[#1392ec] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-sm text-red-600 -mt-3">
            {errors.agreeTerms.message}
          </p>
        )}

        {/* API Error Display */}
        {apiError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#1392ec] hover:bg-blue-600 text-white text-base font-bold mt-2 rounded-lg transition-colors"
          disabled={isLoading || !isValid || emailStatus === 'taken'}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-[#617989] dark:text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1392ec] font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
