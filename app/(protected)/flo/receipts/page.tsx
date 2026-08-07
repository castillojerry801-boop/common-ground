import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ReceiptsClient from "./ReceiptsClient";

export const metadata: Metadata = { title: "Receipts — FLO" };

export default async function ReceiptsPage() {
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

  const [{ data: receipts }, { data: transactions }, { data: orgs }] =
    await Promise.all([
      supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false }),
      supabase.from("organizations").select("id, name, slug").order("name"),
    ]);

  return (
    <ReceiptsClient
      initialReceipts={receipts ?? []}
      initialTransactions={transactions ?? []}
      orgs={orgs ?? []}
    />
  );
}
