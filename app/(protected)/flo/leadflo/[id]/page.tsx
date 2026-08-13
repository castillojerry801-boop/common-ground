import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import LeadDetail from "./LeadDetail";

export const metadata: Metadata = { title: "Lead — LeadFlo" };

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .is("organization_id", null)
    .single();
  if (!membership || !["owner", "employee"].includes(membership.role))
    redirect("/login?error=forbidden");

  const [
    { data: lead },
    { data: notes },
    { data: history },
    { data: proposals },
  ] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).single(),
    supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_status_history").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_proposals").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  if (!lead) notFound();

  return (
    <LeadDetail
      lead={lead}
      notes={notes ?? []}
      history={history ?? []}
      proposals={proposals ?? []}
    />
  );
}
