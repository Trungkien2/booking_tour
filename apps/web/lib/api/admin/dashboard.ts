const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeTours: number;
  totalUsers: number;
}

export interface RecentBooking {
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
  schedule: {
    startDate: string;
    tour: {
      id: number;
      name: string;
    };
  };
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
}

/**
 * Fetch admin dashboard data (stats + recent bookings).
 */
export async function getAdminDashboard(
  token: string,
): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}
