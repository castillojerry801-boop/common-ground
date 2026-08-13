import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/leadflo";

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "follow_up",
  "meeting_scheduled",
  "proposal_sent",
  "won",
  "lost",
];

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body?.status || !VALID_STATUSES.includes(body.status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { data: lead } = await supabase
    .from("leads")
    .select("status")
    .eq("id", id)
    .single();

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: updated }, ] = await Promise.all([
    supabase
      .from("leads")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single(),
    supabase.from("lead_status_history").insert({
      lead_id: id,
      from_status: lead.status,
      to_status: body.status,
      notes: body.notes ?? null,
    }),
  ]);

  return NextResponse.json(updated);
}
