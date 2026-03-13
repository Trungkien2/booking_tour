const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface TourSchedule {
  id: number;
  startDate: string;
  maxCapacity: number;
  currentCapacity: number;
  status: "OPEN" | "SOLD_OUT" | "CLOSED" | "COMPLETED";
}

export interface Tour {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  ratingAverage: number;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  schedules?: TourSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface TourListResponse {
  data: Tour[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TourStatistics {
  total: number;
  active: number;
  drafts: number;
  fullyBooked: number;
}

export interface TourQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * Fetch paginated list of tours with filters.
 */
export async function getTours(
  params: TourQueryParams,
  token: string,
): Promise<TourListResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null) as [string, string][],
  ).toString();

  const response = await fetch(
    `${API_BASE_URL}/api/admin/tours?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tours");
  }

  return response.json();
}

/**
 * Fetch tour statistics.
 */
export async function getTourStatistics(
  token: string,
): Promise<TourStatistics> {
  const response = await fetch(`${API_BASE_URL}/api/admin/tours/statistics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return response.json();
}

/**
 * Fetch single tour by ID.
 */
export async function getTourById(id: number, token: string): Promise<Tour> {
  const response = await fetch(`${API_BASE_URL}/api/admin/tours/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tour");
  }

  return response.json();
}

export interface CreateTourPayload {
  name: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  schedules?: { startDate: string; maxCapacity: number }[];
}

/**
 * Create new tour.
 */
export async function createTour(
  data: CreateTourPayload,
  token: string,
): Promise<Tour> {
  const response = await fetch(`${API_BASE_URL}/api/admin/tours`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create tour");
  }

  return response.json();
}

/** Chuẩn hóa payload update: bỏ URL rỗng để backend validation không lỗi. */
function sanitizeUpdatePayload(
  data: Partial<CreateTourPayload>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };
  if (out.coverImage === "") delete out.coverImage;
  if (Array.isArray(out.images) && out.images.length === 0) delete out.images;
  return out;
}

/**
 * Update tour.
 */
export async function updateTour(
  id: number,
  data: Partial<CreateTourPayload>,
  token: string,
): Promise<Tour> {
  const body = sanitizeUpdatePayload(data);
  const response = await fetch(`${API_BASE_URL}/api/admin/tours/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update tour");
  }

  return response.json();
}

/**
 * Delete tour.
 */
export async function deleteTour(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/tours/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete tour");
  }
}
