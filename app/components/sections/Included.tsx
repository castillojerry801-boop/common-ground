import AnimateIn from "@/app/components/ui/AnimateIn";

const foundation = [
  "Domain registration",
  "Domain DNS verification",
  "Business email setup",
  "Google Business Profile ownership",
  "Website deployment",
  "Professional contact information",
];

const optional = [
  "Appointment scheduling setup",
  "Branded mobile app",
  "AI Assistant",
];

function CheckIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 mt-0.5 ${muted ? "text-zinc-600" : "text-amber-500"}`}
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

export default function Included() {
  return (
    <section className="bg-zinc-950 py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimateIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-6">
            What&apos;s Included
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-tight mb-5 max-w-2xl">
            Everything your business needs — from your first website to your full online presence.
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mb-20 leading-relaxed">
            We handle the full setup so you can focus on running your business.
            Every website engagement starts with the foundation. Add what you need from there.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Foundation */}
          <AnimateIn delay={100}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-6">
                Foundation
              </p>
              <ul className="flex flex-col gap-4">
                {foundation.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-base text-zinc-200 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          {/* Optional */}
          <AnimateIn delay={200}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-6">
                Optional Add-Ons
              </p>
              <ul className="flex flex-col gap-4">
                {optional.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon muted />
                    <span className="text-base text-zinc-400 leading-snug">
                      {item}
                      <span className="ml-2 inline-flex items-center rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                        Optional
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
