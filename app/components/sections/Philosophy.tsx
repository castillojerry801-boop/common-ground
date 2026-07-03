import AnimateIn from "@/app/components/ui/AnimateIn";
import { CGMark } from "@/app/components/ui/CGMark";

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative bg-zinc-950 py-32 lg:py-44 overflow-hidden">
      {/* Ghost CG mark — far right */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 pointer-events-none text-zinc-800"
        aria-hidden="true"
      >
        <CGMark size={480} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-10">
              Our Philosophy
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-50 leading-[1.06] mb-14">
              Your Profession.
              <br />
              <span className="text-zinc-500">Your Toolbox.</span>
            </h2>
          </AnimateIn>

          <AnimateIn delay={200}>
            <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mb-8 pl-6 border-l-2 border-amber-500">
              Every business deserves one place to run their profession — without
              switching between disconnected tools, without losing hours to
              complexity, without friction standing between them and their craft.
            </p>
          </AnimateIn>

          <AnimateIn delay={300}>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl">
              We don&apos;t build generic software. We build for the coach, the
              stylist, the trainer — the professional who shows up every day to
              serve others. Our platforms disappear into the background so they
              can focus on what they do best.
            </p>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
