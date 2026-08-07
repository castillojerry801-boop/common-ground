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

export async function POST(request: NextRequest) {
  const { supabase, error } = await platformAuth();
  if (error) return error;

  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const {
    client_name,
    client_email,
    org_id,
    items,
    notes,
    status,
    issued_date,
    due_date,
  } = body;

  if (!client_name?.trim())
    return NextResponse.json({ error: "Client name required" }, { status: 400 });

  const { count } = await supabase
    .from("receipts")
    .select("*", { count: "exact", head: true });

  const year = new Date().getFullYear();
  const receipt_number = `CG-${year}-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const lineItems = (items ?? []) as { description: string; amount: string }[];
  const subtotal = lineItems.reduce(
    (s, item) => s + (parseFloat(item.amount) || 0),
    0
  );

  const { data: receipt, error: dbError } = await supabase
    .from("receipts")
    .insert({
      receipt_number,
      client_name: client_name.trim(),
      client_email: client_email?.trim() || null,
      org_id: org_id || null,
      items: lineItems,
      subtotal,
      tax_rate: 0,
      tax_amount: 0,
      total: subtotal,
      status: status ?? "draft",
      notes: notes?.trim() || null,
      issued_date: issued_date || new Date().toISOString().split("T")[0],
      due_date: due_date || null,
    })
    .select()
    .single();

  if (dbError) {
    console.error(dbError);
    return NextResponse.json(
      { error: "Failed to save receipt" },
      { status: 500 }
    );
  }

  return NextResponse.json({ receipt });
}
