import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-[#f0f3f4] dark:border-gray-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 text-[#111518] dark:text-white"
          >
            <div className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined !text-3xl">
                travel_explore
              </span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
              TravelCo
            </h2>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <div className="flex items-center gap-6 lg:gap-9">
              <Link
                href="/tours"
                className="text-[#111518] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              >
                Destinations
              </Link>
              <Link
                href="/about"
                className="text-[#111518] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#111518] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors"
              >
                <span className="truncate">Sign In</span>
              </Link>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg size-10 bg-[#f0f3f4] dark:bg-gray-800 text-[#111518] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Shopping cart"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg size-10 bg-[#f0f3f4] dark:bg-gray-800 text-[#111518] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Account"
              >
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex items-center p-2 text-gray-600 dark:text-gray-300"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
