# Marketing site + client portal (one Next.js app, subdomain-routed via
# middleware.ts — clients.hm-labs.de is /portal/*, the main domain is
# everything else, see that file's own comments). Production today is
# Vercel; this Dockerfile exists purely so this app can run alongside the
# hm-agent-os deploy stack for combined local testing (see
# hm-agent-os/deploy/docker-compose.yml's "website" service) — it does
# NOT replace the Vercel deployment.
#
# No local database: this app talks directly to the real Supabase project
# (zoyvsobztyqdaqdffrbo) over HTTPS, in every environment including this
# container, exactly like `npm run dev` already does locally today —
# containerizing it doesn't change that or add new risk.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
# next.config.mjs's CSP header bakes NEXT_PUBLIC_* values in at build time
# (Next.js inlines them into the client bundle) — real values must be
# present for `npm run build`, not just at runtime, unlike a typical
# server-only env var.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_PORTAL_URL
ARG NEXT_PUBLIC_OS_URL
ARG NEXT_PUBLIC_EMAIL_CONTACT
ARG NEXT_PUBLIC_GOOGLE_ADS_ID
ARG NEXT_PUBLIC_LINKEDIN_PARTNER_ID
ARG NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY} \
  NEXT_PUBLIC_PORTAL_URL=${NEXT_PUBLIC_PORTAL_URL} \
  NEXT_PUBLIC_OS_URL=${NEXT_PUBLIC_OS_URL} \
  NEXT_PUBLIC_EMAIL_CONTACT=${NEXT_PUBLIC_EMAIL_CONTACT} \
  NEXT_PUBLIC_GOOGLE_ADS_ID=${NEXT_PUBLIC_GOOGLE_ADS_ID} \
  NEXT_PUBLIC_LINKEDIN_PARTNER_ID=${NEXT_PUBLIC_LINKEDIN_PARTNER_ID} \
  NEXT_PUBLIC_META_PIXEL_ID=${NEXT_PUBLIC_META_PIXEL_ID}
RUN npm run build

FROM node:22-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
# Explicit -H/-p rather than relying on a PORT/HOSTNAME env var convention
# that's shifted across Next.js versions — this always binds correctly
# regardless.
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
