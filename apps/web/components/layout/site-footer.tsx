'use client';

import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-[#f0f3f4] dark:border-gray-800 py-10 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-[#111518] dark:text-white mb-4">
              <span className="material-symbols-outlined text-[#1392ec]">
                travel_explore
              </span>
              <h2 className="text-lg font-bold">TravelCo</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Making your dream vacations a reality since 2010.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#111518] dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/about" className="hover:text-[#1392ec]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#1392ec]">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#1392ec]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#111518] dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-[#1392ec]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#1392ec]">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1392ec]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#111518] dark:text-white mb-4">
              Subscribe
            </h4>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-[#1392ec] focus:border-[#1392ec] outline-none text-[#111518] dark:text-white placeholder-gray-400"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-[#1392ec] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors shrink-0"
                aria-label="Subscribe"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-[#f0f3f4] dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TravelCo. All rights reserved.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-[#1392ec]" aria-label="Social">
              <span className="material-symbols-outlined text-[20px]">
                social_leaderboard
              </span>
            </a>
            <a href="#" className="hover:text-[#1392ec]" aria-label="Instagram">
              <span className="material-symbols-outlined text-[20px]">
                photo_camera
              </span>
            </a>
            <a href="#" className="hover:text-[#1392ec]" aria-label="Share">
              <span className="material-symbols-outlined text-[20px]">
                public
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
