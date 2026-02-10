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
  difficulty?: "easy" | "moderate" | "challenging";
  featured?: boolean;
  nextAvailableDate?: string;
}

export interface TourFilters {
  search?: string;
  page?: number;
  limit?: number;
  sort?: "popular" | "newest" | "price_asc" | "price_desc" | "rating";
  priceMin?: number;
  priceMax?: number;
  difficulty?: "easy" | "moderate" | "challenging";
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
  type: "tour" | "destination";
  id?: number;
  name: string;
  slug?: string;
}

// --- Tour Detail Types ---

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Highlight {
  icon: string;
  label: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface MeetingPoint {
  name: string;
  address: string;
  coordinates: Coordinates;
  instructions: string;
}

export interface TourDetail {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  images: string[];
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location?: string;
  coordinates?: Coordinates;
  ratingAverage: number;
  reviewCount: number;
  difficulty: "EASY" | "MODERATE" | "CHALLENGING";
  maxGroupSize: number;
  highlights: Highlight[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  meetingPoint?: MeetingPoint;
  cancellationPolicy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TourSchedule {
  id: number;
  tourId: number;
  startDate: string;
  maxCapacity: number;
  currentCapacity: number;
  availableSpots: number;
  status: "OPEN" | "SOLD_OUT" | "CLOSED" | "COMPLETED";
  priceAdult: number;
  priceChild: number;
}

export interface ReviewUser {
  id: number;
  fullName: string;
  avatar?: string;
}

export interface Review {
  id: number;
  user: ReviewUser;
  rating: number;
  comment?: string;
  createdAt: string;
  helpful: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
}

export interface ReviewListResponse {
  summary: ReviewSummary;
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export interface AvailabilityResponse {
  available: boolean;
  scheduleId: number;
  requestedSpots: number;
  availableSpots: number;
  message?: string;
  priceBreakdown?: {
    adults: { count: number; unitPrice: number; total: number };
    children: { count: number; unitPrice: number; total: number };
    subtotal: number;
    taxes: number;
    total: number;
  };
}

export interface BookingSelection {
  scheduleId: number | null;
  schedule: TourSchedule | null;
  adults: number;
  children: number;
  totalPrice: number;
}
