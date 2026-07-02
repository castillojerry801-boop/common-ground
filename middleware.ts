import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Domains that belong to Common Ground itself.
// Custom business domains are anything NOT in this set.
const OWN_DOMAINS = new Set([
  "localhost",
  "commonground.build",
  "www.commonground.build",
]);

function isOwnDomain(host: string): boolean {
  const hostname = host.split(":")[0]; // strip port
  return OWN_DOMAINS.has(hostname);
}

function isPublicPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/login") return true;
  if (pathname.startsWith("/login/")) return true; // branded logins + forgot-password
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (/\.(ico|svg|png|jpg|jpeg|webp|woff2?)$/.test(pathname)) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Always refresh session tokens.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ── Custom domain → branded login redirect ─────────────────────────────
  // Only applies on login paths of non-CG domains.
  // e.g. elevatedbeauty.com/login → commonground.com/login/elevated-beauty
  //
  // This only queries on /login hits so there is no per-request DB overhead.
  if (!isOwnDomain(host) && pathname === "/login") {
    const { data: org } = await supabase
      .from("organizations")
      .select("slug")
      .eq("branded_domain", host.split(":")[0])
      .single();

    if (org?.slug) {
      const branded = new URL(
        `/login/${org.slug}`,
        // Redirect to our own domain, not the business domain
        process.env.NEXT_PUBLIC_APP_URL ?? request.url
      );
      return NextResponse.redirect(branded);
    }
  }

  // ── Authenticated user hitting /login → send to callback ───────────────
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/callback", request.url));
  }

  // ── Public path → pass through ─────────────────────────────────────────
  if (isPublicPath(pathname)) return response;

  // ── Protected path, no session → redirect to login ─────────────────────
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
