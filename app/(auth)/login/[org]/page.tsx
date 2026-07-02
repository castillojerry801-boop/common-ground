import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/app/(auth)/login/LoginForm";
import type { OrgBranding } from "@/types/supabase";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ org: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { org } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("name")
    .eq("slug", org)
    .single();
  return { title: data ? `${data.name} — Sign In` : "Sign In" };
}

export default async function BrandedLoginPage({ params }: Props) {
  const { org } = await params;
  const supabase = await createClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, slug, branding")
    .eq("slug", org)
    .single();

  if (!organization) notFound();

  const branding = (organization.branding ?? {}) as OrgBranding;
  const accentColor = branding.accentColor ?? "#d97706";

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Business identity — replaces Common Ground wordmark */}
        <div className="mb-12 flex flex-col items-center gap-3">
          {branding.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={branding.logoUrl}
              alt={organization.name}
              className="h-10 object-contain"
            />
          ) : (
            <div
              className="h-10 flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: accentColor }}
              >
                {organization.name[0]}
              </span>
            </div>
          )}
          <p
            className="text-sm font-semibold tracking-wide"
            style={{ color: accentColor }}
          >
            {organization.name}
          </p>
        </div>

        {/* Headline */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 leading-tight mb-3">
            Open Your Toolbox.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            Sign in to access your{" "}
            <span className="text-zinc-300">{organization.name}</span> account.
          </p>
        </div>

        {/* Form with org context */}
        <LoginForm orgSlug={organization.slug} />

        {/* Attribution — intentionally subtle */}
        <div className="mt-10 pt-8 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-800">Secured by Common Ground</p>
        </div>
      </div>
    </div>
  );
}
