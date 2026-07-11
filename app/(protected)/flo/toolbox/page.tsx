import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { toolboxTemplates } from "@/data/toolbox-data";
import ToolboxClient from "./ToolboxClient";

export const metadata: Metadata = { title: "Toolbox — Common Ground Workshop" };

export default async function ToolboxPage() {
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

  if (!membership || !["owner", "employee"].includes(membership.role)) {
    redirect("/login?error=forbidden");
  }

  return <ToolboxClient templates={toolboxTemplates} />;
}
