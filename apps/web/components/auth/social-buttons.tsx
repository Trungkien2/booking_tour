'use client';

import { useState } from 'react';

export function SocialButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    // TODO: Implement Google login logic
    setIsGoogleLoading(true);
    try {
      // Initiate Google OAuth flow
      console.log('Google login clicked');
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    // TODO: Implement Apple login logic
    setIsAppleLoading(true);
    try {
      // Initiate Apple OAuth flow
      console.log('Apple login clicked');
    } catch (error) {
      console.error('Apple login failed:', error);
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] p-3 hover:bg-gray-50 dark:hover:bg-[#22303c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img
          alt="Google"
          className="w-5 h-5"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxAAMuWOXhMAW1-pqcF_TJur_quGyzzBEU-ufUW4t44RmAC1nvTQWCQBjz-o5blEmqJISr0Jp9LvH3XjfsZp0kpQ08OsPb3Q61dH9mByb7ulmbjsikbCdt1w0gQXW5Dfyg8qJKn5voBfPys-jSVodQaVqaKgknqP32AHraCQghcpVfT4lXv_nF2WK4g1are0SfUXwTNZ1HHXTZxSUF_vHFKaSzYWV4fEJ5ouNtEO0_QNHN2ChdhN3TojMsoqjVE0eHsbSbTby3T2Ve"
        />
        <span className="text-[#111518] dark:text-white text-sm font-bold">
          {isGoogleLoading ? 'Loading...' : 'Continue with Google'}
        </span>
      </button>

      <button
        type="button"
        onClick={handleAppleLogin}
        disabled={isAppleLoading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] p-3 hover:bg-gray-50 dark:hover:bg-[#22303c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[#111518] dark:text-white text-[22px]">
          ios
        </span>
        <span className="text-[#111518] dark:text-white text-sm font-bold">
          {isAppleLoading ? 'Loading...' : 'Continue with Apple'}
        </span>
      </button>
    </div>
  );
}
