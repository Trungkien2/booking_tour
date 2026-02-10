export interface UserPreferences {
  vegetarianMeals?: boolean;
  windowSeat?: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  address: string | null;
  bio: string | null;
  preferences: UserPreferences | null;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  lastPasswordChangeAt: string | null;
}
