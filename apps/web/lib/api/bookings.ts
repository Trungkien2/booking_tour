import {
  BookingsListResponse,
  BookingDetail,
  BookingStatusResponse,
  CancellationPreview,
  CancelBookingPayload,
  CancelBookingResponse,
  CreateBookingPayload,
  CreateBookingResponse,
  CreatePaymentResponse,
} from "../types/booking";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- User Booking APIs ---

export async function createBooking(
  payload: CreateBookingPayload,
  token: string,
): Promise<CreateBookingResponse> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create booking");
  }

  return res.json();
}

export async function getUserBookings(
  params: Record<string, string>,
  token: string,
): Promise<BookingsListResponse> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/bookings/me?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return res.json();
}

export async function getBookingDetail(
  id: number,
  token: string,
): Promise<BookingDetail> {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch booking detail");
  }

  return res.json();
}

export async function getBookingStatus(
  id: number,
  token: string,
): Promise<BookingStatusResponse> {
  const res = await fetch(`${API_URL}/bookings/${id}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch booking status");
  }

  return res.json();
}

export async function getCancellationPreview(
  id: number,
  token: string,
): Promise<CancellationPreview> {
  const res = await fetch(`${API_URL}/bookings/${id}/cancellation-preview`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cancellation preview");
  }

  return res.json();
}

export async function cancelBooking(
  id: number,
  body: CancelBookingPayload,
  token: string,
): Promise<CancelBookingResponse> {
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to cancel booking");
  }

  return res.json();
}

// --- Payment APIs ---

export async function createPayment(
  bookingId: number,
  provider: string,
  returnUrl: string,
  token: string,
): Promise<CreatePaymentResponse> {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider, returnUrl }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create payment");
  }

  return res.json();
}

export async function verifyPayment(
  bookingId: number,
  token: string,
): Promise<{ paymentStatus: string; bookingStatus: string }> {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/payment/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to verify payment");
  }

  return res.json();
}
