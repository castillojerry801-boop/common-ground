import AnimateIn from "@/app/components/ui/AnimateIn";
import { CGMark } from "@/app/components/ui/CGMark";

export default function CGScheduler() {
  return (
    <section className="relative bg-zinc-950 py-32 lg:py-44 overflow-hidden">
      {/* Subtle amber glow top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 20%, rgba(217,119,6,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <AnimateIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-6">
            CG Scheduler
          </p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-50 leading-[1.06] mb-6 max-w-3xl">
            Scheduling Built
            <br />
            <span className="text-zinc-500">for Your Brand.</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-20">
            Common Ground&apos;s appointment scheduling engine — fully branded,
            fully yours.
          </p>
        </AnimateIn>

        {/* Three value blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800/50 rounded-2xl overflow-hidden mb-24">
          <AnimateIn delay={0}>
            <div className="bg-zinc-900 p-10 flex flex-col gap-5 h-full">
              <div className="w-10 h-[3px] bg-amber-500" />
              <h3 className="text-xl font-bold text-zinc-50">
                A Scheduling Page That&apos;s Entirely Yours
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Whether you run a beauty studio, barbershop, personal training
                practice, tattoo parlor, or medical spa — CG Scheduler gives
                you a fully branded scheduling experience. Your colors. Your
                name. Your domain. Clients book through a page that looks and
                feels like it was built exclusively for you.
              </p>
              <p className="text-amber-500/80 text-sm font-medium mt-auto">
                Because it was.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="bg-zinc-900 p-10 flex flex-col gap-5 h-full">
              <div className="w-10 h-[3px] bg-amber-500" />
              <h3 className="text-xl font-bold text-zinc-50">
                The Toolbox
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Behind the scenes, your team gets a private dashboard for
                managing appointments, availability, staff, services, and
                customers — all in one place. No switching between apps. No
                chasing confirmations. Just clean, organized operations.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="bg-zinc-900 p-10 flex flex-col gap-5 h-full">
              <div className="w-10 h-[3px] bg-amber-500" />
              <h3 className="text-xl font-bold text-zinc-50">
                Your Own Branded App
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                For businesses ready to take the next step, CG Scheduler can
                power your own branded mobile app — giving your customers a
                seamless experience under your name, your logo, and your brand.
                Not ours. Yours.
              </p>
            </div>
          </AnimateIn>
        </div>

        {/* Closing statement */}
        <AnimateIn delay={100}>
          <div className="text-center flex flex-col items-center gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
                Your Website. Your Brand. Your App.
              </p>
              <p className="text-zinc-500 text-lg">
                Built with Purpose. Built on Common Ground. Built for You.
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-zinc-800" aria-hidden="true" />

            {/* Badge */}
            <CGMark size={80} color="white" className="opacity-60" />
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
