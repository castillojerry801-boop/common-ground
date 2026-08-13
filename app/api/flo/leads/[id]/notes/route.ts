import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  if (!body?.content?.trim())
    return NextResponse.json({ error: "Content is required" }, { status: 400 });

  const validTypes = ["note", "call", "email", "meeting"];
  const type = validTypes.includes(body.type) ? body.type : "note";

  const { data, error } = await supabase
    .from("lead_notes")
    .insert({ lead_id: id, content: body.content.trim(), type })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
