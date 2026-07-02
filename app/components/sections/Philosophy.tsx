import AnimateIn from "@/app/components/ui/AnimateIn";

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-zinc-950 py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
