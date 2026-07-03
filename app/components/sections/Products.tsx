import AnimateIn from "@/app/components/ui/AnimateIn";

const products = [
  {
    icon: "🏀",
    name: "GameFloHQ",
    tagline: "Youth Sports Operating System",
    description:
      "Everything a youth sports organization needs to run — scheduling, rosters, payments, and communication — in one place.",
    available: true,
    href: "#",
  },
  {
    icon: "💇",
    name: "BeautyBook",
    tagline: "Beauty Business Operating System",
    description:
      "Built for the modern beauty professional. Booking, client management, and payments without the chaos.",
    available: true,
    href: "#",
  },
  {
    icon: null,
    name: "More Coming",
    tagline: "Expanding the Portfolio",
    description:
      "We're building purpose-driven software for more professions. Every platform begins with listening first.",
    available: false,
    href: null,
  },
];

export default function Products() {
  return (
    <section id="products" className="bg-white dark:bg-zinc-950 py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimateIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 mb-6">
            Our Products
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-5 max-w-2xl">
            One Platform for Every Profession
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mb-20 leading-relaxed">
            Each product is built from the ground up for a specific profession —
            with the people who use it every single day.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <AnimateIn key={product.name} delay={i * 100} className="h-full">
              <div
                className={`relative rounded-2xl border flex flex-col gap-6 h-full transition-all duration-300 group overflow-hidden ${
                  product.available
                    ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-100/50 dark:hover:shadow-zinc-900/50"
                    : "border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
                }`}
              >
                {/* Amber accent stripe */}
                {product.available && (
                  <div className="h-[3px] w-full bg-gradient-to-r from-amber-500 to-amber-400/60 flex-shrink-0" />
                )}
                <div className={`flex flex-col gap-6 flex-1 px-8 pb-8 ${product.available ? "" : "pt-8"}`}>
                  <div className="text-4xl leading-none">
                    {product.icon ? (
                      <span role="img" aria-label={product.name}>
                        {product.icon}
                      </span>
                    ) : (
                      <div className="w-11 h-11 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xl font-light">
                        +
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      {product.tagline}
                    </p>
                    <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1.5">
                      {product.description}
                    </p>
                  </div>

                  {product.available && product.href ? (
                    <a
                      href={product.href}
                      className="text-sm font-medium text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-150"
                    >
                      Learn more
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
