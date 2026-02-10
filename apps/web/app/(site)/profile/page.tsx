"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { getMyProfile } from "@/lib/api/users";
import type { UserProfile } from "@/lib/types/user";
import { ToastProvider } from "@/components/ui/toast";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileContent } from "@/components/profile/profile-content";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login?redirect=/profile");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Unable to load profile"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <ProfileLayout>
        <ProfileSidebar profile={profile} />
        <ProfileContent initialProfile={profile} />
      </ProfileLayout>
    </ToastProvider>
  );
}
