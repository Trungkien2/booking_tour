import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | GlobeTrotter Tours",
  description:
    "Have questions about a destination or need help with a booking? Get in touch with our team.",
};

const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAx9SpRtVzKAlWBmYSdrQCaajDi2HDIQQKPOEZ0TQp4UvtQYCd27URsdYVeGYaD34oYTt0AtcU59ppFmMOOTt-0Rr9MiMQQFK0huMCKUiMfChG2r_IyvoNMt-duuxpSiI6cYUdj84KsYLY2LW46wbaasZF3wKim8KTCzzNNVCcmCrCFBDrI2FcolBtpvOjB-8bokVcUW6qXxt_mrDTN72OugzqHDicVUczRS93lpvgVBYGVDBCXMNB8BUdjyTc8SZ97UelY1QuGJrb8";

const CONTACT_METHODS: {
  icon: string;
  title: string;
  detail: string;
  sub?: string;
}[] = [
  {
    icon: "call",
    title: "Call Us",
    detail: "+1 (555) TOUR-EASE",
    sub: "Mon - Fri, 9am - 6pm EST",
  },
  {
    icon: "mail",
    title: "Email Us",
    detail: "support@tourease.com",
    sub: "Avg. response time: 2 hours",
  },
  {
    icon: "location_on",
    title: "Visit Office",
    detail: "123 Travel Way, Suite 400\nSan Francisco, CA 94105",
  },
];

const SOCIAL_ICONS = ["public", "share", "camera", "chat"] as const;

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Booking Support",
  "Refund Request",
  "Partnership",
] as const;

export default function ContactPage() {
  return (
    <main className="flex-grow container mx-auto max-w-6xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black tracking-tight mb-4">
          Contact Our Team
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
          Have questions about a destination or need help with a booking?
          We&apos;re here to help you plan your next unforgettable adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Methods */}
        <div className="lg:col-span-1 space-y-6">
          {CONTACT_METHODS.map((method) => (
            <div
              key={method.title}
              className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4"
            >
              <div className="bg-primary/10 p-3 rounded-lg text-(--color-primary)">
                <span className="material-symbols-outlined">
                  {method.icon}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  {method.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-line">
                  {method.detail}
                </p>
                {method.sub && (
                  <p className="text-slate-500 text-xs mt-1">{method.sub}</p>
                )}
              </div>
            </div>
          ))}

          {/* Social Media */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-(--color-primary) hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form & Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:ring-(--color-primary) focus:border-(--color-primary)"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:ring-(--color-primary) focus:border-(--color-primary)"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:ring-(--color-primary) focus:border-(--color-primary)">
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:ring-(--color-primary) focus:border-(--color-primary)"
                />
              </div>
              <button
                type="button"
                className="w-full md:w-auto bg-(--color-primary) text-white font-bold py-3 px-10 rounded-lg hover:bg-(--color-primary)/90 transition-all shadow-lg shadow-(--color-primary)/20"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map Section */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-80 relative shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Map view of San Francisco showing office location"
              className="w-full h-full object-cover"
              src={MAP_IMG}
            />
            <div className="absolute inset-0 bg-(--color-primary)/10 pointer-events-none" />
            <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-(--color-primary) mb-1">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Our Headquarters
                </span>
              </div>
              <p className="text-sm text-slate-900 dark:text-white font-medium">
                123 Travel Way, San Francisco
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Quick answers to common questions about our tours and services.
        </p>
        <a
          className="inline-flex items-center gap-2 text-(--color-primary) font-bold hover:underline"
          href="#"
        >
          Visit Help Center{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </main>
  );
}
