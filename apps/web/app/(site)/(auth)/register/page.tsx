import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Register | TourBooker',
  description: 'Create your account to book exclusive tours around the world',
};

/**
 * Registration page component.
 * Displays the registration form with header and description.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[#111518] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
            Create your account
          </h1>
          <p className="text-[#617989] dark:text-gray-400 text-base font-normal leading-normal mt-2">
            Join us to discover and book exclusive tours around the world.
          </p>
        </div>

        {/* Registration Form */}
        <RegisterForm />
      </div>
    </div>
  );
}
