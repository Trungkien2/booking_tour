'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
  },
  {
    name: 'Tours',
    href: '/admin/tours',
    icon: 'tour',
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: 'book_online',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: 'group',
  },
  {
    name: 'Reviews',
    href: '/admin/reviews',
    icon: 'star',
  },
  {
    name: 'Payments',
    href: '/admin/payments',
    icon: 'payments',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: 'settings',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block fixed h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
          <span className="material-symbols-outlined text-white text-2xl">
            luggage
          </span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            TravelCo
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
            info
          </span>
          <div className="flex-1 text-xs">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Need Help?
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Check documentation
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
