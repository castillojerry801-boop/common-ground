"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CGLogoHorizontal } from "@/app/components/ui/CGMark";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80"
          : ""
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-zinc-950 dark:text-zinc-50">
          <CGLogoHorizontal size={34} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors duration-150"
          >
            Get in Touch
          </a>
          <Link
            href="/login"
            className="text-sm font-medium px-5 py-2 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors duration-150"
          >
            Open Your Toolbox
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-500 dark:text-zinc-400 p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                d="M2 2l12 12M2 14L14 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                d="M1 4h14M1 8h14M1 12h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-zinc-600 dark:text-zinc-300"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm text-zinc-600 dark:text-zinc-300"
            onClick={() => setMenuOpen(false)}
          >
            Get in Touch
          </a>
          <Link
            href="/login"
            className="text-sm font-medium px-5 py-2.5 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-center"
            onClick={() => setMenuOpen(false)}
          >
            Open Your Toolbox
          </Link>
        </div>
      )}
    </header>
  );
}
