export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "meeting_scheduled"
  | "proposal_sent"
  | "won"
  | "lost";

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string;
  industry: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  website: string | null;
  google_place_id: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  has_website: boolean;
  website_has_ssl: boolean | null;
  website_mobile_friendly: boolean | null;
  website_score: number | null;
  facebook_only: boolean;
  status: LeadStatus;
  opportunity_score: number | null;
  opportunity_reasons: string[];
  potential_project_value: number | null;
  monthly_maintenance_value: number | null;
  lifetime_value_estimate: number | null;
  intake_submission_id: string | null;
  source: string;
  notes: string | null;
};

export type LeadNote = {
  id: string;
  created_at: string;
  lead_id: string;
  content: string;
  type: "note" | "call" | "email" | "meeting";
};

export type LeadProposal = {
  id: string;
  created_at: string;
  lead_id: string;
  cover_letter: string | null;
  proposal_body: string | null;
  estimated_price: number | null;
  timeline: string | null;
  maintenance_plan: string | null;
  hosting_plan: string | null;
  status: "draft" | "sent" | "accepted" | "declined";
};

export type LeadStatusHistory = {
  id: string;
  created_at: string;
  lead_id: string;
  from_status: string | null;
  to_status: string;
  notes: string | null;
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow Up",
  meeting_scheduled: "Meeting Scheduled",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  follow_up: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  meeting_scheduled: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  proposal_sent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-zinc-800 text-zinc-500 border-zinc-700",
};

export const ALL_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "follow_up",
  "meeting_scheduled",
  "proposal_sent",
  "won",
  "lost",
];

export function computeOpportunityScore(data: {
  has_website?: boolean | null;
  website_has_ssl?: boolean | null;
  website_mobile_friendly?: boolean | null;
  website_score?: number | null;
  facebook_only?: boolean | null;
  google_review_count?: number | null;
  google_rating?: number | null;
}): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (!data.has_website) {
    score += 40;
    reasons.push(
      "No website — major opportunity to establish a professional online presence"
    );
  } else {
    if (data.website_has_ssl === false) {
      score += 15;
      reasons.push(
        "Website lacks SSL — security and trust upgrade needed"
      );
    }
    if (data.website_mobile_friendly === false) {
      score += 10;
      reasons.push(
        "Not mobile-friendly — most customers browse on phones"
      );
    }
    if (
      data.website_score !== null &&
      data.website_score !== undefined &&
      data.website_score < 50
    ) {
      score += 25;
      reasons.push(
        "Low website quality score — strong redesign opportunity"
      );
    }
  }

  if (data.facebook_only) {
    score += 15;
    reasons.push(
      "Facebook-only presence — no owned web property, vulnerable to platform changes"
    );
  }

  if (data.google_review_count && data.google_review_count >= 50) {
    score += 10;
    reasons.push(
      `Strong Google presence (${data.google_review_count} reviews) — proven reputation worth showcasing`
    );
  }

  if (data.google_rating && data.google_rating >= 4.0) {
    score += 5;
    reasons.push(
      `High Google rating (${data.google_rating}★) — credibility worth promoting`
    );
  }

  return { score: Math.min(score, 100), reasons };
}

export function scoreColor(score: number | null): string {
  if (score === null) return "text-zinc-600";
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-zinc-500";
}
