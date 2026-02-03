export interface Tour {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location?: string;
  ratingAverage: number;
  reviewCount?: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  featured?: boolean;
  nextAvailableDate?: string;
}

export interface TourFilters {
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  priceMin?: number;
  priceMax?: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  location?: string;
  duration?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ToursResponse {
  tours: Tour[];
  pagination: Pagination;
}

export interface TourCardProps {
  tour: Tour;
  priority?: boolean;
}

export interface Suggestion {
  type: 'tour' | 'destination';
  id?: number;
  name: string;
  slug?: string;
}
