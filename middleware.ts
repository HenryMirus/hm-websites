import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const MAIN_DOMAIN = "hm-labs.tech";
const PORTAL_SUBDOMAIN = "clients.hm-labs.tech";
const PORTAL_BASE = `https://${PORTAL_SUBDOMAIN}`;
const DEV_PORTAL_SUBDOMAIN = "clients.localhost";
const OS_SUBDOMAIN = "os.hm-labs.tech";
const OS_BASE = `https://${OS_SUBDOMAIN}`;
const DEV_OS_SUBDOMAIN = "os.localhost";

// APP_ROLE trennt das eine Repo in zwei unabhängig deploybare Container
// (website | portal). Gesetzt in docker-compose.yml. Ohne APP_ROLE (z.B.
// lokale Entwicklung) verhält sich die Middleware wie vorher (Hostname
// entscheidet). Der OS-Bereich (app/os) wird vorerst in beiden Rollen
// deaktiviert (404) — kein eigener Container, kein Zugriff über die Domain.
const APP_ROLE = process.env.APP_ROLE;

// Public path suffixes (relative to the subdomain prefix, e.g. /portal or /os).
const PUBLIC_SUFFIXES = ["/login", "/auth/callback", "/auth/update-password", "/password"];

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").replace(/:.*$/, "");
  const pathname = request.nextUrl.pathname;

  // OS-Bereich ist vorerst deaktiviert (kein eigener Container/Domain-Setup).
  if (pathname === "/os" || pathname.startsWith("/os/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let isPortalSubdomain =
    hostname === PORTAL_SUBDOMAIN || hostname === DEV_PORTAL_SUBDOMAIN;
  let isOsSubdomain =
    hostname === OS_SUBDOMAIN || hostname === DEV_OS_SUBDOMAIN;
  let isMainDomain =
    hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`;

  // Rollen-Erzwingung: der Container bekommt vom Reverse-Proxy ohnehin nur
  // Traffic für seine eigene Domain, aber wir spiegeln das hier zusätzlich
  // im Code, damit der Portal-Container niemals Website-Inhalte ausliefert
  // (und umgekehrt), selbst wenn er direkt per IP/Port angesprochen wird.
  if (APP_ROLE === "website") {
    isPortalSubdomain = false;
    isOsSubdomain = false;
    isMainDomain = true;
  } else if (APP_ROLE === "portal") {
    isMainDomain = false;
    isOsSubdomain = false;
    isPortalSubdomain = true;
  }

  // Hauptdomain + /portal/* oder /os/* → redirect zur jeweiligen Subdomain
  if (isMainDomain && pathname.startsWith("/portal")) {
    const subPath = pathname.replace("/portal", "") || "/";
    return NextResponse.redirect(`${PORTAL_BASE}${subPath}`);
  }

  // Weder Portal- noch OS-Subdomain → durchlassen (inkl. /api/v1/*)
  if (!isPortalSubdomain && !isOsSubdomain) {
    return NextResponse.next({ request });
  }

  // API-Routen auf der Subdomain → durchlassen (eigene Auth via API-Key)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  // Prefix je nach Subdomain. Die Auth-Logik ist für beide identisch.
  const prefix = isOsSubdomain ? "/os" : "/portal";

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
