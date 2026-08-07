import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import TransactionExportView from "./TransactionExportView";

export const metadata: Metadata = { title: "Transaction Report — Common Ground" };

export default async function TransactionExportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: m } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .is("organization_id", null)
    .single();
  if (!m || !["owner", "employee"].includes(m.role))
    redirect("/login?error=forbidden");

  let query = supabase.from("transactions").select("*");
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  const { data: transactions } = await query.order("date", {
    ascending: false,
  });

  return (
    <TransactionExportView
      transactions={transactions ?? []}
      from={from ?? ""}
      to={to ?? ""}
    />
  );
}
