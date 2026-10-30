# HM Labs — ein Next.js-Repo, zwei Rollen (website / portal), gesteuert über
# die Build-/Runtime-Env APP_ROLE (siehe middleware.ts). Gebaut und gestartet
# über /opt/hm-labs/docker-compose.yml (Services `hm-website` und
# `hm-portal`) — nicht einzeln, siehe dort.

# ---- Basis: Node + npm (package-lock.json im Repo) ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- deps: nur Abhängigkeiten installieren (bester Layer-Cache) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: Quellcode + Build ----
FROM base AS builder
ARG APP_ROLE
ENV APP_ROLE=${APP_ROLE}
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_*-Variablen werden von Next.js beim Build ins Client-Bundle
# inlined (nicht erst zur Laufzeit) — deshalb hier als Build-ARGs, nicht nur
# im Runtime-env_file der docker-compose.yml.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_PORTAL_URL
ARG NEXT_PUBLIC_OS_URL
ARG NEXT_PUBLIC_EMAIL_CONTACT
# Leer oder nicht gesetzt → Defaults aus lib/config/site.ts (hm-labs.tech).
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_PORTAL_URL=${NEXT_PUBLIC_PORTAL_URL}
ENV NEXT_PUBLIC_OS_URL=${NEXT_PUBLIC_OS_URL}
ENV NEXT_PUBLIC_EMAIL_CONTACT=${NEXT_PUBLIC_EMAIL_CONTACT}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner: schlankes Laufzeit-Image ----
FROM node:22-alpine AS runner
WORKDIR /app
ARG APP_ROLE
ENV APP_ROLE=${APP_ROLE}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# `output: "standalone"` (next.config.mjs) legt genau das hier an: ein
# server.js mit nur den tatsächlich gebrauchten node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
