import {
  Tour,
  TourFilters,
  ToursResponse,
  Suggestion,
  TourDetail,
  TourSchedule,
  ReviewListResponse,
  AvailabilityResponse,
} from "../types/tour";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Fetch paginated tours with filters.
 * Uses Next.js ISR with 5-minute revalidation.
 */
export async function getTours(
  filters: TourFilters = {},
): Promise<ToursResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const url = `${API_URL}/tours?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch tours: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || "Failed to fetch tours");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
}

/**
 * Fetch featured tours for homepage.
 */
export async function getFeaturedTours(limit: number = 4): Promise<Tour[]> {
  try {
    const response = await fetch(`${API_URL}/tours/featured?limit=${limit}`, {
      next: { revalidate: 600 }, // ISR: revalidate every 10 minutes
    });

    if (!response.ok) {
      throw new Error("Failed to fetch featured tours");
    }

    const result = await response.json();
    return result.data.tours;
  } catch (error) {
    console.error("Error fetching featured tours:", error);
    return [];
  }
}

/**
 * Fetch search suggestions.
 * Client-side only (no ISR).
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5,
): Promise<Suggestion[]> {
  if (query.length < 2) return [];

  try {
    const response = await fetch(
      `${API_URL}/tours/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        cache: "no-store", // Always fresh for suggestions
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const result = await response.json();
    return result.data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

/**
 * Get tour detail by slug.
 */
export async function getTourBySlug(slug: string): Promise<TourDetail> {
  const response = await fetch(`${API_URL}/tours/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("TOUR_NOT_FOUND");
    }
    throw new Error("Failed to fetch tour");
  }

  return response.json();
}

/**
 * Get tour schedules.
 */
export async function getTourSchedules(
  tourId: number,
  from?: string,
  to?: string,
): Promise<{ schedules: TourSchedule[] }> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const response = await fetch(
    `${API_URL}/tours/${tourId}/schedules?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }

  return response.json();
}

/**
 * Get tour reviews with pagination.
 */
export async function getTourReviews(
  tourId: number,
  page = 1,
  limit = 5,
  sort: "recent" | "rating_desc" | "rating_asc" = "recent",
): Promise<ReviewListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  const response = await fetch(
    `${API_URL}/tours/${tourId}/reviews?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

/**
 * Check schedule availability.
 */
export async function checkAvailability(
  scheduleId: number,
  adults: number,
  children: number,
): Promise<AvailabilityResponse> {
  const response = await fetch(
    `${API_URL}/tours/schedules/${scheduleId}/check-availability`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adults, children }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to check availability");
  }

  return response.json();
}
