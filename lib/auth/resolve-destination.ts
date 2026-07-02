import type { SupabaseClient } from "@supabase/supabase-js";
import type { Role } from "@/types/supabase";

interface MembershipRow {
  role: Role;
  organization: { slug: string } | null;
}

/**
 * Determines where to send a user after authentication.
 *
 * Resolution order:
 *  1. Platform-level role (owner/employee) → always FLO, regardless of context.
 *  2. Org context provided (branded login) → route within that org.
 *  3. No org context → use the user's earliest org membership.
 *  4. No membership found → login error.
 *
 * This single function handles all three entry points:
 *  - commonground.com/login  (no org context)
 *  - commonground.com/login/[org]  (org slug as context)
 *  - elevatedbeauty.com/login  (middleware resolves domain → org slug)
 */
export async function resolveUserDestination(
  userId: string,
  supabase: SupabaseClient,
  contextOrgSlug?: string
): Promise<string> {
  // ── Step 1: Platform roles always win ──────────────────────────────────
  const { data: platformMembership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", userId)
    .is("organization_id", null)
    .single();

  if (platformMembership?.role === "owner" || platformMembership?.role === "employee") {
    return "/flo";
  }

  // ── Step 2: Branded login with an explicit org context ─────────────────
  if (contextOrgSlug) {
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", contextOrgSlug)
      .single();

    if (org) {
      const { data: orgMembership } = await supabase
        .from("memberships")
        .select("role")
        .eq("user_id", userId)
        .eq("organization_id", org.id)
        .single();

      if (orgMembership) {
        return destinationForRole(orgMembership.role as Role, contextOrgSlug);
      }
    }
    // Context org found but user has no membership there → fall through
    // to their primary membership below rather than hard-erroring.
  }

  // ── Step 3: No context — use the user's primary org membership ──────────
  const { data: primaryMembership } = await supabase
    .from("memberships")
    .select("role, organization:organizations(slug)")
    .eq("user_id", userId)
    .not("organization_id", "is", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (!primaryMembership) {
    return "/login?error=no-access";
  }

  const row = primaryMembership as unknown as MembershipRow;
  const orgSlug = row.organization?.slug ?? null;

  if (!orgSlug) return "/login?error=no-org";
  return destinationForRole(row.role, orgSlug);
}

function destinationForRole(role: Role, orgSlug: string): string {
  switch (role) {
    case "owner":
    case "employee":
      return "/flo";
    case "business_owner":
      return `/workspace/${orgSlug}`;
    case "staff":
      return `/workspace/${orgSlug}/staff`;
    case "customer":
      return `/portal/${orgSlug}`;
    default:
      return "/login?error=unknown-role";
  }
}
