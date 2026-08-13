"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type Lead,
  type LeadNote,
  type LeadProposal,
  type LeadStatusHistory,
  type LeadStatus,
  STATUS_LABELS,
  STATUS_STYLES,
  ALL_STATUSES,
  scoreColor,
} from "@/lib/leadflo";

const NOTE_TYPE_LABELS = { note: "Note", call: "Call", email: "Email", meeting: "Meeting" };
const NOTE_TYPE_COLORS = {
  note: "text-zinc-400",
  call: "text-emerald-400",
  email: "text-blue-400",
  meeting: "text-purple-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmt(n: number | null) {
  if (n === null) return "—";
  return `$${n.toLocaleString()}`;
}

function ScoreRing({ score }: { score: number | null }) {
  if (score === null) return <div className="text-zinc-600 text-sm">Not scored</div>;
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#f59e0b" : "#71717a";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="48" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="22" fontWeight="700">
          {score}
        </text>
      </svg>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Opportunity Score</p>
    </div>
  );
}

export default function LeadDetail({
  lead: initialLead,
  notes: initialNotes,
  history,
  proposals: initialProposals,
}: {
  lead: Lead;
  notes: LeadNote[];
  history: LeadStatusHistory[];
  proposals: LeadProposal[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [notes, setNotes] = useState(initialNotes);
  const [proposals, setProposals] = useState(initialProposals);
  const [activeTab, setActiveTab] = useState<"notes" | "proposal" | "history">("notes");

  // Status
  const [statusLoading, setStatusLoading] = useState(false);

  // Note form
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<LeadNote["type"]>("note");
  const [noteLoading, setNoteLoading] = useState(false);

  // Proposal
  const [proposalLoading, setProposalLoading] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function changeStatus(status: LeadStatus) {
    setStatusLoading(true);
    const res = await fetch(`/api/flo/leads/${lead.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLead(updated);
    }
    setStatusLoading(false);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setNoteLoading(true);
    const res = await fetch(`/api/flo/leads/${lead.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent.trim(), type: noteType }),
    });
    if (res.ok) {
      const note = await res.json();
      setNotes([note, ...notes]);
      setNoteContent("");
    }
    setNoteLoading(false);
  }

  async function generateProposal() {
    setProposalLoading(true);
    const res = await fetch(`/api/flo/leads/${lead.id}/proposal`, { method: "POST" });
    if (res.ok) {
      const proposal = await res.json();
      setProposals([proposal, ...proposals]);
      setActiveTab("proposal");
    }
    setProposalLoading(false);
  }

  async function deleteLead() {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    await fetch(`/api/flo/leads/${lead.id}`, { method: "DELETE" });
    router.push("/flo/leadflo");
  }

  const latestProposal = proposals[0] ?? null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/flo/leadflo" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">LeadFlo</p>
            <h1 className="text-lg font-bold text-zinc-50 leading-none truncate max-w-xs">{lead.business_name}</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={deleteLead}
          className={`text-xs font-medium transition-colors ${deleteConfirm ? "text-red-400 hover:text-red-300" : "text-zinc-700 hover:text-zinc-500"}`}
        >
          {deleteConfirm ? "Confirm Delete" : "Delete"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score + Status */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <ScoreRing score={lead.opportunity_score} />
              <div className="flex-1 space-y-4">
                {lead.opportunity_reasons && lead.opportunity_reasons.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">Why This Score</p>
                    <ul className="space-y-1">
                      {lead.opportunity_reasons.map((r, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">Move to Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={statusLoading || s === lead.status}
                        onClick={() => changeStatus(s)}
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                          s === lead.status ? STATUS_STYLES[s] : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                        } disabled:opacity-50`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Business Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ["Industry", lead.industry],
                  ["Owner", lead.owner_name],
                  ["Phone", lead.phone],
                  ["Email", lead.email],
                  ["Address", lead.address],
                  ["City", lead.city],
                  ["State", lead.state],
                  ["ZIP", lead.zip],
                ].map(([label, value]) => value ? (
                  <div key={label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-0.5">{label}</p>
                    <p className="text-zinc-300">{value}</p>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* Web Presence */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Web Presence</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Website", value: lead.has_website ? "Yes" : "No", positive: lead.has_website },
                  { label: "SSL", value: lead.website_has_ssl === null ? "—" : lead.website_has_ssl ? "Yes" : "No", positive: lead.website_has_ssl === true },
                  { label: "Mobile", value: lead.website_mobile_friendly === null ? "—" : lead.website_mobile_friendly ? "Yes" : "No", positive: lead.website_mobile_friendly === true },
                  { label: "FB Only", value: lead.facebook_only ? "Yes" : "No", positive: !lead.facebook_only },
                ].map(({ label, value, positive }) => (
                  <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">{label}</p>
                    <p className={`text-sm font-bold ${value === "—" ? "text-zinc-600" : positive ? "text-emerald-400" : "text-red-400"}`}>{value}</p>
                  </div>
                ))}
              </div>
              {lead.website && (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  {lead.website}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
              {lead.google_maps_url && (
                <a href={lead.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                  View on Google Maps
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </a>
              )}
            </div>

            {/* Financial */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Estimated Value</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">Project</p>
                  <p className="text-xl font-bold text-emerald-400">{fmt(lead.potential_project_value)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">Monthly</p>
                  <p className="text-xl font-bold text-zinc-300">{fmt(lead.monthly_maintenance_value)}/mo</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">Lifetime</p>
                  <p className="text-xl font-bold text-amber-400">{fmt(lead.lifetime_value_estimate)}</p>
                </div>
              </div>
            </div>

            {lead.notes && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-2">General Notes</p>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Right: Activity */}
          <div className="space-y-4">
            {/* Google */}
            {(lead.google_rating || lead.google_review_count) && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">{lead.google_rating ?? "—"}</p>
                  <p className="text-[10px] text-zinc-600">Rating</p>
                </div>
                <div className="border-l border-zinc-800 pl-4">
                  <p className="text-lg font-bold text-zinc-300">{lead.google_review_count ?? "—"}</p>
                  <p className="text-[10px] text-zinc-600">Reviews</p>
                </div>
              </div>
            )}

            {/* Generate proposal */}
            <button
              type="button"
              onClick={generateProposal}
              disabled={proposalLoading}
              className="w-full rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 p-5 text-left transition-colors disabled:opacity-60"
            >
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                {proposalLoading ? "Generating…" : "Generate Proposal"}
              </p>
              <p className="text-[11px] text-zinc-600">
                {proposals.length > 0 ? "Generate a new proposal with AI" : "One-click AI proposal generation"}
              </p>
            </button>

            {/* Tabs */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <div className="flex border-b border-zinc-800">
                {(["notes", "proposal", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === tab ? "text-amber-400 border-b-2 border-amber-500" : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {tab === "notes" ? `Notes (${notes.length})` : tab === "proposal" ? "Proposal" : "History"}
                  </button>
                ))}
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {/* Notes tab */}
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <form onSubmit={addNote} className="space-y-2">
                      <div className="flex gap-1.5">
                        {(["note", "call", "email", "meeting"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNoteType(t)}
                            className={`flex-1 rounded-lg py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                              noteType === t ? `${NOTE_TYPE_COLORS[t]} border border-current bg-current/10` : "text-zinc-700 border border-zinc-800"
                            }`}
                          >
                            {NOTE_TYPE_LABELS[t]}
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-500 resize-none min-h-[70px] transition-colors"
                        placeholder={`Add a ${noteType}…`}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={noteLoading || !noteContent.trim()}
                        className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-xs font-semibold py-2 transition-colors"
                      >
                        {noteLoading ? "Saving…" : "Add"}
                      </button>
                    </form>

                    {notes.length === 0 ? (
                      <p className="text-xs text-zinc-700 text-center py-4">No notes yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <div key={note.id} className="border-l-2 border-zinc-800 pl-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-semibold uppercase tracking-wider ${NOTE_TYPE_COLORS[note.type]}`}>
                                {NOTE_TYPE_LABELS[note.type]}
                              </span>
                              <span className="text-[10px] text-zinc-700">{formatDate(note.created_at)}</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Proposal tab */}
                {activeTab === "proposal" && (
                  <div className="space-y-4">
                    {!latestProposal ? (
                      <p className="text-xs text-zinc-700 text-center py-4">No proposal yet. Generate one above.</p>
                    ) : (
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">Cover Letter</p>
                          <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{latestProposal.cover_letter}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">Proposal</p>
                          <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{latestProposal.proposal_body}</p>
                        </div>
                        {latestProposal.estimated_price && (
                          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-0.5">Estimated Price</p>
                            <p className="text-xl font-bold text-emerald-400">{fmt(latestProposal.estimated_price)}</p>
                          </div>
                        )}
                        {latestProposal.timeline && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">Timeline</p>
                            <p className="text-xs text-zinc-400">{latestProposal.timeline}</p>
                          </div>
                        )}
                        {latestProposal.maintenance_plan && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">Maintenance Plan</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{latestProposal.maintenance_plan}</p>
                          </div>
                        )}
                        {latestProposal.hosting_plan && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-1">Hosting Plan</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{latestProposal.hosting_plan}</p>
                          </div>
                        )}
                        <p className="text-[10px] text-zinc-700">Generated {formatDate(latestProposal.created_at)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* History tab */}
                {activeTab === "history" && (
                  <div className="space-y-3">
                    {history.length === 0 ? (
                      <p className="text-xs text-zinc-700 text-center py-4">No history yet.</p>
                    ) : (
                      history.map((h) => (
                        <div key={h.id} className="flex items-start gap-2 text-xs">
                          <span className="text-zinc-700 mt-0.5 shrink-0">{formatDate(h.created_at)}</span>
                          <span className="text-zinc-500">
                            {h.from_status ? (
                              <>{STATUS_LABELS[h.from_status as LeadStatus] ?? h.from_status} → <span className="text-zinc-300">{STATUS_LABELS[h.to_status as LeadStatus] ?? h.to_status}</span></>
                            ) : (
                              <>Lead created as <span className="text-zinc-300">{STATUS_LABELS[h.to_status as LeadStatus] ?? h.to_status}</span></>
                            )}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
