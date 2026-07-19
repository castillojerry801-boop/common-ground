"use client";

import { useState } from "react";
import Link from "next/link";
import { CGMedallion } from "@/app/components/ui/CGMark";
import type { ToolboxTemplate } from "@/data/toolbox-data";

interface ToolboxClientProps {
  templates: ToolboxTemplate[];
}

function CopyButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
        copied
          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
          : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy Prompt
        </>
      )}
    </button>
  );
}

function TemplateCard({ template }: { template: ToolboxTemplate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
      <div className="px-5 py-4 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100">{template.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{template.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {template.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[10px] text-zinc-600 bg-zinc-800/60 border border-zinc-700/40 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-2 rounded-lg hover:bg-zinc-800/40"
            title={expanded ? "Hide prompt" : "Preview prompt"}
          >
            <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <CopyButton prompt={template.prompt} />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800/60 px-5 py-4">
          <pre className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {template.prompt}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ToolboxClient({ templates }: ToolboxClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "website-build" | "module">("all");

  const filtered = templates.filter((t) => {
    const matchesFilter = filter === "all" || t.category === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q));
    return matchesFilter && matchesSearch;
  });

  const websiteBuilds = filtered.filter((t) => t.category === "website-build");
  const modules = filtered.filter((t) => t.category === "module");

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <CGMedallion size={26} color="#f59e0b" />
          <div className="w-px h-5 bg-zinc-700" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Toolbox</span>
        </div>
        <Link
          href="/flo"
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to FLO
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

          {/* Intro + Search */}
          <div className="space-y-4">
            <div>
              <h1 className="text-lg font-bold text-zinc-100">Prompt Library</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Find the template you need, copy the prompt, and paste it into Claude to start a new build.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search templates…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
              <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
                {(["all", "website-build", "module"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      filter === f
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/40"
                    }`}
                  >
                    {f === "all" ? "All" : f === "website-build" ? "Website Builds" : "Modules"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Website Build Templates */}
          {websiteBuilds.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Website Build Templates
                </p>
                <span className="text-[10px] text-zinc-700 bg-zinc-800/60 px-2 py-0.5 rounded-full">
                  {websiteBuilds.length}
                </span>
              </div>
              <div className="space-y-3">
                {websiteBuilds.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            </section>
          )}

          {/* Modules */}
          {modules.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Modules
                </p>
                <span className="text-[10px] text-zinc-700 bg-zinc-800/60 px-2 py-0.5 rounded-full">
                  {modules.length}
                </span>
              </div>
              <div className="space-y-3">
                {modules.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-600 text-sm">No templates match &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="mt-3 text-xs text-amber-500 hover:text-amber-400 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
