export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Subtle ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(217, 119, 6, 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-24">
        <p
          className="hero-in text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 mb-8"
          style={{ animationDelay: "0ms" }}
        >
          Common Ground
        </p>

        <h1
          className="hero-in text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.06] mb-8 max-w-4xl"
          style={{ animationDelay: "120ms" }}
        >
          We Build
          <br className="hidden sm:block" /> With Purpose.
        </h1>

        <p
          className="hero-in text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-14"
          style={{ animationDelay: "240ms" }}
        >
          We create software that helps professionals spend less time managing
          work and more time doing what they love.
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
    </section>
  );
}
