"use client";

import { useEffect, useState } from "react";
import {
  KeyRound,
  Clock,
  Monitor,
  Globe,
  Loader2,
  Trash2,
} from "lucide-react";
import { getLoginHistory, type LoginHistoryEntry } from "@/lib/api/users";
import type { UserProfile } from "@/lib/types/user";
import { ChangePasswordModal } from "./change-password-modal";
import { DeleteAccountModal } from "./delete-account-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface SecurityTabProps {
  profile: UserProfile;
}

function maskIp(ip: string | null): string {
  if (!ip) return "Unknown";
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.*`;
  }
  // IPv6 or other format
  return ip.length > 8 ? ip.slice(0, 8) + "..." : ip;
}

function parseBrowser(ua: string | null): string {
  if (!ua) return "Unknown browser";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other browser";
}

function parseDevice(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux") && !ua.includes("Android")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
}

export function SecurityTab({ profile }: SecurityTabProps) {
  const { toast } = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLoginHistory();
        setLoginHistory(data);
      } catch {
        toast("Failed to load login history", "error");
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastPasswordChange = profile.lastPasswordChangeAt
    ? new Date(profile.lastPasswordChangeAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* Sign-in Method */}
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
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Login History */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Login History
        </h2>

        {isLoadingHistory ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : loginHistory.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
            No login history available
          </p>
        ) : (
          <div className="space-y-3">
            {loginHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shrink-0">
                  <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {parseBrowser(entry.userAgent)} on{" "}
                    {parseDevice(entry.userAgent)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.loginAt).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {maskIp(entry.ipAddress)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Account */}
      <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Delete Account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. Your account
          will be deactivated and your data will no longer be accessible.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
