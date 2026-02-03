/**
 * Format price as currency (USD).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format rating to 1 decimal place.
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Format duration in days.
 */
export function formatDuration(days: number): string {
  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
}

/**
 * Get difficulty badge color classes.
 */
export function getDifficultyColor(difficulty?: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'challenging':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}
