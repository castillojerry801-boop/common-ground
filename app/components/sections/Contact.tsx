import AnimateIn from "@/app/components/ui/AnimateIn";

export default function Contact() {
  return (
    <section id="contact" className="bg-zinc-950 py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-8">
              Get in Touch
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-50 leading-[1.06] mb-8">
              Ready to simplify how you operate?
            </h2>
          </AnimateIn>

          <AnimateIn delay={200}>
            <p className="text-xl text-zinc-400 leading-relaxed mb-12 max-w-xl">
              If you&apos;re a business looking to reduce the friction in how you
              work, we&apos;d love to hear from you.
            </p>
          </AnimateIn>

          <AnimateIn delay={300}>
            <a
              href="mailto:hello@commonground.build"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-medium transition-colors duration-150"
            >
              hello@commonground.build
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
            </a>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
