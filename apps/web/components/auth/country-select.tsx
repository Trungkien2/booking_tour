'use client';

import { useState, useEffect } from 'react';
import { getCountries, type Country } from '@/lib/api/countries';
import { cn } from '@/lib/utils';

interface CountrySelectProps {
  value?: string;
  onChange: (country: { code: string; dialCode: string }) => void;
  className?: string;
}

/**
 * Country dropdown selector that fetches countries from API.
 * Displays country flag and name, returns code and dialCode on selection.
 */
export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries');
        // Fallback to common countries if API fails
        setCountries([
          { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
          { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
          { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
          { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
          { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
          { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
          { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
          { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find((c) => c.code === e.target.value);
    if (selected) {
      onChange({ code: selected.code, dialCode: selected.dialCode });
    }
  };

  if (isLoading) {
    return (
      <select
        disabled
        className={cn(
          'h-12 w-full rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-gray-100 dark:bg-[#22303c] text-[#617989] px-3',
          className
        )}
      >
        <option>Loading countries...</option>
      </select>
    );
  }

  return (
    <div>
      <select
        value={value || ''}
        onChange={handleChange}
        className={cn(
          'h-12 w-full rounded-lg border border-[#dbe1e6] dark:border-[#22303c] bg-white dark:bg-[#1a2630] text-[#111518] dark:text-white px-3 focus:outline-none focus:ring-2 focus:ring-[#1392ec]/50 focus:border-[#1392ec]',
          className
        )}
      >
        <option value="">Select a country</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
          Using offline country list
        </p>
      )}
    </div>
  );
}
