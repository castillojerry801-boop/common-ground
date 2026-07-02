import { createClient } from "@/lib/supabase/server";
import { resolveUserDestination } from "@/lib/auth/resolve-destination";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Central post-auth routing hub.
 *
 * Reads optional ?org= param to support branded logins on business sites.
 * When present, routing is contextualized to that business. Without it,
 * the user's primary platform role determines their destination.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  // Exchange the code Supabase puts in the URL after email confirmation / magic link
  const code = searchParams.get("code");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const orgSlug = searchParams.get("org") ?? undefined;

  const destination = await resolveUserDestination(user.id, supabase, orgSlug);
  return NextResponse.redirect(new URL(destination, request.url));
}
