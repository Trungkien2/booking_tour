import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">BookingTour Admin</h1>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          <Link
            href="/admin/tours"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md bg-gray-100 hover:bg-gray-200 group"
          >
            Tours
          </Link>
          {/* Placeholder for other admin links */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-64 p-8">{children}</main>
    </div>
  );
}
