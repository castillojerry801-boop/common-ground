"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type Lead,
  type LeadStatus,
  STATUS_LABELS,
  STATUS_STYLES,
  ALL_STATUSES,
  scoreColor,
} from "@/lib/leadflo";

const COLUMN_COLORS: Record<LeadStatus, string> = {
  new: "border-amber-500/30",
  contacted: "border-blue-500/30",
  follow_up: "border-orange-500/30",
  meeting_scheduled: "border-purple-500/30",
  proposal_sent: "border-cyan-500/30",
  won: "border-emerald-500/30",
  lost: "border-zinc-700",
};

function LeadCard({ lead, onMove }: { lead: Lead; onMove: (id: string, status: LeadStatus) => void }) {
  const [moving, setMoving] = useState(false);
  const [showMove, setShowMove] = useState(false);

  async function move(status: LeadStatus) {
    setMoving(true);
    await fetch(`/api/flo/leads/${lead.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onMove(lead.id, status);
    setMoving(false);
    setShowMove(false);
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <Link href={`/flo/leadflo/${lead.id}`} className="block">
        <p className="text-sm font-semibold text-zinc-100 hover:text-white transition-colors leading-snug">
          {lead.business_name}
        </p>
        {lead.industry && <p className="text-[11px] text-zinc-600 mt-0.5">{lead.industry}</p>}
      </Link>

      <div className="flex items-center justify-between">
        {lead.opportunity_score !== null && (
          <span className={`text-sm font-bold ${scoreColor(lead.opportunity_score)}`}>
            {lead.opportunity_score}
            <span className="text-[10px] text-zinc-700 font-normal"> /100</span>
          </span>
        )}
        {lead.city && (
          <span className="text-[11px] text-zinc-700">{lead.city}, {lead.state}</span>
        )}
      </div>

      {lead.potential_project_value && (
        <p className="text-[11px] text-zinc-600">
          Est. ${lead.potential_project_value.toLocaleString()}
        </p>
      )}

      <button
        type="button"
        onClick={() => setShowMove(!showMove)}
        className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 hover:text-zinc-500 transition-colors"
      >
        {moving ? "Moving…" : "Move to →"}
      </button>

      {showMove && (
        <div className="flex flex-col gap-1">
          {ALL_STATUSES.filter((s) => s !== lead.status).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => move(s)}
              className={`rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-left transition-all hover:opacity-80 ${STATUS_STYLES[s]}`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Pipeline({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);

  function moveCard(id: string, newStatus: LeadStatus) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
  }

  const byStatus = ALL_STATUSES.reduce<Record<LeadStatus, Lead[]>>((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/flo/leadflo" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">LeadFlo</p>
            <h1 className="text-lg font-bold text-zinc-50 leading-none">Pipeline</h1>
          </div>
        </div>
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

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max h-full items-start">
          {ALL_STATUSES.map((status) => {
            const col = byStatus[status];
            return (
              <div key={status} className="w-64 flex flex-col gap-3">
                <div className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${COLUMN_COLORS[status]} bg-zinc-900/40`}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {STATUS_LABELS[status]}
                  </p>
                  <span className="text-[11px] font-bold text-zinc-600">{col.length}</span>
                </div>
                {col.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-800 py-8 text-center">
                    <p className="text-[11px] text-zinc-700">Empty</p>
                  </div>
                ) : (
                  col.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onMove={moveCard} />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
