export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Common Ground Workshop
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            We build with purpose.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <nav className="flex items-center gap-6" aria-label="Footer">
            <a
              href="#products"
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Products
            </a>
            <a
              href="#philosophy"
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Philosophy
            </a>
            <a
              href="#contact"
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Contact
            </a>
            <a
              href="mailto:support@cg-workshop.com"
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              support@cg-workshop.com
            </a>
            <a
              href="tel:+18012001605"
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              +1 (801) 200-1605
            </a>
          </nav>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {year} Common Ground Workshop
          </p>
        </div>
      </div>
    </footer>
  );
}
