import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Pipeline from "./Pipeline";

export const metadata: Metadata = { title: "Pipeline — LeadFlo" };

export default async function PipelinePage() {
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

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("opportunity_score", { ascending: false });

  return <Pipeline leads={leads ?? []} />;
}
