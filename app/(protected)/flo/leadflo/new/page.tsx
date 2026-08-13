import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import NewLeadForm from "./NewLeadForm";

export const metadata: Metadata = { title: "Add Lead — LeadFlo" };

export default async function NewLeadPage() {
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

  return <NewLeadForm />;
}
