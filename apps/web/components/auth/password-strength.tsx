'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong';

interface StrengthResult {
  score: number;
  level: StrengthLevel;
  color: string;
  label: string;
  percentage: number;
}

/**
 * Calculates password strength based on various criteria.
 * @param password - The password string to evaluate
 * @returns StrengthResult with score, level, color, label, and percentage
 */
function calculatePasswordStrength(password: string): StrengthResult {
  let score = 0;

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character type checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Determine strength level
  if (score <= 2) {
    return {
      score,
      level: 'weak',
      color: 'bg-red-500',
      label: 'Weak',
      percentage: 33,
    };
  } else if (score <= 4) {
    return {
      score,
      level: 'medium',
      color: 'bg-yellow-500',
      label: 'Medium',
      percentage: 66,
    };
  } else {
    return {
      score,
      level: 'strong',
      color: 'bg-green-500',
      label: 'Strong',
      percentage: 100,
    };
  }
}

/**
 * Displays password strength indicator with progress bar and requirements checklist.
 */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const requirements = [
    {
      met: password.length >= 8,
      label: 'At least 8 characters',
    },
    {
      met: /[A-Z]/.test(password),
      label: 'One uppercase letter',
    },
    {
      met: /[a-z]/.test(password),
      label: 'One lowercase letter',
    },
    {
      met: /[0-9]/.test(password),
      label: 'One number',
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', strength.color)}
          style={{ width: `${strength.percentage}%` }}
        />
      </div>

      {/* Strength Label */}
      <p
        className={cn(
          'text-sm font-medium',
          strength.level === 'weak' && 'text-red-500',
          strength.level === 'medium' && 'text-yellow-600',
          strength.level === 'strong' && 'text-green-500'
        )}
      >
        Password Strength: {strength.label}
      </p>

      {/* Requirements Checklist */}
      <ul className="text-xs text-[#617989] dark:text-gray-400 space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={cn(req.met && 'text-green-500 dark:text-green-400')}
          >
            {req.met ? '✓' : '○'} {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
