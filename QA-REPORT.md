# HM Labs QA Audit — 2026-06-30

Tested against local dev server (`localhost:3000` / `clients.localhost:3000`).
SSL, CDN, and edge-header behavior were **not** tested — verify those against production separately.

**Portal note:** the `qa-portal` Playwright session stayed on `/login` for the entire audit (no manual login was provided), so all authenticated portal pages (`/leads`, `/clients`, `/projects`, `/messages`, `/admins`, `/api-keys`, `/settings`) are **untested** for translation, mobile layout, and performance. Security review of the portal was still done via source-code/RLS analysis, which doesn't require a live session. Re-run Phase 2/3 portal checks once a session is available.

---

## Critical

1. **Next.js middleware auth-bypass vulnerability (CVE-2025-29927), exploitable specifically against the portal** — Website + Portal
   - File: `package.json` (`next@14.2.5`), `middleware.ts`, `app/portal/layout.tsx`
   - `npm audit` flags `next@14.2.5` as critical: vulnerable to CVE-2025-29927 (range `>=14.0.0 <14.2.25`), an authorization-bypass via the `x-middleware-subrequest` header that causes Next.js to skip middleware execution entirely.
   - This is not just a generic CVE here — `app/portal/layout.tsx` independently trusts a client-presentable `x-pathname` header to decide whether a request is public (`PUBLIC_PREFIXES = ["/login", "/auth", "/password"]`). Normally `middleware.ts` overwrites this header authoritatively before the request reaches the layout. If middleware is skipped via the CVE, an attacker's own raw `x-pathname: /login` header passes through unmodified, bypassing both the middleware's auth check *and* the layout's independent check.
   - Fix: `npm install next@14.2.35` (or current 14.2.x patch) — `fixAvailable` reports this as non-breaking (no major version bump). Do this before any production deploy.

2. **Hero headline (and 11 other components) shows stale German text after switching to English** — Website
   - File: `components/TypewriterText.tsx`
   - The typing-animation `useEffect` has no dependency on the `text` prop — once typing finishes for the initial (German) text, changing `text` post-completion does not retrigger retyping. The visible span (`aria-hidden="true"`) keeps showing the old `displayed` state, while the `sr-only` span (read by screen readers/crawlers) updates immediately. Result: after toggling to English, screen readers and SEO/GEO crawlers see correct English text, but sighted users visually still see German — confirmed via screenshot on the live Hero section.
   - Affected components (12, via grep): `HeroSection`, `AboutSection`, `ProcessSection`, `FAQSection`, `ReadinessCheckSection`, `TestimonialsSection`, `ServicesSection`, `LifecycleSection`, `ContactSection`, `PortfolioSection`, `TechStackSection`, `CTASection`.
   - Fix: add `text` to the typing-effect's dependency array and reset `displayed`/`done`/`active` state whenever `text` changes (not just on first activation).

---

## High

3. **Unrestricted anonymous INSERT into `contact_submissions`, no server-side validation or rate limiting** — Website
   - File: Supabase RLS policy `anon_insert_only` on `public.contact_submissions` (flagged by `get_advisors` as `rls_policy_always_true`: `WITH CHECK (true)`), plus `app/api/contact/route.ts`
   - The RLS policy allows any anonymous request to insert arbitrary rows with no constraints. The API route only checks that `name`/`email` are non-empty strings (no format validation, no CAPTCHA, no rate limit).
   - Fix: add an email-format / length `CHECK` constraint at the DB or trigger level, and add basic rate limiting (e.g. IP-based) plus email-format validation in the route handler.

4. **`SECURITY DEFINER` functions directly callable via REST RPC by `anon`** — Portal/DB
   - Functions: `public.email_exists_in_portal(p_email text)`, `public.get_my_role()`, `public.handle_new_user()` — all flagged by `get_advisors` as callable via `/rest/v1/rpc/<fn>` by both `anon` and `authenticated` roles.
   - `email_exists_in_portal` in particular is a plausible email-enumeration vector if called repeatedly with different addresses by an unauthenticated caller.
   - Fix: confirm each is intentionally public. If not, `REVOKE EXECUTE` from `anon`/`authenticated` or switch to `SECURITY INVOKER`. `handle_new_user` is likely an auth trigger and probably doesn't need direct RPC exposure either.

5. **No HTTP security headers configured** — Website + Portal
   - File: `next.config.mjs` (currently `const nextConfig = {};` — no `headers()` function)
   - `curl -sI http://localhost:3000` returns no `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy`. Confirmed this is a real config gap (not just a dev-mode artifact) since there's no `headers()` function anywhere to produce them in prod either.
   - Fix: add a `headers()` function in `next.config.mjs` with at minimum CSP, `X-Frame-Options: DENY` (or `SAMEORIGIN`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

---

## Medium

6. **`<html lang="de">` is hardcoded and never updates on language toggle** — Website
   - File: `app/layout.tsx:216`
   - Confirmed via `document.documentElement.lang` eval after toggling to English — stays `"de"`. Mismatched `lang` attribute hurts screen-reader pronunciation and search-engine language signals once the page is in English.
   - Fix: since the homepage is `"use client"`, set `document.documentElement.lang` via an effect in `app/page.tsx` whenever `lang` state changes.

7. **`hreflang` alternate for English is inert** — Website
   - Files: `app/layout.tsx:29` (`"en-US": \`${SITE_URL}?lang=en\``), `app/page.tsx:26`
   - No code anywhere reads the `?lang=en` query param — `app/page.tsx` only has `useState<Lang>("de")`. The hreflang tag promises a distinct English URL that doesn't actually deliver English content; search engines following it just get the default German page.
   - Fix: either read `?lang=en` on mount to set initial language state, or drop the hreflang alternate until URL-based language switching exists.

8. **`FAQPage` JSON-LD is German-only and drifts from the visible (toggled) FAQ content** — Website
   - File: `app/layout.tsx:138-206`
   - The structured-data FAQ text is static German, embedded once at build/render time. When a visitor toggles to English, the visible FAQ section updates but the JSON-LD schema does not — AI answer engines (which lean heavily on FAQ schema) will index German answers regardless of page language.
   - Fix: either keep JSON-LD German-only deliberately (and document why), or generate it dynamically from `lib/translations.ts` per language if URL-based locales are ever added.

9. **`LocalBusiness` JSON-LD missing `PostalAddress`** — Website
   - File: `app/layout.tsx:77-108`
   - Only has `areaServed: { "@type": "Country", name: "Germany" }`, no street/city-level `address`. Weakens local-SEO and GEO relevance for any city/region-specific queries.
   - Fix: add a `PostalAddress` block if a business address can be disclosed (or `addressLocality`/`addressRegion` only, if street-level isn't desired).

10. **OG image is undersized/mismatched vs. recommended dimensions** — Website
    - File: `app/layout.tsx:39-46`
    - Metadata declares `width: 512, height: 512`, but the actual file `public/hm-labs-logo-v3.png` is 1024×1024 — a metadata/file mismatch — and neither matches the 1200×630 aspect ratio recommended for link-preview cards (Slack, Twitter/X, LinkedIn, WhatsApp).
    - Fix: create a dedicated 1200×630 OG image and update both the `width`/`height` metadata and the file reference.

11. **Dead "Home" anchor link in desktop section nav** — Website
    - File: `components/SectionNav.tsx`
    - `SECTIONS` includes `{ id: "home", label: "Home" }`, rendered as `<a href="#home">`, but no element with `id="home"` exists anywhere on the page (confirmed via `curl | grep -o 'id="[a-z]*"'` — only `about`, `contact`, `faq`, `lifecycle`, `portfolio`, `process`, `services` exist). Clicking the dot does nothing; its IntersectionObserver-based active-state highlighting also silently no-ops for this entry.
    - Fix: add `id="home"` to the top of the page (e.g. the Hero section wrapper), or remove the "Home" entry from `SECTIONS` and let scroll-to-top behavior live elsewhere.

12. **Leftover untranslated German strings in English mode** — Website
    - Confirmed via a full `document.body.innerText` dump while the page was in English:
      - `components/ServicesSection.tsx:188` — `"Beliebt"` (highlight badge on `SVC_01`, should be "Popular")
      - `components/ServicesSection.tsx:84` — `aria-label="Mehr Infos"` on the tooltip info button (hardcoded, not translated; also an a11y issue since screen readers announce it regardless of visible language)
      - `components/LifecycleSection.tsx:84` — `"KI-Assistent"` label inside the chatbot UI mockup
      - `components/HeroSection.tsx:119` — `"14 Tage"` floating badge text (hardcoded, not pulled from translations)
      - `lib/translations.ts` — `about.stats[1].val: "14 Tage"` rendered raw without `getText()` in `components/AboutSection.tsx:105-108` (the sibling `label` *is* translated, only `val` was missed)
      - `lib/translations.ts` — `portfolio.items[].tags` are plain string arrays (e.g. `["Next.js", "KI-Chatbot", "Google Ads"]`, `["KI-Chatbot", "CRM-Integration", "Automatisierung"]`, `["Web-App", "KI", "Automatisierung"]`) rendered via `components/PortfolioSection.tsx:86` with zero translation logic — these are tech/case-study tags so some words may be intentionally untranslated (e.g. proper nouns "Next.js"), but "KI-Chatbot", "Automatisierung", "KI" are plain German words with no English fallback.
    - Fix: wrap each in `getText()`/translations.ts entries, or for `tags`, convert to `{de:[], en:[]}` arrays.

13. **`ParticleNetwork` canvas animation ignores `prefers-reduced-motion`** — Website
    - File: `components/ParticleNetwork.tsx`
    - No `matchMedia("(prefers-reduced-motion: reduce)")` check found — the canvas animates continuously regardless of OS-level motion preference, a real CPU/battery cost on mobile and an accessibility miss for motion-sensitive users.
    - Fix: check `prefers-reduced-motion` on mount and either skip the animation loop or render a static frame.

14. **Hero/About/Services images: large PNG fallback behind otherwise-correct `<picture>`/WebP setup** — Website
    - Files: `components/HeroSection.tsx:78-79`, `components/AboutSection.tsx:80-81`, `components/ServicesSection.tsx:252-253`
    - Good news first: all three already use `<picture><source srcSet="*.webp" type="image/webp" /><img src="*.png" /></picture>`, so every modern browser loads the small WebP (204KB–364KB), not the PNG. This is better than initially appeared from a flat `<img>` grep.
    - Remaining issue: the PNG fallback (for browsers without WebP support) is needlessly huge — `hero-bg.png` 5.7MB, `henry-portrait-new.png` 5.5MB, `services-visual.png` 4.2MB. Also, since these aren't `next/image`, there's no automatic responsive `srcset` for different viewport widths (same image served to mobile and 4K desktop alike).
    - Fix: compress the PNG fallbacks (they don't need source quality, just a safety net), and consider migrating to `next/image` with `<picture>`-equivalent `formats` config for automatic responsive sizing.

15. **Lighthouse LCP of 5.6s against dev server** — Website
    - Lighthouse performance category score came back `null` (incomplete — common in `next dev` due to HMR/unminified bundles, not representative of production) but did report **LCP: 5.6s** (target: <2.5s), FCP 2.1s, TBT 0ms, CLS 0.
    - Caveat per skill instructions: dev mode numbers aren't reliable for an absolute performance grade. But the LCP figure lines up with finding #14 (largest image assets) and is worth re-measuring against a production build (`npm run build && npm start`) before launch.
    - Fix: re-run Lighthouse against a production build; if LCP is still high, the Hero background image (`hero-bg.webp`/`.png`) is the most likely LCP element to optimize/preload.

16. **Supabase Auth: leaked-password protection disabled** — Portal
    - `get_advisors` flags `auth_leaked_password_protection`: HaveIBeenPwned checking is currently off for new passwords.
    - Fix: enable in Supabase Auth settings — low-effort, meaningfully reduces credential-stuffing risk for portal accounts.

17. **`set_updated_at` Postgres function has mutable `search_path`** — Portal/DB
    - `get_advisors` flags `function_search_path_mutable` for `public.set_updated_at`.
    - Fix: add `SET search_path = public` (or appropriate fixed path) to the function definition — standard hardening against search-path hijacking, low real-world exploitability here but a one-line fix.

---

## Low

18. **`app/sitemap.ts` has only 3 static entries** — Website
    - Home, `/impressum`, `/datenschutz` — doesn't represent the full crawlable surface, though impact is limited since the marketing site is largely a single page with in-page anchors rather than separate routes.
    - Fix: low priority given the current single-page architecture; revisit if more standalone routes are added.

19. **Non-constant-time secret comparison in webhook auth** — Website (backend)
    - Files: `app/api/webhooks/milestone-completed/route.ts`, `app/api/webhooks/new-message/route.ts`
    - Both use `auth === \`Bearer ${secret}\`` (regular `===`), a theoretical timing-attack surface. Low real-world risk for a low-traffic internal webhook, but a `crypto.timingSafeEqual` swap is cheap insurance.

---

## Decision needed (not a bug — needs a product decision)

20. **Portal has zero English localization.** Confirmed via `grep -rl "translations\|Lang" app/portal app/portal/_components` — no hits. Decide whether this is intentional (internal/admin-only tool, German-speaking team) before treating it as a gap. If client-facing portal users are expected to be non-German-speaking, this becomes a real product gap.

21. **`/impressum` and `/datenschutz` are German-only** with no indication for non-German visitors that these are legal-only pages. Standard practice under German *Impressumspflicht* — flagged as an observation, not a bug, unless a decision is made to add a brief English notice (e.g. "This legal notice is provided in German as required by German law").

---

## Resolved since the skill was last updated (confirmed during this audit, no action needed)

- `public/robots.txt` exists and is correctly configured (`Allow: /`, sitemap reference, no AI-crawler blocks for GPTBot/ClaudeBot/PerplexityBot/Google-Extended).
- `public/llms.txt` exists at the project root.
- No horizontal-scroll/overflow bugs at any tested viewport: website at 375×667, 390×844, 768×1024, 1280×800, 1920×1080; portal `/login` at 375×667, 390×844, 768×1024.
- Exactly one `<h1>` on the homepage, 11 `<h2>`s — logical heading hierarchy, no duplication.
- Server-rendered HTML contains the full page text (confirmed via `curl`) despite the homepage being entirely `"use client"` — good for SEO/GEO, no empty-shell-to-crawlers issue.
- Server Actions (`app/portal/clients/_actions.ts` and others) correctly call `requireAdmin()`/`requireAuth()` as the first line — role checks are enforced server-side, not just hidden in the UI.
- `/api/v1/clients` and `/api/v1/clients/[id]` are properly gated by `verifyApiKey()` (SHA-256 hashed comparison, revocation check, `last_used_at` tracking); PATCH uses a field whitelist preventing mass-assignment.
- Webhook routes (`milestone-completed`, `new-message`) properly gate on a bearer-secret comparison before processing.
- `.env.local`: no sensitive value is accidentally prefixed `NEXT_PUBLIC_` — `SUPABASE_SERVICE_ROLE_KEY` correctly lacks the prefix.
- All 14 Supabase tables have Row Level Security **enabled** (`clients`, `projects`, `project_milestones`, `invoices`, `contact_submissions`, `team_members`, `lessons_learned`, `project_briefs`, `project_decisions`, `project_feedback`, `profiles`, `api_keys`, `tasks`, `messages`, `client_files`).
- `npm audit`: only 2 vulnerable packages total (`next` critical — see Critical #1; `postcss` moderate, transitively bundled via `next`, resolved by the same upgrade).

## Not tested (requires portal login)

- Mobile-first layout for `/leads`, `/clients`, `/projects`, `/messages`, `/admins`, `/api-keys`, `/settings`.
- `/portal/api-keys`: whether a generated key is shown only once and not retrievable in plaintext afterward.
- Per-page navigation timing and Lighthouse for an authenticated portal page.
- DE/EN visual check inside the portal (moot per finding #20 — no translation system exists yet).

Re-run these once a logged-in `qa-portal` Playwright session is available.
