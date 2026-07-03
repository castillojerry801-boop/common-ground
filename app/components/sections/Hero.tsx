import { CGMark } from "@/app/components/ui/CGMark";

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
                Common Ground
              </p>
            </div>

            <h1
              className="hero-in text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.06] mb-8"
              style={{ animationDelay: "120ms" }}
            >
              We Build
              <br className="hidden sm:block" /> With Purpose.
            </h1>

            <p
              className="hero-in text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-14"
              style={{ animationDelay: "240ms" }}
            >
              We create software that helps professionals spend less time
              managing work and more time doing what they love.
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

          {/* ── Right: brand mark showcase ── */}
          <div
            className="hero-in hidden lg:flex items-center justify-center relative h-[480px]"
            style={{ animationDelay: "200ms" }}
            aria-hidden="true"
          >
            {/* Outer rings */}
            <div className="absolute w-[440px] h-[440px] rounded-full border border-zinc-200 dark:border-zinc-800/70" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-zinc-200 dark:border-zinc-800/70" />

            {/* Amber bloom behind mark */}
            <div
              className="absolute w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)",
              }}
            />

            {/* The mark — ghost watermark */}
            <CGMark size={300} className="opacity-[0.07] dark:invert dark:opacity-[0.12]" />

            {/* Corner accent dots */}
            <div className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="absolute bottom-10 left-14 w-1 h-1 rounded-full bg-amber-400/40" />
            <div className="absolute top-24 left-8 w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
