import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await platformAuth();
  if (!supabase)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const websiteStatus = lead.has_website
    ? `Has website: ${lead.website ?? "unknown URL"}${lead.website_has_ssl === false ? " (no SSL)" : ""}${lead.website_mobile_friendly === false ? " (not mobile-friendly)" : ""}`
    : "No website";

  const prompt = `You are writing a professional website proposal on behalf of Common Ground Workshop, a custom web design agency based in Utah.

Lead Information:
- Business: ${lead.business_name}
- Industry: ${lead.industry ?? "Not specified"}
- Location: ${[lead.city, lead.state].filter(Boolean).join(", ") || "Not specified"}
- Owner: ${lead.owner_name ?? "Not specified"}
- Website Status: ${websiteStatus}
- Google Rating: ${lead.google_rating ?? "Unknown"} (${lead.google_review_count ?? 0} reviews)
- Facebook Only: ${lead.facebook_only ? "Yes" : "No"}
- Opportunity Score: ${lead.opportunity_score ?? "N/A"}/100
- Opportunity Reasons: ${(lead.opportunity_reasons ?? []).join("; ") || "None listed"}

Write a professional proposal in JSON format with exactly these keys:
{
  "cover_letter": "A warm, confident 2-paragraph cover letter addressing the business owner by name if known, referencing specifics about their business and why a professional website will help them grow. Do not use placeholders.",
  "proposal_body": "A detailed 3-4 paragraph proposal describing what Common Ground Workshop will build, why it matters for this specific business, what pages and features will be included, and how it will improve their online presence. Be specific to their industry.",
  "estimated_price": 950,
  "timeline": "3-4 weeks",
  "maintenance_plan": "A paragraph describing the annual renewal and monthly care plan — domain renewal, SSL, hosting, uptime monitoring, and support.",
  "hosting_plan": "A paragraph describing managed hosting — fast, reliable, professionally maintained, with SSL included."
}

Respond with only valid JSON, no markdown, no explanation.`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const { data, error } = await supabase
      .from("lead_proposals")
      .insert({
        lead_id: id,
        cover_letter: parsed.cover_letter ?? null,
        proposal_body: parsed.proposal_body ?? null,
        estimated_price: typeof parsed.estimated_price === "number" ? parsed.estimated_price : null,
        timeline: parsed.timeline ?? null,
        maintenance_plan: parsed.maintenance_plan ?? null,
        hosting_plan: parsed.hosting_plan ?? null,
        status: "draft",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Proposal generation error:", err);
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 });
  }
}
