/** Tax rate applied to booking subtotal */
export const TAX_RATE = 0.1;

/** Minutes before a PENDING booking expires */
export const RESERVATION_TTL_MINUTES = 15;

/** Refund tiers based on days until departure.
 * Ordered from most generous to least. First match wins. */
export const REFUND_TIERS = [
  { minDays: 15, percent: 70 },
  { minDays: 2, percent: 50 },
  { minDays: 0, percent: 0 },
] as const;
