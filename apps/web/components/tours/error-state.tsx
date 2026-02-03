'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
  className = '',
}: ErrorStateProps) {
  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || 'An unexpected error occurred. Please try again.';

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>

      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>

      <p className="mb-6 max-w-md text-gray-600">{errorMessage}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </button>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>If this problem persists, please contact support.</p>
      </div>
    </div>
  );
}
