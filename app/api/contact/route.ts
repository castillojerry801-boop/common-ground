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

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

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
