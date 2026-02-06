import Link from "next/link";
import { Globe, ShoppingCart, User, Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-[#111518] dark:text-white group"
          >
            <div className="size-9 flex items-center justify-center text-primary">
              <Globe className="size-7 stroke-[1.5]" />
            </div>
            <span className="text-lg font-bold leading-tight tracking-[-0.015em]">
              TravelCo
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <div className="flex items-center gap-8">
              <Link
                href="/tours"
                className="text-[#111518] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Destinations
              </Link>
              <Link
                href="/about"
                className="text-[#111518] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#111518] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center w-[100px] justify-center rounded-xl h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              >
                Sign In
              </Link>
              <button
                type="button"
                className="flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-gray-800 text-[#111518] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="size-5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-xl size-10 bg-gray-100 dark:bg-gray-800 text-[#111518] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Account"
              >
                <User className="size-5 stroke-[1.5]" />
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center size-10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Menu"
          >
            <Menu className="size-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
}
