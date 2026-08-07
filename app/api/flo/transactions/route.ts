import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_TYPES = ["expense", "income"];
const VALID_CATEGORIES = [
  "hosting",
  "domain",
  "software",
  "subscriptions",
  "equipment",
  "services",
  "other",
];

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

  const { type, date, description, amount, vendor, category, notes } = body;

  if (!description?.trim())
    return NextResponse.json(
      { error: "Description required" },
      { status: 400 }
    );
  if (!amount || isNaN(parseFloat(amount)))
    return NextResponse.json({ error: "Valid amount required" }, { status: 400 });
  if (!VALID_TYPES.includes(type))
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const { data: transaction, error: dbError } = await supabase
    .from("transactions")
    .insert({
      type,
      date: date || new Date().toISOString().split("T")[0],
      description: description.trim(),
      amount: parseFloat(amount),
      vendor: vendor?.trim() || null,
      category: VALID_CATEGORIES.includes(category) ? category : "other",
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (dbError) {
    console.error(dbError);
    return NextResponse.json(
      { error: "Failed to save transaction" },
      { status: 500 }
    );
  }

  return NextResponse.json({ transaction });
}
