import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Admin Panel",
  description: "TravelCo admin dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to TravelCo admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tours */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tours
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                0
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                tour
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">
              +12%
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              from last month
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                0
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">
                book_online
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">
              +8%
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              from last month
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                $0
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">
                payments
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">
              +23%
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              from last month
            </span>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                0
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20">
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">
                group
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">
              +5%
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              from last month
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">
              add_circle
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New Tour
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">
              person_add
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New User
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">
              assessment
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              View Reports
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">
              settings
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
