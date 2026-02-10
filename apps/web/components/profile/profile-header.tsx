"use client";

import { BadgeCheck } from "lucide-react";
import type { UserProfile } from "@/lib/types/user";
import { AvatarUploader } from "./avatar-uploader";

interface ProfileHeaderProps {
  profile: UserProfile;
  onAvatarChange: (url: string) => void;
}

export function ProfileHeader({ profile, onAvatarChange }: ProfileHeaderProps) {
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const roleLabel =
    {
      USER: "Member",
      ADMIN: "Administrator",
      GUIDE: "Tour Guide",
    }[profile.role] || profile.role;

  return (
    <div className="flex items-start gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <AvatarUploader
        currentUrl={profile.avatarUrl}
        name={profile.fullName}
        onUploaded={onAvatarChange}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {profile.fullName || "User"}
          </h1>
          {profile.emailVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {roleLabel}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Joined {joinDate}
        </p>
      </div>
    </div>
  );
}
