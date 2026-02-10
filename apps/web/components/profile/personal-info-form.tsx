"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";
import { updateMyProfile, sendVerificationEmail } from "@/lib/api/users";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/lib/types/user";

interface PersonalInfoFormProps {
  profile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
}

export function PersonalInfoForm({
  profile,
  onProfileUpdated,
}: PersonalInfoFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address: profile.address || "",
      bio: profile.bio || "",
      vegetarianMeals: profile.preferences?.vegetarianMeals || false,
      windowSeat: profile.preferences?.windowSeat || false,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const updated = await updateMyProfile({
        fullName: data.fullName || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        bio: data.bio || undefined,
        preferences: {
          vegetarianMeals: data.vegetarianMeals ?? false,
          windowSeat: data.windowSeat ?? false,
        },
      });
      onProfileUpdated(updated);
      toast("Profile updated successfully", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to update profile",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerificationEmail();
      toast("Verification email sent! Check your inbox.", "success");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to send verification email",
        "error",
      );
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={profile.email}
                readOnly
                className="h-11 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
              />
            </div>
            {!profile.emailVerified && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Not verified
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVerifyEmail}
                  disabled={isSendingVerification}
                  className="text-xs"
                >
                  {isSendingVerification ? "Sending..." : "Verify"}
                </Button>
              </div>
            )}
            {profile.emailVerified && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Full Name
          </label>
          <Input
            id="fullName"
            {...register("fullName")}
            className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Phone
          </label>
          <Input
            id="phone"
            {...register("phone")}
            className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            placeholder="+84123456789"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Address
          </label>
          <Input
            id="address"
            {...register("address")}
            className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Bio
          </label>
          <textarea
            id="bio"
            {...register("bio")}
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Tell us about yourself..."
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        {/* Travel Preferences */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Travel Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("vegetarianMeals")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Vegetarian meals
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("windowSeat")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Window seat preference
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSaving || !isDirty}
            className="h-11 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
