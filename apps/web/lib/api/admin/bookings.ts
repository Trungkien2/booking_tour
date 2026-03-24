const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface AdminBooking {
  id: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  bookingDate: string;
  totalPrice: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  travelers: Array<{
    id: number;
    fullName: string;
    type: string;
    price: number;
  }>;
  schedule: {
    id: number;
    startDate: string;
    tour: {
      id: number;
      name: string;
      slug: string;
      coverImage: string | null;
      location: string | null;
    };
  };
  payments: Array<{
    id: number;
    status: string;
    amount: number;
    method: string;
  }>;
}

export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdminBookingsResponse {
  bookings: AdminBooking[];
  stats: BookingStats;
  pagination: BookingPagination;
}

export interface AdminBookingDetail {
  id: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  bookingDate: string;
  totalPrice: number;
  note: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  expiresAt: string | null;
  user: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    phone: string | null;
  };
  travelers: Array<{
    id: number;
    fullName: string;
    gender: string | null;
    ageGroup: "ADULT" | "CHILD" | "BABY";
    price: number;
  }>;
  schedule: {
    id: number;
    startDate: string;
    tour: {
      id: number;
      name: string;
      slug: string;
      coverImage: string | null;
      location: string | null;
      durationDays: number;
    };
  };
  payments: Array<{
    id: number;
    amount: number;
    provider: string;
    transactionId: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    createdAt: string;
  }>;
  refunds: Array<{
    id: number;
    amount: number;
    reason: string | null;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    processedAt: string | null;
  }>;
}

export interface BookingQueryParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch paginated list of admin bookings with filters and stats.
 */
export async function getAdminBookings(
  params: BookingQueryParams,
  token: string,
): Promise<AdminBookingsResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== "") as [
      string,
      string,
    ][],
  ).toString();

  const response = await fetch(
    `${API_BASE_URL}/api/admin/bookings?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
}

/**
 * Fetch single booking detail by ID (admin).
 */
export async function getAdminBookingDetail(
  id: number,
  token: string,
): Promise<AdminBookingDetail> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/bookings/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking detail");
  }

  return response.json();
}

// ============================================================================
// ADMIN REFUNDS
// ============================================================================

export interface AdminRefund {
  id: number;
  amount: number;
  reason: string | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  gatewayRefundId: string | null;
  createdAt: string;
  processedAt: string | null;
  booking: {
    id: number;
    status: string;
    totalPrice: number;
    user: { id: number; fullName: string; email: string };
  };
  payment: {
    id: number;
    provider: string;
    transactionId: string;
  };
}

export interface RefundStats {
  pending: number;
  completed: number;
  failed: number;
  totalRefunded: number;
}

export interface AdminRefundsResponse {
  refunds: AdminRefund[];
  pagination: BookingPagination;
  stats: RefundStats;
}

export async function getAdminRefunds(
  params: { status?: string; page?: number; limit?: number },
  token: string,
): Promise<AdminRefundsResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== "") as [
      string,
      string,
    ][],
  ).toString();

  const response = await fetch(
    `${API_BASE_URL}/api/admin/refunds?${queryString}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch refunds");
  }

  return response.json();
}

export async function processAdminRefund(
  refundId: number,
  token: string,
): Promise<AdminRefund> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/refunds/${refundId}/process`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to process refund");
  }

  return response.json();
}
