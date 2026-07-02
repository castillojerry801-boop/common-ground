import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";
import type { OrgBranding } from "@/types/supabase";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch org and verify this user has access to it
  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, slug, branding")
    .eq("slug", org)
    .single();

  if (!organization) redirect("/login?error=org-not-found");

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", organization.id)
    .in("role", ["business_owner", "staff"])
    .single();

  if (!membership) redirect("/login?error=forbidden");

  const branding = (organization.branding ?? {}) as OrgBranding;
  const primaryColor = branding.primaryColor ?? "#0a0a0a";
  const accentColor = branding.accentColor ?? "#d97706";

  return (
    <div
      style={
        {
          "--brand-primary": primaryColor,
          "--brand-accent": accentColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
