import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import FloClient from "./FloClient";

export const metadata: Metadata = { title: "FLO — Common Ground Workshop" };

export default async function FloPage() {
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

  // Platform stats
  const [
    { count: userCount },
    { count: orgCount },
    { data: recentInquiries },
    { count: inquiryCount },
    { data: transactions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("organizations").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select(
        "id, full_name, business_name, email, phone, business_type, business_description, looking_for, notes, read, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("transactions")
      .select("type, amount, date, category")
      .order("date", { ascending: false })
      .limit(500),
  ]);

  const services = [
    { name: "Authentication", status: "healthy" as const },
    { name: "Database", status: "healthy" as const },
    { name: "API Gateway", status: "healthy" as const },
    { name: "CG Platform", status: "healthy" as const },
    { name: "GameFloHQ", status: "healthy" as const },
    { name: "BeautyBook", status: "healthy" as const },
    { name: "Fresh Styles", status: "healthy" as const },
  ];

  // Build monthly transaction summary for FLO context
  const monthlyMap: Record<string, { income: number; expenses: number }> = {};
  for (const t of transactions ?? []) {
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expenses: 0 };
    if (t.type === "income") monthlyMap[month].income += t.amount;
    else monthlyMap[month].expenses += t.amount;
  }
  const transactionSummary = Object.entries(monthlyMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 24)
    .map(([month, { income, expenses }]) => {
      const net = income - expenses;
      return `  ${month}: income $${income.toFixed(2)} | expenses $${expenses.toFixed(2)} | net ${net >= 0 ? "+" : ""}$${net.toFixed(2)}`;
    })
    .join("\n");

  return (
    <FloClient
      userEmail={user.email ?? ""}
      stats={{
        userCount: userCount ?? 0,
        orgCount: orgCount ?? 0,
        inquiryCount: inquiryCount ?? 0,
      }}
      services={services}
      recentInquiries={recentInquiries ?? []}
      transactionSummary={transactionSummary || "  No transactions recorded yet."}
    />
  );
}
