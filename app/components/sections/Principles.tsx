import { type ReactNode } from "react";
import AnimateIn from "@/app/components/ui/AnimateIn";

interface Principle {
  title: string;
  description: string;
  icon: ReactNode;
}

const principles: Principle[] = [
  {
    title: "We Build With Purpose",
    description:
      "Every feature exists for a reason. We start with the problem, then find the solution.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        <path d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
  },
  {
    title: "Reduce Friction",
    description:
      "The best software gets out of the way. We obsess over removing every unnecessary step.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    ),
  },
  {
    title: "Earn Trust",
    description:
      "We build relationships before we build features. Trust is the foundation everything else rests on.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Technology Should Feel Human",
    description:
      "Great software feels intuitive and personal — like it was designed with you in mind.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
  },
  {
    title: "Keep People Focused on Their Craft",
    description:
      "Our users are coaches, stylists, trainers — professionals with a calling. We exist so they can answer it.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
];

export default function Principles() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimateIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 mb-6">
            Our Principles
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-20 max-w-lg">
            How We Think About Building
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {principles.map((p, i) => (
            <AnimateIn key={p.title} delay={i * 80} className="h-full">
              <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-5 h-full">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
