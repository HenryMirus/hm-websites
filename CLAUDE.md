# CLAUDE.md — HM Websites v2 (clean-sheet redesign)

Persistent project memory for the HM Websites v2 redesign. Read this at the
start of every session; update the relevant section at the end of every session.
Its job is to prevent design regressions, context loss between sessions, and
repeated mistakes.

> Branch: `redesign/hmwebsites-v2` · Tracking issue: **HMW-177** (Phase 0 scaffold)
> Status: **scaffold live** — design tokens, content and sections land in later phases.

---

## 1. What this project is

A from-scratch rebuild of the HM Websites marketing site. The v1 site lives on
`master` (Next.js, next-intl, GSAP, Supabase contact form). v2 is a **clean
sheet**: we keep the lessons, not the code. Nothing from v1 is carried over
unless a phase issue explicitly asks for it.

The current branch deliberately replaces the entire v1 source with a fresh
scaffold. `master` is untouched and remains the production source of truth until
v2 is approved for launch.

---

## 2. Tech stack (decided — do not change without a CTO decision + DB log)

| Layer            | Choice                                  | Notes |
| ---------------- | --------------------------------------- | ----- |
| Framework        | **Next.js 14.2.x** (App Router)         | Pinned to 14, not 16. |
| Language         | **TypeScript** (strict)                 | No `any`, no `ts-ignore`. |
| Styling          | **Tailwind CSS v3.4** + CSS custom props | Brand tokens via `:root` vars. |
| Scroll / timeline animation | **GSAP 3** + ScrollTrigger + `@gsap/react` `useGSAP()` | Owns in-page choreography. |
| Page transitions | **Framer Motion**                       | Simple route fade/slide only. |
| Lint / format    | ESLint (`next/core-web-vitals`) + Prettier | `prettier-plugin-tailwindcss`. |
| Deployment       | **Vercel** (region `fra1`)              | `vercel.json` committed. |
| Package manager  | **pnpm 9**                              | Do not mix npm/yarn lockfiles. |
| Database         | **Supabase** — only when a phase needs persistence | Not wired yet. |

Decision authority: stack/library/tool/architecture changes are CTO calls and
**must** be logged via a DB Agent sub-issue (`INSERT project_decisions`).

---

## 3. Folder structure

```
app/                  App Router routes + root layout
components/
  sections/           Page sections (Hero, …) — GSAP lives here
  ui/                 Reusable primitives (PageTransition, …)
lib/                  Utilities, future Supabase clients
public/               Static assets
styles/globals.css    Tailwind layers + brand CSS custom properties
```

Path alias: `@/*` → repo root (see `tsconfig.json`).

---

## 4. Animation conventions (HM standard — non-negotiable)

Every page ships with, at minimum:
1. **Hero entrance** timeline on load (staggered fade/slide-in).
2. **Scroll-triggered reveal** on every content section.
3. **Hover states** on all interactive elements.
4. **Page transition** between routes (Framer Motion).

GSAP rules:
- Always `gsap.registerPlugin(ScrollTrigger)`.
- Use `useGSAP()` from `@gsap/react` with a `{ scope }` ref — it handles
  context cleanup and kills ScrollTriggers on unmount automatically.
- Never hand-roll `gsap.context()` cleanup when `useGSAP` covers it.
- GSAP owns in-page scroll/entrance; Framer Motion owns route transitions only.
  Do not animate the same concern in both.

Accessibility: respect `prefers-reduced-motion` (global reset in `globals.css`).
Animations must not cause layout shift (CLS) — animate transform/opacity, not
layout properties.

Reference patterns: `components/sections/Hero.tsx` (entrance + ScrollTrigger),
`components/ui/PageTransition.tsx` (route transition).

---

## 5. Quality bar (gate before any QA handoff)

- Lighthouse: Performance ≥ 90 · SEO ≥ 95 · Accessibility ≥ 90.
- Core Web Vitals: LCP < 2.5s · CLS < 0.1 · INP < 200ms.
- No console errors in production.
- All images via `next/image` with `alt` text.
- Mobile-first; verify at 375 / 768 / 1280 / 1920 px.
- TypeScript strict — no `any`, no `ts-ignore`.
- No unused dependencies.

---

## 6. Design constraints (placeholders — fill from approved Figma)

The v2 brand palette and typography are **not finalised**. Current values in
`styles/globals.css` (`--color-*`, Inter font) are scaffold placeholders so the
pipeline renders. Replace them in the design-token phase from the
board-approved Figma. Do not treat the placeholder palette as a brand decision.

- Locale: `<html lang="de">` (German-first market; DSGVO/TMG checklist applies
  before any launch — Impressum, Datenschutz, cookie handling, hreflang).

---

## 7. Workflow & ownership

- All work happens on branches; `master` is protected and merged by the board only.
- Frontend Developer → UI, GSAP, responsive CSS, components.
- Backend Developer → API routes, DB schema (DDL), auth.
- DB Agent → all INSERT/UPDATE/DELETE (CTO never writes data directly).
- Mandatory DB triggers: log every tech decision, every deliverable URL
  (vercel/github/figma), and every milestone via DB Agent sub-issues.
- Frontend and backend work always live in **separate** issues.

---

## 8. Session log (newest first)

- **2026-06-16 — Phase 0 (HMW-177):** Created `redesign/hmwebsites-v2`, replaced
  v1 source with a fresh Next.js 14 + TS + Tailwind v3 + GSAP + Framer Motion
  scaffold (ESLint/Prettier, `vercel.json`, folder structure). Added this
  CLAUDE.md. Hero + PageTransition prove the animation pipeline end-to-end.
  Next: open draft PR, wire Vercel preview, then design-token phase.
