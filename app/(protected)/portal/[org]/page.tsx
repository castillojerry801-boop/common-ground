import { createClient } from "@/lib/supabase/server";
import type { OrgBranding } from "@/types/supabase";

export default async function CustomerPortalPage({
  params,
}: {
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  const supabase = await createClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, branding")
    .eq("slug", org)
    .single();

  const branding = (organization?.branding ?? {}) as OrgBranding;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        {branding.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={branding.logoUrl}
            alt={organization?.name}
            className="h-12 object-contain mx-auto mb-8"
          />
        )}
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-3">
          {organization?.name ?? org}
        </h1>
        <p className="text-zinc-500 text-sm">
          Your customer portal is coming.
        </p>
      </div>
    </div>
  );
}
