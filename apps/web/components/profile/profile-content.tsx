"use client";

import { useState } from "react";
import { KeyRound, Clock } from "lucide-react";
import type { UserProfile } from "@/lib/types/user";
import { ProfileHeader } from "./profile-header";
import { PersonalInfoForm } from "./personal-info-form";
import { ChangePasswordModal } from "./change-password-modal";
import { Button } from "@/components/ui/button";

interface ProfileContentProps {
  initialProfile: UserProfile;
}

export function ProfileContent({ initialProfile }: ProfileContentProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleAvatarChange = (url: string) => {
    setProfile((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
  };

  const lastPasswordChange = profile.lastPasswordChangeAt
    ? new Date(profile.lastPasswordChangeAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <ProfileHeader profile={profile} onAvatarChange={handleAvatarChange} />

      <PersonalInfoForm
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Sign-in Method Section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sign-in Method
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Password
              </p>
              {lastPasswordChange ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last changed {lastPasswordChange}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Never changed
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-sm"
          >
            Change Password
          </Button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
