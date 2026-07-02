import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FLO — Common Ground" };

export default async function FloPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify the user holds an owner or employee role
  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .is("organization_id", null)
    .single();

  if (!membership || !["owner", "employee"].includes(membership.role)) {
    redirect("/login?error=forbidden");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 mb-4">
          FLO
        </p>
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-3">
          Your Master Control.
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Signed in as{" "}
          <span className="text-zinc-300">{user.email}</span>
        </p>
        <p className="text-xs text-zinc-700 max-w-xs mx-auto leading-relaxed">
          FLO is under construction. This is where you will monitor every
          product, client, payment, and system across Common Ground.
        </p>
      </div>
    </div>
  );
}
