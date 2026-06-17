# Using this scaffold for a new project

This is HM Websites' **reusable, adaptable starter** — Next.js 14 (App Router) +
TypeScript + Tailwind v3 + GSAP/ScrollTrigger + Framer Motion, with ESLint,
Prettier and a Vercel config. It is built so a new client project is a matter of
editing a handful of clearly-marked adaptation points, not rewriting the setup.

> Design principle: **identity and brand live in one file**
> (`lib/site.config.ts`). Components and CSS stay generic so they carry over
> unchanged. When you find yourself hard-coding a client name, colour or locale
> in a component, lift it into `site.config.ts` instead.

## Spin up a new project (checklist)

1. **Copy the scaffold.** Use this branch/repo as the base (or, once promoted,
   GitHub's _Use this template_ button — see "Promotion" below).
2. **`lib/site.config.ts`** — the single adaptation point. Set:
   - `name`, `shortName`, `description`, `url`
   - `locale` (`de` for German-market clients, else `en`)
   - `brand` colour tokens (from the approved design tokens). These are injected
     as CSS custom properties on `<html>` and map 1:1 to Tailwind `brand.*`
     utilities — no CSS editing required.
3. **Font** — in `app/layout.tsx`, swap the `next/font/google` import and the
   `font` call for the project's typeface. The `--font-sans` variable wires it
   into Tailwind automatically.
4. **`package.json`** — set `name` to the new project slug.
5. **`.env.local`** — copy `.env.local.example`, set `NEXT_PUBLIC_SITE_URL` and
   any data/Supabase keys the project actually uses.
6. **Vercel** — link to (or create) the project's own Vercel project; confirm
   the region in `vercel.json` (`fra1` for EU/German clients).
7. **Content** — replace `components/sections/Hero.tsx` placeholder copy and add
   real sections. Keep the two mandatory animation patterns (hero entrance +
   scroll-triggered reveal) — see `CLAUDE.md` §4.
8. **Legal (DE clients)** — add Impressum/Datenschutz and run the DSGVO/TMG
   checklist before launch.

After steps 2–4 the app already renders with the new identity and brand.

## What is deliberately generic (don't fork these per project)

- `styles/globals.css` — token-driven; no per-client colours.
- `components/ui/PageTransition.tsx` — route transition, project-agnostic.
- `lib/utils.ts`, ESLint/Prettier/Tailwind/TS configs.
- The GSAP wiring pattern in `Hero.tsx` (`useGSAP` + `{ scope }`).

## Promotion to a standalone template

While the v2 build is still shaping the scaffold, the canonical copy lives on
`redesign/hmwebsites-v2`. Once v2 ships and the scaffold has proven itself, it
should be extracted into a dedicated `hm-websites-starter` GitHub _template_
repository so future projects start from a clean, versioned base rather than a
branch. That extraction is tracked as a follow-up issue.
