"use client";

interface BookingTabsProps {
  tabs: {
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BookingTabs = ({
  tabs,
  activeTab,
  onTabChange,
}: BookingTabsProps) => {
  const tabItems = [
    { key: "upcoming", label: "Upcoming", count: tabs.upcoming },
    { key: "completed", label: "Completed", count: tabs.completed },
    { key: "cancelled", label: "Cancelled", count: tabs.cancelled },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6" aria-label="Booking tabs">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
              <span
                className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
