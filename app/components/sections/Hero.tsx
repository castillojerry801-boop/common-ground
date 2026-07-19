export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient amber glow — left/center */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 60%, rgba(217,119,6,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: content ── */}
          <div>
            {/* Eyebrow with amber rule */}
            <div
              className="hero-in flex items-center gap-3 mb-8"
              style={{ animationDelay: "0ms" }}
            >
              <div className="w-6 h-px bg-amber-500" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">
                Common Ground Workshop · Layton, Utah
              </p>
            </div>

            <h1
              className="hero-in text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.06] mb-8"
              style={{ animationDelay: "120ms" }}
            >
              Web Design
              <br className="hidden sm:block" /> Built With Purpose.
            </h1>

            <p
              className="hero-in text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-14"
              style={{ animationDelay: "240ms" }}
            >
              We build custom websites for local businesses across Utah — so
              you can spend less time managing your online presence and more
              time doing the work you love.
            </p>

            <div
              className="hero-in flex flex-col sm:flex-row gap-4"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#products"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors duration-150"
              >
                Explore Products
              </a>
              <a
                href="#philosophy"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-150"
              >
                Our Philosophy
              </a>
            </div>
          </div>

          {/* ── Right: wordmark logo ── */}
          <div
            className="hero-in hidden lg:flex items-center justify-center relative h-[480px]"
            style={{ animationDelay: "200ms" }}
          >
            {/* Soft grounding shadow behind the logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "340px",
                height: "120px",
                bottom: "80px",
                background: "radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%)",
                filter: "blur(24px)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cg-logo-wordmark-transparent.png"
              alt="Common Ground Workshop"
              className="relative w-[509px] h-auto"
              style={{
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12)) drop-shadow(0 2px 6px rgba(0,0,0,0.08)) contrast(1.02)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
