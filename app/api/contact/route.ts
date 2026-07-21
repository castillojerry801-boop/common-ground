import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUSINESS_TYPES = [
  "salon_spa_beauty",
  "trainer_coach",
  "youth_sports",
  "restaurant_bar_catering",
  "contractor_home_service",
  "retail_local_shop",
  "nonprofit_community",
  "event_camp_clinic",
  "other",
];

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip verification in dev if key not set

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined }),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // Honeypot check — bots fill this in, humans never see it
  if (body.honeypot) {
    return NextResponse.json({ success: true }); // silently discard
  }

  // Turnstile verification
  const siteKeyConfigured = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (siteKeyConfigured) {
    const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");
    const valid = await verifyTurnstile(body.turnstile_token ?? "", ip);
    if (!valid) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
    }
  }

  const { full_name, business_name, email, phone, business_type, business_description, looking_for, notes } = body;

  if (!full_name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!business_name?.trim())
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  if (!BUSINESS_TYPES.includes(business_type))
    return NextResponse.json({ error: "Business type is required" }, { status: 400 });
  if (!looking_for?.trim())
    return NextResponse.json({ error: "Please tell us what you're looking for" }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    full_name: full_name.trim(),
    business_name: business_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    business_type,
    business_description: business_description?.trim() || null,
    looking_for: looking_for.trim(),
    notes: notes?.trim() || null,
  });

  if (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
