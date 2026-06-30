const isDev = process.env.NODE_ENV === "development";

// 'unsafe-eval' is required in dev for Next.js hot-reload (react-refresh uses eval).
// In production it is omitted — no eval needed at runtime.
const scriptSrc = isDev
  ? `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://snap.licdn.com`
  : `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://snap.licdn.com`;

const ContentSecurityPolicy = `
  default-src 'self';
  ${scriptSrc};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com https://px.ads.linkedin.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://zoyvsobztyqdaqdffrbo.supabase.co wss://zoyvsobztyqdaqdffrbo.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://www.facebook.com https://px.ads.linkedin.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, " ").trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
