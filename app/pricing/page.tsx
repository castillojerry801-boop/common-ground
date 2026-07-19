import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import AnimateIn from "@/app/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "Pricing — Custom Website Design for Small Businesses",
  description:
    "Transparent pricing for custom small-business website design, annual managed hosting and domain renewal, and website care plans. Serving Utah small businesses.",
  keywords: [
    "custom small-business website pricing",
    "local business website design Utah",
    "managed website hosting Utah",
    "website maintenance plan",
    "website care plan",
    "custom business software Utah",
  ],
  alternates: {
    canonical: "https://cg-workshop.com/pricing",
  },
};

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0 mt-0.5 text-amber-500"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8h12M8 2l6 6-6 6" />
    </svg>
  );
}

const websiteFeatures = [
  "Custom website design",
  "Mobile and tablet optimization",
  "Domain research and registration",
  "Domain and DNS setup",
  "Managed hosting and deployment setup",
  "Contact and lead forms",
  "Image galleries and built-in slideshows",
  "Basic search engine optimization",
  "Cross-browser testing",
  "Google Business Profile assistance",
  "Launch support",
  "First year of domain and managed hosting included",
];

const renewalFeatures = [
  "Domain renewal",
  "Managed hosting oversight",
  "SSL and DNS management",
  "Basic uptime monitoring",
  "Routine technical maintenance",
  "Form and integration checks",
  "General hosting and domain support",
];

const careFeatures = [
  "Minor text updates",
  "Minor image updates",
  "Business information changes",
  "General troubleshooting",
  "Routine website maintenance",
  "Business-hours support",
  "Domain and hosting assistance",
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-white dark:bg-zinc-950 pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimateIn>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 mb-6">
                Pricing
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.06] mb-6 max-w-3xl">
                Straightforward Pricing.{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  Built Around Your Business.
                </span>
              </h1>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                Every business has different needs. We begin with a strong
                professional foundation, then build around the pages, tools, and
                integrations that best support your business.
              </p>
            </AnimateIn>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="bg-zinc-50 dark:bg-zinc-900 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

              {/* Card 1: Custom Website — Featured */}
              <AnimateIn delay={0} className="h-full">
                <div className="rounded-2xl bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-200 p-8 flex flex-col gap-6 h-full shadow-lg">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400 mb-5">
                      Our Foundation
                    </span>
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 leading-snug mb-4">
                      Custom Small-Business Website
                    </h2>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500 mb-1">
                      Starting at
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        $800
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-4">
                      A professionally designed website built around your
                      business, brand, customers, and goals.
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800" />

                  <ul className="flex flex-col gap-3 flex-1">
                    {websiteFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    Final pricing depends on the number of pages, content needs,
                    integrations, and requested features.
                  </p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-medium transition-colors duration-150"
                  >
                    Request a Website Quote
                    <ArrowRight />
                  </Link>
                </div>
              </AnimateIn>

              {/* Card 2: Annual Renewal */}
              <AnimateIn delay={80} className="h-full">
                <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-6 h-full">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 leading-snug mb-4">
                      Annual Website Renewal
                    </h2>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500 mb-1">
                      Starting at
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        $170
                      </span>
                      <span className="text-base text-zinc-400 dark:text-zinc-500">
                        /year
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-4">
                      Continued technical management to help keep your website
                      online, connected, and running smoothly after the first
                      year.
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800" />

                  <ul className="flex flex-col gap-3 flex-1">
                    {renewalFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    Annual renewal begins after the included first year. Premium
                    hosting, paid integrations, business email, messaging usage,
                    and other third-party service costs may be billed separately.
                  </p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-sm font-medium transition-colors duration-150"
                  >
                    Ask About Annual Renewal
                    <ArrowRight />
                  </Link>
                </div>
              </AnimateIn>

              {/* Card 3: Website Care */}
              <AnimateIn delay={160} className="h-full">
                <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-6 h-full">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 leading-snug mb-4">
                      Website Care
                    </h2>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500 mb-1">
                      Starting at
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        $50
                      </span>
                      <span className="text-base text-zinc-400 dark:text-zinc-500">
                        /month
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-4">
                      Ongoing support for businesses that want help keeping their
                      website current and handling small updates.
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800" />

                  <ul className="flex flex-col gap-3 flex-1">
                    {careFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    Care plans are customized based on the website, update
                    frequency, and level of support required. Major redesigns,
                    new pages, new features, and advanced integrations are quoted
                    separately.
                  </p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-sm font-medium transition-colors duration-150"
                  >
                    Ask About Website Care
                    <ArrowRight />
                  </Link>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* Advanced Features Callout */}
        <section className="bg-zinc-950 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <AnimateIn>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-6">
                  Custom Work
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-[1.06] mb-6">
                  Need More Than a Brochure Website?
                </h2>
              </AnimateIn>
              <AnimateIn delay={100}>
                <p className="text-xl text-zinc-400 leading-relaxed mb-5">
                  Booking systems, online payments, SMS messaging, customer
                  accounts, dashboards, databases, automations, and custom
                  business tools are available and quoted separately.
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed mb-10">
                  Third-party services and usage-based costs — including Twilio
                  messaging, Supabase upgrades, business email, payment
                  processing, premium scheduling tools, and other external
                  services — are billed separately unless specifically included
                  in the proposal.
                </p>
              </AnimateIn>
              <AnimateIn delay={200}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-medium transition-colors duration-150"
                >
                  Discuss a Custom Project
                  <ArrowRight />
                </Link>
              </AnimateIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
