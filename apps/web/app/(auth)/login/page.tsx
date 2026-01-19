import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login - TourBooking',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101a22]">
      {/* Header */}
      <Header />

      {/* Main Content Layout */}
      <main className="flex flex-1 w-full justify-center">
        <div className="flex w-full max-w-[1280px] flex-1 gap-8 px-4 py-8 lg:px-20 lg:py-12">
          {/* Left Column: Login Form */}
          <div className="flex flex-col justify-center flex-1 max-w-[520px] mx-auto lg:mx-0">
            {/* Headline & Intro */}
            <div className="mb-8">
              <h1 className="text-[#111518] dark:text-white tracking-light text-[32px] font-bold leading-tight text-left pb-2">
                Welcome back
              </h1>
              <p className="text-[#617989] dark:text-gray-400 text-base font-normal leading-normal">
                Plan your next adventure today.
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />
          </div>

          {/* Right Column: Hero Image (Hidden on mobile) */}
          <div className="hidden lg:flex flex-1 items-stretch pl-8">
            <div className="w-full h-full rounded-2xl overflow-hidden relative group">
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8PffVPQfaXfHAE6E6wFMT4vyGmT3kSya-2HZxvnXvIVro6sF97qc2pVsANIB0BsORApHgUPR-MS-bK8S9q0Cz-YAaW6LwWarldeb7_5EYG3BDnrwCPRPjdCZtPwg3Kdo2wSlF6Z39fJ4lKh_bt9XFmGSpIMgWHskPlsOXb0pRpg6I_xxPjf1iDho62ucaMkQ1RT8P4SQdl-P-IQOHZUz9-8L_6N424nU0N4Iu4C8SS1c7JxW7Q97FdV-IZdDsA-V8fk9zpKR4sBV0")',
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Floating Card Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-yellow-400">
                    star
                  </span>
                  <span className="text-sm font-bold">4.9 (2.5k reviews)</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Explore the Swiss Alps</h3>
                <p className="text-white/90 text-sm mb-4">
                  Discover breathtaking views and unforgettable hiking trails in one
                  of the world&apos;s most beautiful destinations.
                </p>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-3 w-fit border border-white/20">
                  <div
                    className="size-10 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9U82XvHNfSpnzHyMn6ArlIPspKHsEcTmHQrVORlGaKWdj2fv6wZaGzk2gtY4m7r9mYoPruc4sl0G5zYSRFLHdJpa5iIaeU-f-B3-WdRxWVX4I25SeFEHhNraRIQpBkIWePkcPgHHmkQGxsrvPxyhjrTpXd3yOSWUvIl2P-CFULVB6n6AF_Ue9Cs9-gTTZA5shvXF_QU853XKZPzOefzLXJlG2j-aT5CyiPAHc4BM-uUCQCmU_ViY_DHguaMdxnDkT8VfznFLYWaE_")',
                    }}
                  />
                  <div>
                    <p className="text-xs text-white/70">Curated by</p>
                    <p className="text-sm font-bold">Sarah Jenkins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
