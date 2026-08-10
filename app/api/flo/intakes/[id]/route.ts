import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["new", "reviewed", "in_progress", "accepted", "declined"];

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

export async function PATCH(
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

  const { error } = await supabase
    .from("intake_submissions")
    .update({ status: body.status })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json({ success: true });
}
