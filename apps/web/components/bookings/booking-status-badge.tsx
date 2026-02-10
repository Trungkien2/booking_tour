"use client";

type BookingStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending Payment",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  PAID: {
    label: "Confirmed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};
