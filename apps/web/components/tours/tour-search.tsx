'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Compass, X, Loader2 } from 'lucide-react';
import { Suggestion } from '@/lib/types/tour';
import { getSearchSuggestions } from '@/lib/api/tours';

interface TourSearchProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export function TourSearch({
  initialValue = '',
  placeholder = 'Search tours or destinations...',
  className = '',
}: TourSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Debounced fetch suggestions
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getSearchSuggestions(trimmedQuery);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }
      params.delete('page'); // Reset to page 1
      router.push(`/?${params.toString()}`);
      setIsOpen(false);
    },
    [router, searchParams],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      if (suggestion.type === 'tour' && suggestion.slug) {
        router.push(`/tours/${suggestion.slug}`);
      } else if (suggestion.type === 'destination') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('location', suggestion.name);
        params.delete('page');
        router.push(`/?${params.toString()}`);
      }
      setQuery(suggestion.name);
      setIsOpen(false);
    },
    [router, searchParams],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSuggestionClick(suggestions[activeIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="h-12 w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          aria-label="Search tours"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {isLoading ? (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
        ) : query ? (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id || suggestion.name}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === activeIndex ? 'bg-emerald-50' : 'hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={index === activeIndex}
            >
              {suggestion.type === 'tour' ? (
                <Compass className="h-5 w-5 flex-shrink-0 text-emerald-600" />
              ) : (
                <MapPin className="h-5 w-5 flex-shrink-0 text-blue-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">
                  {suggestion.name}
                </p>
                <p className="text-sm text-gray-500">
                  {suggestion.type === 'tour' ? 'Tour' : 'Destination'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
