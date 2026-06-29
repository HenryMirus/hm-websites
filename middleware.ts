import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const MAIN_DOMAIN = "hm-labs.de";
const PORTAL_SUBDOMAIN = "clients.hm-labs.de";
const PORTAL_BASE = `https://${PORTAL_SUBDOMAIN}`;
const DEV_PORTAL_SUBDOMAIN = "clients.localhost";

// Paths accessible without authentication (relative to portal, after /portal prefix)
const PUBLIC_PATHS = new Set([
  "/portal/login",
  "/portal/auth/callback",
  "/portal/auth/update-password",
  "/portal/password",
]);

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").replace(/:.*$/, "");
  const isPortalSubdomain =
    hostname === PORTAL_SUBDOMAIN || hostname === DEV_PORTAL_SUBDOMAIN;
  const isMainDomain =
    hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`;
  const pathname = request.nextUrl.pathname;

  // Hauptdomain + /portal/* → redirect zur Subdomain
  if (isMainDomain && pathname.startsWith("/portal")) {
    const subPath = pathname.replace("/portal", "") || "/";
    return NextResponse.redirect(`${PORTAL_BASE}${subPath}`);
  }

  // Nicht die Portal-Subdomain → durchlassen (inkl. /api/v1/*)
  if (!isPortalSubdomain) {
    return NextResponse.next({ request });
  }

  // API-Routen auf der Subdomain → durchlassen (eigene Auth via API-Key)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  // Pfad intern umschreiben: / → /portal, /login → /portal/login
  // Wenn der Pfad bereits mit /portal beginnt (z.B. PortalShell-Links oder Refresh nach Redirect),
  // nicht nochmals /portal voranstellen — sonst würde /portal/leads zu /portal/portal/leads
  const effectivePath =
    pathname === "/"
      ? "/portal"
      : pathname.startsWith("/portal")
      ? pathname
      : `/portal${pathname}`;
  const isPublicPath = PUBLIC_PATHS.has(effectivePath);

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
  if (effectivePath === "/portal/login" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // URL intern auf /portal/... umschreiben.
  // x-pathname forwarden damit das Portal-Layout den Original-Pfad für den
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
