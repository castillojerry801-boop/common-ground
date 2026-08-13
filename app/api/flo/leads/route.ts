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

export async function GET(request: NextRequest) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const industry = searchParams.get("industry");

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (industry) query = query.ilike("industry", `%${industry}%`);
  if (search) query = query.ilike("business_name", `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?.business_name?.trim())
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });

  const { score, reasons } = computeOpportunityScore({
    has_website: body.has_website,
    website_has_ssl: body.website_has_ssl,
    website_mobile_friendly: body.website_mobile_friendly,
    website_score: body.website_score,
    facebook_only: body.facebook_only,
    google_review_count: body.google_review_count,
    google_rating: body.google_rating,
  });

  const projectValue = score >= 70 ? 1200 : 900;
  const monthly = 50;

  const { data, error } = await supabase
    .from("leads")
    .insert({
      business_name: body.business_name.trim(),
      industry: body.industry?.trim() || null,
      owner_name: body.owner_name?.trim() || null,
      phone: body.phone?.trim() || null,
      email: body.email?.trim() || null,
      address: body.address?.trim() || null,
      city: body.city?.trim() || null,
      state: body.state?.trim() || null,
      zip: body.zip?.trim() || null,
      website: body.website?.trim() || null,
      google_rating: body.google_rating ?? null,
      google_review_count: body.google_review_count ?? null,
      google_maps_url: body.google_maps_url?.trim() || null,
      facebook_url: body.facebook_url?.trim() || null,
      instagram_url: body.instagram_url?.trim() || null,
      has_website: body.has_website ?? false,
      website_has_ssl: body.website_has_ssl ?? null,
      website_mobile_friendly: body.website_mobile_friendly ?? null,
      facebook_only: body.facebook_only ?? false,
      source: body.source ?? "manual",
      notes: body.notes?.trim() || null,
      opportunity_score: score,
      opportunity_reasons: reasons,
      potential_project_value: body.potential_project_value ?? projectValue,
      monthly_maintenance_value: body.monthly_maintenance_value ?? monthly,
      lifetime_value_estimate:
        body.lifetime_value_estimate ?? projectValue + monthly * 24,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Record initial status in history
  await supabase.from("lead_status_history").insert({
    lead_id: data.id,
    from_status: null,
    to_status: "new",
  });

  return NextResponse.json(data, { status: 201 });
}
