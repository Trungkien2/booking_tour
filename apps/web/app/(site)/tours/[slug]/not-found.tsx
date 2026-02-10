import Link from "next/link";

export default function TourNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 block">
          explore_off
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tour Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The tour you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Browse All Tours
        </Link>
      </div>
    </div>
  );
}
