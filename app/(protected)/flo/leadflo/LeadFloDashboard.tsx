"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  type Lead,
  type LeadStatus,
  STATUS_LABELS,
  STATUS_STYLES,
  ALL_STATUSES,
  scoreColor,
} from "@/lib/leadflo";

const STAT_STATUSES: { key: LeadStatus | "all"; label: string; color: string }[] = [
  { key: "all", label: "Total Leads", color: "text-zinc-300" },
  { key: "new", label: "New", color: "text-amber-400" },
  { key: "contacted", label: "Contacted", color: "text-blue-400" },
  { key: "follow_up", label: "Follow Up", color: "text-orange-400" },
  { key: "proposal_sent", label: "Proposal Sent", color: "text-cyan-400" },
  { key: "won", label: "Won", color: "text-emerald-400" },
  { key: "lost", label: "Lost", color: "text-zinc-500" },
];

function fmt(n: number | null) {
  if (n === null) return "—";
  return `$${n.toLocaleString()}`;
}

export default function LeadFloDashboard({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [industryFilter, setIndustryFilter] = useState("");

  const industries = useMemo(() => {
    const s = new Set(leads.map((l) => l.industry).filter(Boolean) as string[]);
    return Array.from(s).sort();
  }, [leads]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const l of leads) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (industryFilter && !l.industry?.toLowerCase().includes(industryFilter.toLowerCase())) return false;
      if (search && !l.business_name.toLowerCase().includes(search.toLowerCase()) &&
        !l.city?.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [leads, statusFilter, industryFilter, search]);

  const pipelineValue = useMemo(() => {
    return leads
      .filter((l) => !["won", "lost"].includes(l.status))
      .reduce((sum, l) => sum + (l.potential_project_value ?? 0), 0);
  }, [leads]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/flo" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">FLO</p>
            <h1 className="text-lg font-bold text-zinc-50 leading-none">LeadFlo</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/flo/leadflo/pipeline"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 border border-zinc-800 rounded-lg px-3 py-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
            </svg>
            Pipeline
          </Link>
          <Link
            href="/flo/leadflo/new"
            className="text-xs font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-colors rounded-lg px-3 py-1.5 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Lead
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAT_STATUSES.map(({ key, label, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`rounded-xl border p-4 text-left transition-all ${
                statusFilter === key
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              }`}
            >
              <p className={`text-2xl font-bold ${color}`}>{counts[key] ?? 0}</p>
              <p className="text-[11px] text-zinc-600 mt-1">{label}</p>
            </button>
          ))}
        </div>

        {/* Pipeline value */}
        {pipelineValue > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Active Pipeline Value</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">{fmt(pipelineValue)}</p>
            </div>
            <p className="text-xs text-zinc-600">Potential project value across all active leads</p>
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search business name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
          />
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 outline-none focus:border-zinc-600 transition-colors"
          >
            <option value="">All Industries</option>
            {industries.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
            className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 outline-none focus:border-zinc-600 transition-colors"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* Lead table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-700">
            <p className="text-sm">
              {leads.length === 0
                ? "No leads yet. Add your first lead to get started."
                : "No leads match your filters."}
            </p>
            {leads.length === 0 && (
              <Link href="/flo/leadflo/new" className="inline-block mt-4 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                Add your first lead →
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">Business</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 hidden md:table-cell">Industry</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 hidden lg:table-cell">Location</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 hidden sm:table-cell">Score</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 hidden lg:table-cell">Value</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 hidden sm:table-cell">Website</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-900/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <Link href={`/flo/leadflo/${lead.id}`} className="font-medium text-zinc-100 group-hover:text-white transition-colors">
                        {lead.business_name}
                      </Link>
                      {lead.owner_name && (
                        <p className="text-[11px] text-zinc-600 mt-0.5">{lead.owner_name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500 hidden md:table-cell">{lead.industry ?? "—"}</td>
                    <td className="px-4 py-3.5 text-zinc-500 hidden lg:table-cell">
                      {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`font-bold ${scoreColor(lead.opportunity_score)}`}>
                        {lead.opportunity_score ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500 hidden lg:table-cell">{fmt(lead.potential_project_value)}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      {lead.has_website ? (
                        <span className="text-emerald-500 text-xs">✓ Has site</span>
                      ) : lead.facebook_only ? (
                        <span className="text-blue-400 text-xs">Facebook only</span>
                      ) : (
                        <span className="text-amber-400 text-xs">No website</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link href={`/flo/leadflo/${lead.id}`} className="text-zinc-700 group-hover:text-zinc-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-zinc-800 px-5 py-3 bg-zinc-900/40">
              <p className="text-xs text-zinc-600">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
