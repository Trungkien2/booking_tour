"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { uploadAvatar } from "@/lib/api/users";
import { useToast } from "@/components/ui/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface AvatarUploaderProps {
  currentUrl: string | null;
  name: string | null;
  onUploaded: (url: string) => void;
}

export function AvatarUploader({
  currentUrl,
  name,
  onUploaded,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const displayUrl =
    preview ||
    (currentUrl
      ? currentUrl.startsWith("http")
        ? currentUrl
        : `${API_BASE_URL}${currentUrl}`
      : null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast("Invalid file type. Allowed: JPEG, PNG, WebP", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("File size must be under 5MB", "error");
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    try {
      const result = await uploadAvatar(file);
      onUploaded(result.avatarUrl);
      toast("Avatar updated successfully", "success");
    } catch (error) {
      setPreview(null);
      toast(
        error instanceof Error ? error.message : "Failed to upload avatar",
        "error",
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative inline-block">
      <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayUrl}
            alt={name || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-2xl font-semibold">
            {(name || "?")[0]?.toUpperCase()}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
        aria-label="Change avatar"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
