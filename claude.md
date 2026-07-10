# HM Labs — Project Memory

> This file is read by Claude Code at the start of every session.
> Do not delete sections. Update, don't replace.
> Last updated: 2026-07-10

---

## Project overview
- **Client:** HM Labs
- **Industry:** KI-Integration & Softwareentwicklung
- **Project type:** Web app (bilingual marketing site + client portal/CRM)
- **Live URL:** hm-labs.de (public site), clients.hm-labs.de (portal) — pre-launch, QA-Report abgearbeitet, Production-Deploy noch nicht bestätigt
- **GitHub repo:** https://github.com/HenryMirus/hm-websites
- **Deployment path:** Vercel (implied by `vercel_url` field, `NEXT_PUBLIC_PORTAL_URL`, single `next.config.mjs`)
- **Status:** In review (QA abgearbeitet, vor Launch)
- **Claude Design project:** `HM Labs — Design System` on claude.ai/design (seeded from the `HM Websites — Design System` master — see `hm-design-sync`)

---

## Tech stack
- **Framework:** Next.js 14.2 (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS (custom dark theme — `tailwind.config.ts`)
- **Animations:** Framer Motion + custom `<canvas>` particle network (not GSAP)
- **Database:** Supabase (Postgres 17, Auth, Storage, RLS)
- **Package manager:** npm (package-lock.json)
- **Node version:** not pinned (no `.nvmrc` / `engines` field in package.json)

---

## Design rules — NEVER violate these

### Typography
- **Primary/display font:** Space Grotesk
- **Secondary/body font:** Inter
- **Mono (labels, code, timestamps):** JetBrains Mono
- **Banned as PRIMARY typeface:** Inter, Roboto, Arial, Helvetica, system-ui (Inter is fine as the *secondary/body* font — it is not the display face here)
- **Heading size (desktop h1):** `text-6xl lg:text-7xl xl:text-[84px]`, uppercase, tracking-tight

### Colors (from `tailwind.config.ts`)
- **Background (`bg`):** #09090F
- **Surface (`surface`):** #111118
- **Border (`border`):** #1E1E2E
- **Text primary (`text-primary`):** #EEEEFF
- **Text muted (`text-muted`):** #5A5A7A
- **Text dim (`text-dim`):** #8888AA (secondary mute, lighter than text-muted)
- **Primary accent (`primary` / `primary-dark`):** #4F7FFF / #2A5CE8
- **Secondary accent (`accent`):** #FF4D6A
- **Naming note:** code uses `primary`/`accent`, not the studio-standard `--color-accent`/`--color-accent-alt` role names — see the `tokens/project-tokens-hm-labs.html` card in the Claude Design project for the full mapping.

### Animation
- **Overall feel:** kinetic/motion-first — dark base, electric accents, staggered reveals
- **Direction:** Direction 2 (Kinetic / Motion-First) from `hm-design-identity`
- **Library:** Framer Motion for component-level animation, custom canvas particle network for the hero background
- **Banned effects:** fade-in-up on every element, parallax background scroll, scale(1.05) hover on every card, counter-ticking numbers

### Mood keywords
Dark, precise, technical, kinetic, confident

---

## Approved sections and features

- [ ] Hero — particle network background, typing animation (DE/EN toggle — see Known issues)
- [ ] Public one-page marketing site — Services, Lifecycle, Portfolio, Testimonials, FAQ, Contact, ProjectWizard
- [ ] Client portal (`clients.hm-labs.de`) — leads, clients, projects, messages, admins, api-keys, settings

---

## Sourced components

| Component | Source | File path | Adapted colors |
|-----------|--------|-----------|----------------|
| Particle network hero background | Custom-built | `components/ParticleNetwork.tsx` (per DOCUMENTATION.md) | Native to project palette |

---

## Do not touch (locked)

- (none recorded yet — add anything the client has explicitly approved and locked)

---

## Known issues / deferred work

From the last QA pass (`QA-REPORT.md`):
- [ ] `next@14.2.35` patch update needed before production deploy (non-breaking `npm install`)
- [ ] Typing-animation `useEffect` in Hero doesn't re-trigger on `text` prop change post-completion — sighted users see stale German text after toggling to English, while the `sr-only` span (screen readers/crawlers) updates correctly
- [ ] `?lang=en` query param is not read anywhere (`app/page.tsx` only has `useState<Lang>("de")`) — the hreflang tag promises English content at a URL that doesn't deliver it
- [ ] No `id="home"` on the page top — "Home" nav entry has nothing to scroll to
- [ ] Lighthouse LCP 5.6s measured in `next dev` (not representative) — re-measure against a production build; Hero background image is the likely LCP element to optimize
- [ ] Portal pages (`/leads`, `/clients`, `/projects`, `/messages`, `/admins`, `/api-keys`, `/settings`) were untested in the last QA pass (no authenticated session available) — re-run once a session exists
- [ ] SSL, CDN, and edge-header behavior not tested against production

---

## Current session task

Set up the Claude Design sync workflow (claude.ai/design) for this project and for all future HM Websites projects — see `hm-design-sync` skill. Master + per-project Design System projects created; `HM Labs — Design System` seeded with the 5 aesthetic directions, token references, and this project's live color/type tokens.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-10 | claude.md created; Claude Design (claude.ai/design) sync set up — master + `HM Labs — Design System` project seeded; new `hm-design-sync` skill added |
