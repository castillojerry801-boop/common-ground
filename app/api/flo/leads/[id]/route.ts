import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeOpportunityScore } from "@/lib/leadflo";

async function platformAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: m } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .is("organization_id", null)
    .single();
  if (!m || !["owner", "employee"].includes(m.role)) return null;
  return supabase;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const [{ data: lead }, { data: notes }, { data: history }, { data: proposals }] =
    await Promise.all([
      supabase.from("leads").select("*").eq("id", id).single(),
      supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("lead_status_history")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("lead_proposals")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ lead, notes: notes ?? [], history: history ?? [], proposals: proposals ?? [] });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const scoreFields = [
    "has_website",
    "website_has_ssl",
    "website_mobile_friendly",
    "website_score",
    "facebook_only",
    "google_review_count",
    "google_rating",
  ];
  const needsRescore = scoreFields.some((f) => f in body);

  let updates = { ...body, updated_at: new Date().toISOString() };

  if (needsRescore) {
    const { data: existing } = await supabase
      .from("leads")
      .select(scoreFields.join(","))
      .eq("id", id)
      .single();

    const merged = Object.assign({}, existing ?? {}, body);
    const { score, reasons } = computeOpportunityScore(merged);
    updates = { ...updates, opportunity_score: score, opportunity_reasons: reasons };
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
