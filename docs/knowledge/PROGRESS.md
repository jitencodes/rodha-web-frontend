# Progress Tracker

**Last updated:** 2026-08-16 (theme + dynamic category rollout)
**Phase:** Phase 1 — Active Development

Update this file after every meaningful implementation task.

---

## Completed

- Design system in `src/app/globals.css` (tokens, utilities, buttons, cards, inputs)
- Layout shell: `PromotionalBanner`, `Header`, `Footer`, `MobileNav`, `Container`
- **Header nav trim (2026-07-17):** `HEADER_NAV` limited to About Us, Faculty, Blogs, Contact Us (desktop + mobile)
- Homepage (`src/app/page.tsx`) — all major sections wired
- Project knowledge base + Cursor rules
- **FAQ listing (`/faq`) (2026-07-14):** search, category filter pills, accordion, pagination; data in `src/data/faq.ts`
- **Legal pages (2026-07-14):** Privacy, Terms, Refund, Disclaimer via shared `LegalPageLayout` + `src/data/legal.ts`
- **Meet the Team `/team` (2026-07-16):** Full page — hero, leadership, faculty experts, advisors, culture, CTA
- **Faculty listing `/faculty` + detail `/faculty/[slug]` (2026-07-20/21)**
- **Homepage v2 redesign + gradient/canvas polish (2026-07-24)** — live at `/`; legacy frozen at `/legacy-homepage`
- **Counselling modal dialog (2026-07-24):** Global provider + site-wide counselling CTAs
- **MBA homepage-theme alignment + `/cat` route (2026-08-13/14):** CAT V2 mixed-theme; internal id `mba` vs slug `cat`
- **Theme + dynamic category rollout (2026-08-16):**
  - Canonical category URLs: `/category/[category_slug]` (+ nested courses); one JSON SoT (`category-landings.json`) + `CategoryLandingPage` CAT V2 template for all five verticals
  - Permanent redirects: `/cat|ipmat|clat|banking|skillhouse` (+ nested), `/mba`, `/gdpi` → `/category/...` (no chains)
  - Scoped mixed-theme tokens (`section-white/beige/cream`, `brand-orange`) + `docs/style.md`; homepage `/` and `/legacy-homepage` composition preserved
  - Live non-reference pages restyled with white/beige/dark alternation (About, Contact, Blog, FAQ, Team, Faculty listing/detail, Legal)
  - Path helpers, Header/MobileNav active slug under `/category/...`, Footer/nav/CTA/link surfaces updated

---

## In Progress / Partial

| Item | Status | Notes |
|------|--------|-------|
| Homepage vs approved PNG | Partial | Premium polish shipped; app store URLs still TBD |
| Header category-state nav | Partial | Exam switcher syncs under `/category/[slug]`; full category-state nav links still TBD |
| Category hero photography | Partial | Non-MBA landings still share CAT hero photo until dedicated assets arrive |

---

## Remaining Tasks

### Assets still needed
- [ ] Transparent faculty / student PNGs
- [ ] Dedicated IPMAT / Law / Banking / Skill House hero images
- [ ] Dedicated leadership / advisor headshots (interim: homepage `profiles/`)
- [ ] App promotion store URLs (mockup asset integrated)

### Screens
- [ ] About / Blog / Contact / Course detail (content depth; mixed-theme shells done)
- [x] Faculty listing `/faculty`
- [x] Faculty detail `/faculty/[slug]`
- [x] Meet the Team `/team`
- [x] FAQ listing (`/faq`)
- [x] Legal pages (Privacy / Terms / Refund / Disclaimer)
- [x] Dynamic category landings `/category/[category_slug]`
- [ ] Promo popup

### Integrations
- [ ] Final external URLs, forms, sitemap

---

## Blockers

| Item | Owner | Impact |
|------|-------|--------|
| Transparent faculty / student PNGs | Client | Course/Faculty/Results cutout look |
| Graphy / ThinkExam / Buddy URLs | Client | CTA targets |
| Category-specific hero photos | Client | Unique hero visuals per exam |

---

## Technical Debt

- Form stubs still TODO
- Some toppers reuse portrait files
- Non-MBA landings share CAT hero photo until dedicated assets arrive
- Faculty detail body cards still use dark `card-base` islands on light section shells (intentional mixed theme)
