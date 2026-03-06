import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | GlobeTrotter Tours",
  description:
    "Since 2010, we've been on a mission to bridge cultures and connect people to the world's most breathtaking wonders through authentic travel experiences.",
};

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDm_-68eIOwthyqrWH3fTM9FbjdRFxgu0M_wKUFd2Nim7X6uhClpV2V5CkMJiHQzYSBi7vPPME82eOEtj_43xTPmUzZeqhk2yWBwXMS0-rCcSVHYrF0EeQ43wFPtNEpJe1h-o_AexUx_Bc0YojFfil0xVHJ61HuPEHWPx-JqG_L13qC5owdqCZ-YKpw8DyODXym4VAH2LPZxkr99k3ORiydlllXM8-XIxNWWMVvMltZf5gi1hqxF5nid-FNjOTa5j8DR4uIrY8STEhq";
const JOURNEY_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCRHujueBL-Q15J6pdUCAUqOezoeE8sa-3ClaIk8Sb8RvnDZQ_gPV7b_m_EWPBejWfW6XU5jUL68PuvVggxY1kDkkfNosS9PFLg_0PNzhgTQ2gWyih1alEpltnWtfhsfksCE8JgES0tW9O5PbT6c-odXnMZdJscGCkkYjaH0MGaXXmFvgf2wY_dwK9_3JqUA1G1s1JG7GpqxI7V9HkQbnx0aQneG0kutH4qhhvtIfkiJuerB0NPdRMibd_qpOoUEwapfv6wjnCcatCs";
const TEAM = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh4ko4ZjbkKYcc1ccAuyylnoY3A4_rsocqmUYahTth1ZOcaWkpNKCLlxMaNhgdr0jdsITraoDp5iIgGD_pFbNtBZxR6KUeBuI6v28NbJyE9Vaa6ruMo0JVT9aKBflFipL0mGvmrNuQqwXEzTxCmaaUf9rNujoCknz1GBwUIw5N0yn4H4IExhX6ffs2BigC55LwxizV5pmfo9KE2OLT7jTgs-oMRst4veyENYRvGnWgYFCumHxx3PHF4BJacequ6VcVHMhjh3l5aPSY",
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Operations",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8kGX-BNAX6IS4r1VTZg6FxK-G1jLOmulK8D08OI5rCcG0c5v-PiR0FrDlaMo_2uKc9ycrtMqZm2-0WH5dWY22cf3HGaas0LnVEosvaci8N22l6njn8hHiXZMiyPO2fePAf_bGKR03rrj4ujusC5wMvIEUMj1FBAV1vJ_wZIYq9_KNSmMIcJL2sNCwkc1Gm63fZULQ0YUXuh-dObXj4V3LCHcQ8t57JOu7Rxp90XfJbVfxy54s361HtoKsaJOrFd92tS-SU1nRCwy_",
  },
  {
    name: "Marcus Thorne",
    role: "Lead Adventure Guide",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwATTMWkcdkhSqe2AV692dOmwNibYKhuNx9-IyAVX1TRO7S_trVMf9idfeD5gnx7ZM5Uzn8U5S_d1pWUM_JqQ-GuKWg8F2vobGW687gDChSgwHAkgx3PLyx-1NaEtLVjZxQDKB9DHFmWlAIZjxKFwqfXlQIQVgWv8kKrdF0RdYetobB-KA31rtCWFcP7yReZgGsKUtsde6zXZFfgnAAVfdtGaoim4NhA0uzP1nmB41w3z4_o9AyY7pEHtiUe92L-3aMp8ufNYEizbL",
  },
  {
    name: "Aisha Khan",
    role: "Experience Designer",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6BbBuBKIUXpk2hd8ZywnA0PYIFd4-6ecK8IDxM0P5cJcMoh-RHMqiltBqQqDTvUlbPk8xp6jZEdP9RgLBG8BtAvGmNbfXJhT2GytoBqEtdQWA7rnQDty_av_dqeiCMIxZsA-krskabs4mESRS5SHxOJvAoGV-ff3CzvjCPfyHMnxDwdlwh18Aw4glJ8aClAFadx_p5s0AetAUrFr1GTgQ-vC_onHfZTBiSNccYOQ_biqyr03bK1zqHHuJgvVSPTcjWyYV4FEMLyH7",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="flex flex-col flex-1">
      {/* 1. Hero */}
      <section
        className="flex min-h-[500px] flex-col gap-6 sm:gap-8 items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-cover bg-center bg-no-repeat rounded-none sm:rounded-xl"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%), url("${HERO_BG}")`,
        }}
      >
        <div className="flex flex-col gap-4 text-center max-w-3xl z-10">
          <span className="text-(--color-primary) font-bold tracking-widest uppercase text-xs">
            Our Passion, Your Adventure
          </span>
          <h1 className="text-white text-4xl sm:text-6xl font-black leading-tight tracking-tight">
            Crafting Memories Across the Globe
          </h1>
          <p className="text-slate-200 text-base sm:text-lg font-normal leading-relaxed">
            Since 2010, we&apos;ve been on a mission to bridge cultures and
            connect people to the world&apos;s most breathtaking wonders through
            authentic travel experiences.
          </p>
        </div>
      </section>

      {/* 2. Our Humble Journey */}
      <section className="px-4 sm:px-6 md:px-20 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
            Our Humble Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            What started as a small passion project in a tiny London apartment
            has grown into a global community of adventurers. Our founders,
            seasoned travelers themselves, noticed a gap between commercial
            &quot;tourist traps&quot; and truly authentic local experiences.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Today, GlobeTrotter Tours operates in over 50 countries, but our
            core philosophy remains the same: we don&apos;t just show you a
            place; we help you belong there.
          </p>
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-(--color-primary) text-3xl font-bold">50k+</p>
              <p className="text-slate-500 text-sm">Happy Travelers</p>
            </div>
            <div>
              <p className="text-(--color-primary) text-3xl font-bold">120+</p>
              <p className="text-slate-500 text-sm">Local Partners</p>
            </div>
            <div>
              <p className="text-(--color-primary) text-3xl font-bold">14</p>
              <p className="text-slate-500 text-sm">Years Experience</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Team collaborating in a bright modern office"
              className="w-full h-[400px] object-cover"
              src={JOURNEY_IMG}
            />
          </div>
          <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs border border-slate-100 dark:border-slate-700">
            <div className="bg-primary/20 p-2 rounded-lg shrink-0">
              <span className="material-symbols-outlined text-(--color-primary)">
                verified_user
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Certified sustainable travel provider since 2015.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Why Choose GlobeTrotter */}
      <section className="bg-white dark:bg-slate-900/50 py-16 md:py-20 px-4 sm:px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-4 text-center mb-12 md:mb-16">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold">
              Why Choose GlobeTrotter?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We focus on the details so you can focus on the discovery. Here is
              what sets our journeys apart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-(--color-primary) text-3xl">
                  map
                </span>
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl font-bold">
                Hyper-Local Expertise
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Our guides are born and raised in the regions they lead. They
                know the secret alleyways and the best sunrise spots.
              </p>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-(--color-primary) text-3xl">
                  health_and_safety
                </span>
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl font-bold">
                Uncompromising Safety
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Your well-being is our priority. We partner with premium
                transport and medical services to ensure a worry-free trip.
              </p>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-(--color-primary) text-3xl">
                  eco
                </span>
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl font-bold">
                Sustainable Impact
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                We invest 5% of all profits back into local environmental
                conservation and community development programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Meet the Explorers */}
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-4 mb-10 md:mb-12">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold">
              Meet the Explorers
            </h2>
            <p className="text-slate-500">
              The passionate experts behind your next big adventure.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="group">
                <div className="aspect-3/4 rounded-2xl overflow-hidden mb-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${member.name}, ${member.role}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    src={member.img}
                  />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h4>
                <p className="text-slate-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA banner */}
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="bg-(--color-primary) rounded-3xl p-8 md:p-20 text-center flex flex-col items-center gap-6 md:gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[200px] text-white">
              public
            </span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-black max-w-2xl relative z-10">
            Ready to start your next great adventure?
          </h2>
          <p className="text-white/80 text-lg max-w-xl relative z-10">
            Join thousands of travelers who have found their passion with
            GlobeTrotter Tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link
              href="/tours"
              className="bg-white text-(--color-primary) px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors text-center"
            >
              Browse Tours
            </Link>
            <Link
              href="/contact"
              className="bg-primary/20 border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/30 transition-colors text-center"
            >
              Contact Expert
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
