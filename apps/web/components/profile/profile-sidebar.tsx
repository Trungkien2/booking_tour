"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CalendarDays,
  CreditCard,
  Shield,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import type { UserProfile } from "@/lib/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  id: string;
  href?: string;
}

const navItems: NavItem[] = [
  {
    label: "Personal Info",
    icon: <User className="h-5 w-5" />,
    id: "personal",
  },
  {
    label: "My Bookings",
    icon: <CalendarDays className="h-5 w-5" />,
    id: "bookings",
    href: "/bookings",
  },
  {
    label: "Payment Methods",
    icon: <CreditCard className="h-5 w-5" />,
    id: "payment",
  },
  { label: "Security", icon: <Shield className="h-5 w-5" />, id: "security" },
  {
    label: "Notifications",
    icon: <Bell className="h-5 w-5" />,
    id: "notifications",
  },
];

interface ProfileSidebarProps {
  profile: UserProfile;
}

export function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter();
  const { clearAuth } = useAuth();

  const handleNavClick = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      setActiveTab(item.id);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const avatarUrl = profile.avatarUrl
    ? profile.avatarUrl.startsWith("http")
      ? profile.avatarUrl
      : `${API_BASE_URL}${profile.avatarUrl}`
    : null;

  const joinYear = new Date(profile.createdAt).getFullYear();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        {/* User info */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mb-3">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={profile.fullName || "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-semibold">
                {(profile.fullName || profile.email)[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {profile.fullName || "User"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Member since {joinYear}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left w-full ${
                activeTab === item.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left w-full"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
