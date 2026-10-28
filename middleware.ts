import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { MAIN_DOMAIN, PORTAL_HOST, PORTAL_URL } from "@/lib/config/site";

const PORTAL_SUBDOMAIN = PORTAL_HOST;
const PORTAL_BASE = PORTAL_URL;
const DEV_PORTAL_SUBDOMAIN = "clients.localhost";
// os.<domain> ist reserviert für das hm-agent-os-Projekt (eigenes Repo,
// eigenes Deployment) und wird per DNS/Reverse-Proxy direkt dorthin
// gezeigt — nicht über dieses Next.js-Middleware-Rewrite.

// Public path suffixes (relative to the subdomain prefix, e.g. /portal).
const PUBLIC_SUFFIXES = ["/login", "/auth/callback", "/auth/update-password", "/password", "/register"];

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").replace(/:.*$/, "");
  const isPortalSubdomain =
    hostname === PORTAL_SUBDOMAIN || hostname === DEV_PORTAL_SUBDOMAIN;
  const isMainDomain =
    hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`;
  const pathname = request.nextUrl.pathname;

  // Hauptdomain + /portal/* → redirect zur Portal-Subdomain
  if (isMainDomain && pathname.startsWith("/portal")) {
    const subPath = pathname.replace("/portal", "") || "/";
    return NextResponse.redirect(`${PORTAL_BASE}${subPath}`);
  }

  // Keine Portal-Subdomain → durchlassen (inkl. /api/v1/*)
  if (!isPortalSubdomain) {
    return NextResponse.next({ request });
  }

  // API-Routen auf der Subdomain → durchlassen (eigene Auth via API-Key)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  const prefix = "/portal";

  // Pfad intern umschreiben: / → <prefix>, /login → <prefix>/login.
  // Wenn der Pfad bereits mit dem Prefix beginnt (z.B. Shell-Links oder Refresh
  // nach Redirect), nicht nochmals voranstellen.
  const effectivePath =
    pathname === "/"
      ? prefix
      : pathname.startsWith(prefix)
      ? pathname
      : `${prefix}${pathname}`;
  const isPublicPath = PUBLIC_SUFFIXES.some((s) => effectivePath === `${prefix}${s}`);

  // Supabase Auth-Check
  let supabaseResponse = NextResponse.next({ request });
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
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nicht eingeloggt + kein öffentlicher Pfad → zum Login
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Bereits eingeloggt + auf Login-Seite → zum Dashboard
  if (effectivePath === `${prefix}/login` && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // URL intern auf <prefix>/... umschreiben.
  // x-pathname forwarden damit das Layout den Original-Pfad für den
  // server-seitigen Auth-Check lesen kann (headers() in layout.tsx).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = effectivePath;
  const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
  supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
    rewriteResponse.cookies.set(name, value);
  });
  return rewriteResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
