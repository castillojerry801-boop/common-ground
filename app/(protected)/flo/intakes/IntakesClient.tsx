"use client";

import { useState } from "react";
import Link from "next/link";

type Intake = {
  id: string;
  created_at: string;
  status: "new" | "reviewed" | "in_progress" | "accepted" | "declined";
  business_name: string;
  industry: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  service_area: string | null;
  logo_url: string | null;
  goal_why: string | null;
  goal_success: string | null;
  goal_challenge: string | null;
  design_styles: string[];
  features: string[];
  custom_features: string | null;
  inspiration_love: string | null;
  inspiration_hate: string | null;
  competitors: string | null;
  photos_notes: string | null;
  photos_needed: string[];
  final_note: string | null;
};

const STATUS_STYLES: Record<Intake["status"], string> = {
  new: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  declined: "bg-zinc-800 text-zinc-500 border-zinc-700",
};

const STATUS_LABELS: Record<Intake["status"], string> = {
  new: "New",
  reviewed: "Reviewed",
  in_progress: "In Progress",
  accepted: "Accepted",
  declined: "Declined",
};

const STATUS_ORDER: Intake["status"][] = [
  "new",
  "reviewed",
  "in_progress",
  "accepted",
  "declined",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">
        {label}
      </p>
      <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/60 px-4 py-3 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
      {label}
    </span>
  );
}

function IntakeCard({ intake }: { intake: Intake }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<Intake["status"]>(intake.status);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(next: Intake["status"]) {
    setUpdating(true);
    try {
      await fetch(`/api/flo/intakes/${intake.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      setStatus(next);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      {/* Card header */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-4 px-6 py-5 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
            {intake.industry && (
              <span className="text-[11px] text-zinc-600">{intake.industry}</span>
            )}
          </div>
          <p className="text-base font-bold text-zinc-50 truncate">
            {intake.business_name}
          </p>
          <p className="text-sm text-zinc-500 mt-0.5">
            {intake.contact_name} · {intake.contact_email}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          <span className="text-xs text-zinc-600">
            {formatDate(intake.created_at)}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-600 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-zinc-800 px-6 py-6 space-y-5">
          {/* Status update */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={updating || s === status}
                  onClick={() => updateStatus(s)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    s === status
                      ? STATUS_STYLES[s]
                      : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                  } disabled:opacity-50`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {intake.contact_phone && (
              <Section label="Phone">{intake.contact_phone}</Section>
            )}
            {intake.service_area && (
              <Section label="Service Area">{intake.service_area}</Section>
            )}
            {intake.logo_url && (
              <Section label="Logo">
                <a
                  href={intake.logo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                >
                  View Logo →
                </a>
              </Section>
            )}
          </div>

          {/* Goals */}
          {(intake.goal_why || intake.goal_success || intake.goal_challenge) && (
            <div className="space-y-3">
              {intake.goal_why && (
                <Section label="Why They're Building">{intake.goal_why}</Section>
              )}
              {intake.goal_success && (
                <Section label="What Success Looks Like">{intake.goal_success}</Section>
              )}
              {intake.goal_challenge && (
                <Section label="Biggest Challenge">{intake.goal_challenge}</Section>
              )}
            </div>
          )}

          {/* Design + Features */}
          {intake.design_styles.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">
                Design Styles
              </p>
              <div className="flex flex-wrap gap-2">
                {intake.design_styles.map((s) => (
                  <Pill key={s} label={s} />
                ))}
              </div>
            </div>
          )}

          {intake.features.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">
                Features
              </p>
              <div className="flex flex-wrap gap-2">
                {intake.features.map((f) => (
                  <Pill key={f} label={f} />
                ))}
              </div>
            </div>
          )}

          {intake.custom_features && (
            <Section label="Custom Features">{intake.custom_features}</Section>
          )}

          {/* Inspiration */}
          {(intake.inspiration_love || intake.inspiration_hate || intake.competitors) && (
            <div className="space-y-3">
              {intake.inspiration_love && (
                <Section label="Sites They Love">{intake.inspiration_love}</Section>
              )}
              {intake.inspiration_hate && (
                <Section label="Sites They Dislike">{intake.inspiration_hate}</Section>
              )}
              {intake.competitors && (
                <Section label="Competitors">{intake.competitors}</Section>
              )}
            </div>
          )}

          {/* Photos */}
          {(intake.photos_needed.length > 0 || intake.photos_notes) && (
            <div className="space-y-3">
              {intake.photos_needed.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">
                    Media Available
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {intake.photos_needed.map((p) => (
                      <Pill key={p} label={p} />
                    ))}
                  </div>
                </div>
              )}
              {intake.photos_notes && (
                <Section label="Media Folder">
                  <a
                    href={intake.photos_notes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2 break-all"
                  >
                    {intake.photos_notes}
                  </a>
                </Section>
              )}
            </div>
          )}

          {/* Final note */}
          {intake.final_note && (
            <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600 mb-2">
                What They Want People to Remember
              </p>
              <p className="text-sm text-amber-200/80 leading-relaxed italic">
                &ldquo;{intake.final_note}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function IntakesClient({ intakes }: { intakes: Intake[] }) {
  const [filter, setFilter] = useState<Intake["status"] | "all">("all");

  const filtered =
    filter === "all" ? intakes : intakes.filter((i) => i.status === filter);

  const counts: Record<string, number> = { all: intakes.length };
  for (const i of intakes) {
    counts[i.status] = (counts[i.status] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/flo"
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
              FLO
            </p>
            <h1 className="text-lg font-bold text-zinc-50 leading-none">
              Client Intakes
            </h1>
          </div>
        </div>
        <a
          href="/intake"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
        >
          View Form
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {(["all", ...STATUS_ORDER] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                filter === s
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}{" "}
              <span className="opacity-60">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-700">
            <p className="text-sm">
              {filter === "all"
                ? "No intakes yet. Share the link at commonground.build/intake."
                : "No intakes with this status."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((intake) => (
              <IntakeCard key={intake.id} intake={intake} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
