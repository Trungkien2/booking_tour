"use client";

import { useEffect, useState } from "react";
import { Loader2, Bell, CalendarCheck, Megaphone, Clock } from "lucide-react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const DEFAULT_PREFS: NotificationPreferences = {
  bookingConfirmations: true,
  tourUpdates: true,
  promotions: true,
  tripReminders: true,
};

interface ToggleConfig {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TOGGLES: ToggleConfig[] = [
  {
    key: "bookingConfirmations",
    label: "Booking Confirmations",
    description:
      "Receive emails for booking creation, payment confirmation, and cancellation.",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    key: "tourUpdates",
    label: "Tour Updates",
    description:
      "Get notified about schedule changes and availability alerts on your favorited tours.",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    key: "promotions",
    label: "Promotions & Offers",
    description: "Stay updated with marketing offers and special deals.",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    key: "tripReminders",
    label: "Trip Reminders",
    description:
      "Receive reminder emails before your upcoming trips with useful info.",
    icon: <Clock className="h-5 w-5" />,
  },
];

export function NotificationsTab() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [savedPrefs, setSavedPrefs] =
    useState<NotificationPreferences>(DEFAULT_PREFS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNotificationPreferences();
        setPrefs(data);
        setSavedPrefs(data);
      } catch {
        toast("Failed to load notification preferences", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(savedPrefs);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateNotificationPreferences(prefs);
      setPrefs(updated);
      setSavedPrefs(updated);
      toast("Notification preferences saved", "success");
    } catch {
      toast("Failed to save preferences", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </h2>
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            size="sm"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {TOGGLES.map((toggle) => (
              <div
                key={toggle.key}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 text-gray-500 dark:text-gray-400">
                  {toggle.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {toggle.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {toggle.description}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(toggle.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    prefs[toggle.key]
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                  role="switch"
                  aria-checked={prefs[toggle.key]}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ${
                      prefs[toggle.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
