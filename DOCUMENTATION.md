# HM Labs — Project Documentation

Marketing website + client portal/CRM for **HM Labs** (KI-Integration & Softwareentwicklung), built with Next.js 14 (App Router), Supabase, and Tailwind CSS. Bilingual (DE/EN) public site, plus a private client portal served from a subdomain.

- **Public site:** `hm-labs.de` — single-page marketing site with a lead-capture wizard
- **Client portal:** `clients.hm-labs.de` — login-gated CRM/project-management dashboard for admins and clients, served from the same Next.js app via host-based middleware routing

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router, Server Components, Server Actions) |
| Language | TypeScript, React 18 |
| Styling | Tailwind CSS (custom dark theme — see `tailwind.config.ts`) |
| Animation | Framer Motion, custom `<canvas>` particle network |
| Backend / DB | Supabase (Postgres 17, Auth, Storage, RLS) |
| Auth | Supabase Auth (`@supabase/ssr`), cookie-based sessions, role stored in `profiles` table |
| Email | Nodemailer over SMTP, hand-built responsive HTML templates (dark themed, inline CID logo) |
| Hosting target | Vercel (implied by `vercel_url` field, `NEXT_PUBLIC_PORTAL_URL`, single `next.config.mjs`) |

No ORM — all DB access goes through the Supabase JS client (`@supabase/supabase-js` / `@supabase/ssr`), either with the anon key (RLS-enforced, user-scoped) or the service-role key (`createAdminClient`, bypasses RLS — used in Server Actions and webhooks).

---

## 2. Repository Layout

```
app/
  page.tsx                     # Public one-page marketing site (client component, lang state)
  layout.tsx, error.tsx, not-found.tsx, sitemap.ts
  impressum/, datenschutz/     # German legal pages
  icon.png                     # Favicon
  api/
    contact/route.ts           # Public contact-form → contact_submissions table
    v1/clients/route.ts        # External REST API (Bearer API key) — list/create clients
    v1/clients/[id]/route.ts   # External REST API — get/update a client
    webhooks/new-message/route.ts          # Supabase DB webhook → email notification
    webhooks/milestone-completed/route.ts  # Supabase DB webhook → email notification
  portal/                      # Everything under clients.hm-labs.de
    layout.tsx                 # Auth gate (reads x-pathname header set by middleware)
    page.tsx                   # Role-based redirect (admin → /leads, client → /projects)
    login/, auth/callback/, auth/update-password/, password/
    leads/                     # Admin: contact_submissions inbox
    clients/                   # Admin: client CRUD, file uploads, resend invite
    projects/                  # Admin + client: project detail, milestones, tasks, decisions, feedback
    messages/                  # Admin + client: chat threads per client
    admins/                    # Admin: invite/remove other admins
    api-keys/                  # Admin: issue/revoke API keys for the external REST API
    settings/                  # Profile, password, email change

components/                    # Public-site sections (Hero, Services, Lifecycle, Portfolio,
                                # Testimonials, FAQ, Contact, ProjectWizard, ParticleNetwork, ...)

lib/
  translations.ts              # DE/EN copy for the entire public site (~825 lines)
  consent.tsx                  # Cookie-consent context/provider
  config/email.ts               # Single source of truth for all "from"/"contact" addresses
  supabase/{client,server,admin}.ts  # Browser / SSR (cookie) / service-role Supabase clients
  auth/{getRole,recoveryToken}.ts    # Role lookup + auth guards (requireAuth/requireAdmin)
  api/verifyApiKey.ts           # Bearer-token check for the external REST API
  email/{send,notify}.ts        # SMTP transport + transactional email builders
  email/templates/*.html        # Static HTML emails (invite, password reset, magic link)
  portal/getUnreadMessageCount.ts
  hooks/useAdminRole.ts

middleware.ts                  # Host-based routing: main domain vs. portal subdomain
```

Project-root also contains many ad-hoc QA/design screenshots (`*.png`, `*.jpeg`) from development sessions — these are **git-ignored** and not part of the shipped app.

---

## 3. Public Marketing Site (`app/page.tsx`)

A single long-scroll page composed of independent section components, all driven by one `lang` state (`"de" | "en"`) lifted in `page.tsx` and passed down as a prop. Copy lives centrally in `lib/translations.ts` rather than per-component.

Section order: `Navigation → HeroSection → TrustBar → ReadinessCheckSection → ScrollRevealText → ServicesSection → LifecycleSection → ProcessSection → PortfolioSection → TestimonialsSection → CTASection → AboutSection → TechStackSection → FAQSection → ContactSection → Footer`, plus a fixed `SectionNav` (scroll-spy dot nav) and a `ProjectWizard` modal triggered from multiple CTAs.

Notable pieces:
- **`ParticleNetwork`** — full-page `<canvas>` background animation (z-index below all content), draws the dark background itself.
- **`ProjectWizard`** — multi-step lead-qualification modal; answers are submitted to `/api/contact` as `wizard_answers` metadata alongside the contact form.
- **`TrackingScripts` / `lib/consent.tsx` / `CookieBanner`** — GDPR-style cookie consent gate before loading GA4, Meta Pixel, Google Ads, and LinkedIn Insight tags (IDs from `NEXT_PUBLIC_*` env vars, see `Todo.md`).
- **Legal pages** (`/impressum`, `/datenschutz`) — static German legal-requirement pages, separate from the main translated site.

### Contact flow
`ContactSection` / `ProjectWizard` → `POST /api/contact` → inserts directly into Supabase `contact_submissions` (no outbound email is sent on submission — submissions surface in the portal's **Leads** inbox for an admin to action). The route only requires `name` + `email`; `wizard_answers` are stored as JSON in `metadata`.

---

## 4. Client Portal / CRM (`app/portal/**`, served on `clients.hm-labs.de`)

A role-based dashboard with two roles, sourced from `profiles.role`:

- **admin** — full CRM: manage clients, projects, milestones, tasks, leads, messaging with any client, invite other admins, issue API keys.
- **client** — scoped view: their own projects (status, milestones, tasks, decisions, feedback rounds), file uploads, and a chat thread with HM Labs.

### Routing & auth (`middleware.ts` + `app/portal/layout.tsx`)
The same Next.js deployment serves both domains:
1. `middleware.ts` inspects the `Host` header.
   - Main domain (`hm-labs.de`) hitting `/portal/*` → **redirected** to the portal subdomain.
   - Non-portal hosts → passed through untouched (this is how the public site and `/api/v1/*` stay reachable on the main domain).
   - Portal subdomain (`clients.hm-labs.de`, or `clients.localhost` in dev) → paths are **rewritten** onto `/portal/...` internally (so `clients.hm-labs.de/projects` serves `app/portal/projects/page.tsx`), after a Supabase session check. Unauthenticated requests to non-public paths are redirected to `/login`.
   - `/api/*` paths are always passed through, even on the portal subdomain (they use their own Bearer-token auth, not cookies).
2. `app/portal/layout.tsx` re-checks auth server-side using the `x-pathname` header the middleware forwards, as a defense-in-depth layer for the small set of public paths (`/login`, `/auth/*`, `/password`).
3. `lib/auth/getRole.ts` exposes `getUserRole()`, `requireAuth()`, `requireAdmin()` — used throughout Server Actions and pages to gate admin-only mutations (client/project CRUD, admin invites, API keys).

### Feature areas
| Route | Purpose |
|---|---|
| `/portal/leads` | Admin inbox for `contact_submissions` |
| `/portal/clients` | Admin CRUD for `clients`; invite-by-email (Supabase `auth.admin.inviteUserByEmail`), resend invite, file uploads |
| `/portal/projects` | Project list/detail/edit; milestones, tasks, decisions, feedback rounds, status/budget/dates, tech stack, deploy links (Vercel/GitHub/Figma) |
| `/portal/messages` | Per-client chat threads (`messages` table), unread-count badge (`lib/portal/getUnreadMessageCount.ts`) |
| `/portal/admins` | Invite/remove admin users |
| `/portal/api-keys` | Issue/revoke keys for the external REST API (hashed at rest, see §6) |
| `/portal/settings` | Profile, password, email change |

### File storage
Client-uploaded files go to a Supabase Storage bucket named **`client-files`**, organized as `clientId/[projects/projectId/]category/timestamp_filename`, with a 50 MB per-file cap and categories `brand | images | videos | content | other`. Uploads happen via a Server Action (`app/portal/clients/_files_actions.ts`) using the service-role client so RLS doesn't block the multi-tenant write.

---

## 5. Database Schema (Supabase Postgres, RLS enabled on every table)

| Table | Purpose |
|---|---|
| `clients` | CRM contact record. `status`: `prospect \| active \| inactive`. Linked 1:1 to a Supabase Auth user via `auth_user_id` once invited. Has a `retainer_options` JSONB field for recurring-package offers. |
| `projects` | One project per client engagement. `status`: `discovery → design → development → review → live → maintenance` (or `cancelled`). `type`: `website \| landing_page \| ecommerce \| webapp \| maintenance`. Holds `vercel_url`, `github_url`, `figma_url`, `tech_stack` (jsonb), `budget`, `start_date`/`deadline`/`launch_date`. |
| `project_milestones` | Per-project milestones, `status`: `pending \| in_progress \| completed \| blocked`. Completing one fires the `milestone-completed` webhook → client email. |
| `tasks` | Per-project task list, `status`: `todo \| in_progress \| done`, with `priority`. |
| `project_briefs` | Versioned intake/briefing content (goals, requirements, target audience) per project. |
| `project_decisions` | Logged technical/design decisions per project with rationale and alternatives considered. |
| `project_feedback` | Feedback rounds per project (`client \| internal \| qa \| board`), open/addressed/wont_fix. |
| `messages` | Portal chat messages, scoped to a `client_id`, tagged `sender_role: admin \| client`. New rows fire the `new-message` webhook. |
| `client_files` | Metadata for Storage-bucket uploads (`storage_path`, `category`, `size_bytes`, uploader). |
| `invoices` | Draft/sent/paid/overdue invoicing per client/project, `line_items` as JSONB, EUR by default. |
| `contact_submissions` | Public site's contact-form + wizard leads. `status`: `new \| read \| replied \| archived`. |
| `profiles` | 1:1 with `auth.users`; the only place a user's `role` (`admin \| client`) lives. |
| `team_members` | Internal HM Labs team roster (`cto \| developer \| designer \| qa \| account_manager`). |
| `api_keys` | External REST API credentials — only a SHA-256 `key_hash` + `key_prefix` are stored, never the raw key. |
| `lessons_learned` | Append-only knowledge base entries tagged by domain/severity, used by an external agent workflow (see §7). |

All foreign keys cascade sensibly from `clients` → `projects` → (`project_milestones`, `tasks`, `project_briefs`, `project_decisions`, `project_feedback`, `client_files`, `invoices`, `contact_submissions`).

---

## 6. External REST API (`/api/v1/*`)

A small Bearer-token-authenticated API for managing clients from outside the portal UI (e.g. automation, the agent workflow described in §7).

- **Auth:** `Authorization: Bearer hm_live_<raw-key>`. `lib/api/verifyApiKey.ts` hashes the presented key (SHA-256) and looks it up in `api_keys` where `revoked_at IS NULL`; on success it stamps `last_used_at`. Keys are minted/revoked from `/portal/api-keys` by an admin and are only ever shown once in plaintext.
- **`GET /api/v1/clients`** — list all clients.
- **`POST /api/v1/clients`** — create a client (`name`, `email` required); by default also sends a Supabase invite email (`send_invite: false` to skip).
- **`GET /api/v1/clients/[id]`** — fetch a client plus its projects.
- **`PATCH /api/v1/clients/[id]`** — update a client.

This API is intentionally reachable on the main domain too — `middleware.ts` passes `/api/*` straight through regardless of host.

---

## 7. Webhooks & Transactional Email

Two endpoints receive **Supabase Database Webhooks** (Postgres trigger → HTTP POST), authenticated with a static shared secret (`Authorization: Bearer ${WEBHOOK_SECRET}`):

- **`POST /api/webhooks/new-message`** — fires on `INSERT` into `messages`. Client→admin messages notify every admin (looked up via `profiles.role = 'admin'` and resolved to emails via the Auth admin API); admin→client messages notify the client.
- **`POST /api/webhooks/milestone-completed`** — fires on `UPDATE` of `project_milestones`, only when `status` transitions *into* `completed`. Emails the project's client.

Email sending (`lib/email/send.ts`) uses **Nodemailer over SMTP** (`SMTP_HOST/PORT/USER/PASS`, optional `SMTP_FROM`). In development without SMTP configured, emails are **not sent** — instead they're written to `.dev-emails/*.html` (with the inline CID logo resolved to a data URI) for local preview, and logged to the console.

All transactional emails (`lib/email/notify.ts`) share one dark-themed HTML shell (`emailShell()`) with the HM Labs logo (embedded via `cid:hm-labs-logo`, sourced from `public/email/hm-labs-logo-email.png`), an accent-gradient top bar, and a CTA button. Static templates also exist in `lib/email/templates/` for Supabase Auth's own emails (invite, password reset, magic link, email change) — these are configured directly in the Supabase dashboard's SMTP/email templates, not sent by this app's code.

**Note:** `Todo.md` indicates the team is mid-migration from console-log placeholder emails to a real provider (Resend was being evaluated) — verify `SMTP_*` env vars are actually set in production before relying on email delivery.

---

## 8. External Automation Context

Several tables carry comments referencing an external multi-agent workflow (issue IDs like `HMW-49`, `HMW-160`, `HMW-162`, a "DB Inbound Signal Sweep", and a "CTO" role) that creates kickoff issues from new leads/projects (`paperclip_kickoff_issue_id`, `paperclip_issue_id` columns) and appends to `lessons_learned`. This automation lives **outside this repository** — the Next.js app only owns the schema and UI; it does not implement that agent pipeline. Treat those columns/tables as integration points, not dead code.

---

## 9. Environment Variables

| Variable | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client/server/admin Supabase clients, middleware | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + SSR (RLS-enforced) client, middleware | |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` (server-only, bypasses RLS) | **never expose to client** |
| `NEXT_PUBLIC_PORTAL_URL` | links inside emails/invites, default `https://clients.hm-labs.de` | |
| `NEXT_PUBLIC_EMAIL_CONTACT` | `lib/config/email.ts` — single source for displayed contact address | |
| `EMAIL_FROM`, `EMAIL_INBOX`, `NEXT_PUBLIC_EMAIL_SUPPORT` | optional overrides in `lib/config/email.ts` | |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | `lib/email/send.ts` transactional email | falls back to dev-preview mode if unset |
| `WEBHOOK_SECRET` | both `/api/webhooks/*` routes | shared secret with Supabase DB Webhooks config |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | `TrackingScripts` | gated behind cookie consent |

See `Todo.md` for the setup checklist for the tracking IDs and the Resend migration.

---

## 10. Local Development

```bash
npm install
npm run dev       # http://localhost:3000 — public site
                   # http://clients.localhost:3000 — portal (middleware recognizes this host in dev)
npm run build
npm run start
```

Requires a `.env.local` with at least the Supabase keys above; without SMTP configured, transactional emails preview to `.dev-emails/`.
