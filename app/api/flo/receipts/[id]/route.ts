import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function platformAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      supabase,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  const { data: m } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .is("organization_id", null)
    .single();
  if (!m || !["owner", "employee"].includes(m.role))
    return {
      supabase,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  return { supabase, error: null };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error } = await platformAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (body.status) updates.status = body.status;
  if (body.status === "paid") updates.paid_date = new Date().toISOString().split("T")[0];
  if (body.status === "sent") updates.paid_date = null;

  const { error: dbError } = await supabase
    .from("receipts")
    .update(updates)
    .eq("id", id);

  if (dbError)
    return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error } = await platformAuth();
  if (error) return error;

  const { id } = await params;
  const { error: dbError } = await supabase
    .from("receipts")
    .delete()
    .eq("id", id);

  if (dbError)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
