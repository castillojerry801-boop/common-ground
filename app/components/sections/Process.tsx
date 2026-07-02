import AnimateIn from "@/app/components/ui/AnimateIn";

const steps = [
  {
    number: "01",
    title: "Listen",
    description:
      "We spend time with professionals in their environment, understanding how they actually work day to day.",
  },
  {
    number: "02",
    title: "Understand",
    description:
      "We map workflows, identify pain points, and find what truly matters — not what we assume matters.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We build focused, purposeful software. Nothing extra, nothing missing.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "We ship, observe, learn, and iterate. Every version is better than the last.",
  },
  {
    number: "05",
    title: "Repeat",
    description: "Every improvement begins with listening again. The loop never ends.",
  },
];

export default function Process() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimateIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 mb-6">
            Our Process
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-20 max-w-lg">
            How We Work
          </h2>
        </AnimateIn>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:flex gap-0">
          {steps.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 100} className="flex-1">
              <div className="relative pr-8">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-[1.375rem] left-11 right-0 h-px bg-zinc-200 dark:bg-zinc-800" />
                )}

                <div className="mb-8">
                  <div className="w-11 h-11 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center relative z-10">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 tabular-nums">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pr-4">
                  {step.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden flex flex-col">
          {steps.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 80}>
              <div className="relative flex gap-6 pb-12 last:pb-0">
                {/* Vertical connector */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[1.375rem] top-11 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
                )}

                <div className="w-11 h-11 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center flex-shrink-0 relative z-10">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 tabular-nums">
                    {step.number}
                  </span>
                </div>

                <div className="pt-2.5">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                    {step.description}
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
