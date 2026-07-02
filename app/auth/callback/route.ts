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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Preserve org context that was set by the branded login page
  const orgSlug =
    request.nextUrl.searchParams.get("org") ?? undefined;

  const destination = await resolveUserDestination(user.id, supabase, orgSlug);
  return NextResponse.redirect(new URL(destination, request.url));
}
