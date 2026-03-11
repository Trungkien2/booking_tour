"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types/user";
import type { ProfileTab } from "./profile-sidebar";
import { ProfileHeader } from "./profile-header";
import { PersonalInfoForm } from "./personal-info-form";
import { BookingHistoryTab } from "./booking-history-tab";
import { FavoritesTab } from "./favorites-tab";
import { NotificationsTab } from "./notifications-tab";
import { SecurityTab } from "./security-tab";

interface ProfileContentProps {
  initialProfile: UserProfile;
  activeTab: ProfileTab;
}

export function ProfileContent({
  initialProfile,
  activeTab,
}: ProfileContentProps) {
  const [profile, setProfile] = useState(initialProfile);

  const handleAvatarChange = (url: string) => {
    setProfile((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
  };

  if (activeTab === "bookings") {
    return <BookingHistoryTab />;
  }

  if (activeTab === "favorites") {
    return <FavoritesTab />;
  }

  if (activeTab === "notifications") {
    return <NotificationsTab />;
  }

  if (activeTab === "security") {
    return <SecurityTab profile={profile} />;
  }

  // Default: personal info
  return (
    <div className="flex-1 min-w-0 space-y-6">
      <ProfileHeader profile={profile} onAvatarChange={handleAvatarChange} />
      <PersonalInfoForm
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
