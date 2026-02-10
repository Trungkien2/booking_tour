export type BookingStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type RefundStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface BookingTraveler {
  id: number;
  fullName: string;
  gender?: string;
  ageGroup: 'ADULT' | 'CHILD' | 'BABY';
  price: number;
}

export interface BookingListItem {
  id: number;
  status: BookingStatus;
  bookingDate: string;
  totalPrice: number;
  travelerCount: number;
  tour: {
    id: number;
    name: string;
    slug: string;
    coverImage: string;
    location: string;
    durationDays: number;
  };
  schedule: {
    id: number;
    startDate: string;
  };
  canCancel: boolean;
  canModify: boolean;
}

export interface PriceBreakdown {
  adults: { count: number; unitPrice: number; total: number };
  children: { count: number; unitPrice: number; total: number };
  babies: { count: number };
  subtotal: number;
  taxes: number;
  total: number;
}

export interface BookingDetail extends BookingListItem {
  note?: string;
  travelers: BookingTraveler[];
  priceBreakdown: PriceBreakdown;
  tour: BookingListItem['tour'] & {
    images: string[];
    meetingPoint?: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
      instructions: string;
    };
    cancellationPolicy?: string;
  };
  payments: Array<{
    id: number;
    amount: number;
    provider: string;
    status: PaymentStatus;
    createdAt: string;
  }>;
  refunds: Array<{
    id: number;
    amount: number;
    status: RefundStatus;
    reason?: string;
    createdAt: string;
  }>;
  cancellationPreview: CancellationPreview | null;
}

export interface BookingStatusResponse {
  bookingId: number;
  status: BookingStatus;
  steps: Array<{
    id: string;
    label: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
  }>;
  redirectUrl: string | null;
}

export interface CancellationPreview {
  bookingId: number;
  daysUntilDeparture: number;
  tier: 'free' | 'early' | 'standard' | 'late';
  refundPercentage: number;
  penaltyPercentage: number;
  refundAmount: number;
  penaltyAmount: number;
  totalPaid: number;
  requiresConfirmation: boolean;
  description: string;
}

export interface CreateBookingPayload {
  scheduleId: number;
  travelers: Array<{
    fullName: string;
    gender?: string;
    ageGroup: 'ADULT' | 'CHILD' | 'BABY';
  }>;
  note?: string;
}

export interface CreateBookingResponse {
  booking: BookingDetail;
  priceBreakdown: PriceBreakdown;
}

export interface BookingsListResponse {
  bookings: BookingListItem[];
  tabs: { upcoming: number; completed: number; cancelled: number };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreatePaymentResponse {
  payment: {
    id: number;
    bookingId: number;
    status: PaymentStatus;
    transactionId: string;
    checkoutUrl: string;
  };
  checkoutUrl: string;
}

export interface CancelBookingPayload {
  reason?: string;
  confirmNoRefund?: boolean;
}

export interface CancelBookingResponse {
  bookingId: number;
  status: 'CANCELLED';
  cancellationPreview: CancellationPreview;
  refund: {
    id: number;
    amount: number;
    status: RefundStatus;
  } | null;
}
