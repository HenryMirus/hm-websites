import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Inject x-pathname so server components can read the current path for hreflang generation.
  // next-intl copies input request headers into NextResponse.next(), so x-pathname is forwarded.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return intlMiddleware(new NextRequest(request, { headers: requestHeaders }));
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
