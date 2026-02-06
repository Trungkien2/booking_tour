'use client';

import Link from 'next/link';

// ─── Config: single source of truth, dễ chỉnh sửa ───
const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
] as const;

const SUPPORT_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Terms of Service', href: '/terms' },
] as const;

const SOCIAL_LINKS = [
  { icon: 'social_leaderboard', label: 'Leaderboard', href: '#' },
  { icon: 'photo_camera', label: 'Instagram', href: '#' },
  { icon: 'public', label: 'Globe', href: '#' },
] as const;

const LINK_STYLE = 'hover:text-(--color-primary) transition-colors';
const COLUMN_HEADING_STYLE =
  'font-bold text-[#111518] dark:text-white text-base mb-6';
const COLUMN_LIST_STYLE = 'space-y-4 text-sm text-gray-600 dark:text-gray-400';

// ─── Sub-components: mỗi phần một trách nhiệm ───
function FooterBrand() {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3 text-[#111518] dark:text-white mb-6">
        <span className="material-symbols-outlined text-(--color-primary) text-[28px]">
          travel_explore
        </span>
        <h2 className="text-xl font-bold tracking-tight">TravelCo</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-[280px]">
        Making your dream vacations a reality since 2010. Explore the world with
        us.
      </p>
    </div>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Readonly<Array<{ label: string; href: string }>>;
}) {
  return (
    <div className="min-w-0">
      <h4 className={COLUMN_HEADING_STYLE}>{title}</h4>
      <ul className={COLUMN_LIST_STYLE}>
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link href={href} className={LINK_STYLE}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterSubscribe() {
  return (
    <div className="min-w-0 lg:flex lg:flex-col lg:items-end">
      <h4 className={COLUMN_HEADING_STYLE}>Subscribe</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 lg:text-right">
        Get travel tips and exclusive deals
      </p>
      <form
        className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 w-full lg:max-w-[300px] shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="Email address"
          className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-[#111518] dark:text-white placeholder-gray-400 outline-none focus:ring-0 border-0"
          aria-label="Email for newsletter"
        />
        <button
          type="submit"
          className="bg-(--color-primary) text-white w-12 h-[48px] flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
          aria-label="Subscribe"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>
      </form>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
      <p className="text-gray-500 dark:text-gray-400 text-sm order-2 sm:order-1">
        © {new Date().getFullYear()} TravelCo. All rights reserved.
      </p>
      <nav
        className="flex gap-8 text-gray-500 dark:text-gray-400 order-1 sm:order-2"
        aria-label="Social links"
      >
        {SOCIAL_LINKS.map(({ icon, label, href }) => (
          <a
            key={icon}
            href={href}
            className={LINK_STYLE}
            aria-label={label}
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-y-12 gap-x-8 sm:gap-x-12 lg:gap-x-16 items-start">
            <FooterBrand />
            <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
            <FooterLinkColumn title="Support" links={SUPPORT_LINKS} />
            <FooterSubscribe />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-8">
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
}
