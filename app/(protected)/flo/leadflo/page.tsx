import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import LeadFloDashboard from "./LeadFloDashboard";

export const metadata: Metadata = { title: "LeadFlo — FLO" };

export default async function LeadFloPage() {
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
    .order("created_at", { ascending: false });

  return <LeadFloDashboard leads={leads ?? []} />;
}
