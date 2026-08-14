# Progress Tracker

**Last updated:** 2026-08-14 (MBA faculty premium cards)
**Phase:** Phase 1 — Active Development

Update this file after every meaningful implementation task.

---

## Completed

- Design system in `src/app/globals.css` (tokens, utilities, buttons, cards, inputs)
- Layout shell: `PromotionalBanner`, `Header`, `Footer`, `MobileNav`, `Container`
- **Header nav trim (2026-07-17):** `HEADER_NAV` limited to About Us, Faculty, Blogs, Contact Us (desktop + mobile)
- Homepage (`src/app/page.tsx`) — all major sections wired
- **Homepage visual QA pass (2026-07-14, second polish)**
- CAT / IPMAT / GDPI / CLAT category landings via `CategoryHeroSection`
- **Homepage + category UI refinements (2026-07-14):**
  - Unified `Badge` component (shared radius/padding/typography) on blog + courses
  - `.section-header` locked to **25px** bottom margin site-wide
  - Header exam switcher syncs to current category URL
  - Hero trust metrics + floating feature cards use premium PNG icons
  - Category Test Series cards use approved `ts-mocks` / `ts-sectional` / `ts-topic` / `ts-mini-mocks` assets
- **Category landings parity with CAT (2026-07-14):** CLAT / GDPI / IPMAT + homepage use shared `ResultsStatsPanel`; testimonials sections added after results; alternating `bg-bg-secondary/40` matches CAT
- **Category landings content polish (2026-07-14):**
  - Expanded IPMAT/GDPI/CLAT courses (4 each), faculty, and toppers
  - Shared `ResultsStatsPanel` (2 key stats, homepage visual) on home + all category pages
  - New `TestimonialCard` + testimonials carousel on every category landing
- Project knowledge base + Cursor rules
- **FAQ listing (`/faq`) (2026-07-14):** search, category filter pills, accordion (plus icon), pagination (10/page), footer CTA → Contact / Rodha Buddy; data in `src/data/faq.ts`
- **Legal pages (2026-07-14):** Privacy, Terms, Refund, Disclaimer via shared `LegalPageLayout` + `src/data/legal.ts` (TOC sidebar, structured sections, grievance contact)
- **Meet the Team assets (2026-07-16):** Hero photo, themed PNG icons (hero stats + culture), `Cta-left.png`, advisor quote SVG — under `public/assets/images/meet the team/`
- **Meet the Team page `/team` (2026-07-16):** Full page — hero, leadership carousel, faculty experts carousel, advisors grid, culture values, CTA band; reuses homepage profile cutouts for cards; Header About Us + Footer Meet the Team active states
- **Meet the Team UI QA (2026-07-16):** Edge-bleed hero, section bg/labels, leadership divider + LinkedIn, faculty overlay cards, advisor flush layout, culture 4-col dividers, CTA decorative bg + orange arrow secondary
- **Meet the Team QA pass 2 (2026-07-16):** Fixed faculty carousel overlap (`block` + slide width); advisors left/right split + 4-field cards; culture split layout; CTA `object-cover` fill; LinkedIn transparent white border + filled icon
- **CAT landing section order (2026-07-17):** Hero → Results → Courses → Faculty → Test Series → Testimonials → Resources → FAQs → CTA
- **Category taxonomy refresh (2026-07-17):** Five primary verticals — MBA (`/mba`, CAT+GDPI merged), Integrated (`/ipmat`), Law (`/clat`), Banking (`/banking`), Skill House (`/skillhouse`). Switcher shows short trigger + full `menuLabel`. Redirects `/cat` & `/gdpi` → `/mba`. Same section layout/assets reused for new pages.
- **SSR-first UI polish (2026-07-17):** Added lightweight `RevealGroup`, testimonial carousel autoplay, observer-based floating counselling CTA, Skill House display rename, JSON-LD helpers (Organization / Breadcrumb / FAQ), and Next 16 image preload cleanup while keeping sections server-rendered.
- **Premium motion system (2026-07-17):** Added CSS-first section reveals, shared 4px card lift/glow interactions, selective animated borders and shine sweeps, hero/CTA atmospheric lighting, reusable `AmbientBackground` SVG patterns, refined navigation/floating CTA motion, and slower testimonial autoplay. All motion respects `prefers-reduced-motion`; no animation library or scroll listener added.
- **Premium motion refinements (2026-07-17):** Stronger accent-aware border glow (16s), slower/softer staggered shine (11s + 1.5s delays), outlined CTA silver glow/shine (`.btn-outlined-premium`), Faculty/Test Series/View All coverage, floating counselling CTA observes `[data-counselling-cta]` only, and category landing parity with homepage ambient/reveal/shine patterns.
- **Hover shine sweep utility (2026-07-17):** Added `.shine-sweep-hover` — one-shot diagonal light sweep on card hover (0.72s, no loop). Applied to results/topper cards, stats panel, course/faculty/testimonial/advisor/value-prop cards; coexists with existing `.shine-sweep` ambient animation and `.card-premium-hover` lift/glow.
- **Shine-splash hover (2026-07-17):** Added `.hover-shine` (reference skewed light band, 1s). Replaced `.shine-sweep*` on TopperCard, CourseCard, FacultyCard, ValuePropCard, and AdvisorCard so `::after` effects do not conflict. Extended to LeadershipCard, FacultyExpertCard, and BlogCard.
- **CTA border glow (2026-07-17):** Border glow sped to 6s with stronger focused peak. Orange CTAs use `.glow-accent-orange`; white outline CTAs keep `.glow-accent-silver` (intensified).
- **Faculty listing `/faculty` (2026-07-20):** Full page — split hero (`FacultyHeroSection` + `hero-faulty.png`), filter bar (search/subject/experience/rating/sort), featured faculty carousel (`FacultyExpertCard`), paginated grid (`FacultyCard`), why-learn value props, CTA band, BreadcrumbList JSON-LD; data/helpers in `src/data/faculty.ts`
- **Faculty listing UI refresh (2026-07-20):** 4-col hero stats (incl. rating); filters moved into All Faculty with `DropdownSelect` (header-style); new vertical `FacultyListingCard` for featured + grid (xl 4 / 2xl 5 cols); rating filter removed; pagination 15/page
- **Faculty detail `/faculty/[slug]` (2026-07-21):** Full mock-aligned page — detail hero, info cards, courses, achievements+publications, reviews+videos, results podium banner, 3-action CTABand; dedicated Faculty* card variants; optional detail fields with empty sections hidden; full payloads for Nishant Agarwal, Anand Mishra, Neha Agarwal; `personJsonLd` + `generateStaticParams`
- **Homepage v2 redesign (2026-07-24):** New `HomePage` at `/` with neural-network hero canvas, counselling form, YouTube embed, floating stats, impact timeline, alternating results cards, app promo placeholder, updated CTA copy. Legacy homepage frozen at `/legacy-homepage` via unchanged `LegacyHomePage`.
- **Homepage v2 refinements (2026-07-24):** Hero layout tightened (2-line title, click-to-play video, `DropdownSelect` form, section-wide neural mouse); light categories/impact sections with gradient blends; impact milestone pills + left stat badges; footer v2 5-column layout; app mockup asset integrated.
- **Homepage premium polish (2026-07-24):** Continuous `HomePageBackground` gradient canvas; transparent homepage sections; hero 7/5 column rebalance (form before description, trust metrics below video); fixed `+91` phone prefix; dropdown z-index/clipping fix; floating stats repositioned at 90% opacity; impact timeline X-axis (years below path, growth chips); horizontal `ImpactStatsRow` with 3D PNG icons; announcement bar v2 styling; Play Store full-colour SVG icon.
- **Hero layout refinements (2026-07-24):** 6/6 grid with compact `max-w-[28rem]` content block (title + form + copy aligned); video at full right-column width (~50% hero); floating badges anchored to video edges; tighter vertical spacing for first-viewport fit.
- **Hero badge flex column (2026-07-24):** Stat badges moved to a full-width row above the YouTube embed (flex-col stack: badges → video → trust metrics); solid `bg-bg-tertiary` badges (no glass/opacity); `HeroFloatingStats` simplified to Server Component (parallax removed).
- **Impact timeline layout (2026-07-24):** Restored growth-path student count badges (alternating above/below nodes); timeline axis row below path with year, title, and description per milestone.
- **Continuous homepage gradient (2026-07-24):** Document-height `body.home-gradient-page` gradient (homepage-only via `HomePageBodyTheme`); accent-only canvas glow; transparent footer on `/`; removed Results `AmbientBackground` overlay.
- **Homepage CTA band v2 layout (2026-07-24):** Extended `CTABand` with `backgroundImage`, `titleAccent`, and `secondaryOutline` props; home page uses `home-cta-bg.png`, split white/orange headline, left copy + right buttons, orange-outline secondary.
- **Homepage background flow fixes (2026-07-24):** Removed hero bottom vignette; tuned `body.home-gradient-page` stops; wired `home-section-light` on Impact/Results, `home-section-transition-to-dark` on App promo; Categories reverted to dark-theme text; `ExamCard` accent tint/glow; light `btn-view-all` on Results; CTA dark card bg + visible bg image + accent line break; Impact 3-line heading.
- **Homepage final background polish (2026-07-24):** Single document-height `body.home-gradient-page` layer (`background-size: 100% 100%`); removed all section-specific backgrounds/blend overlays (`home-section-light`, `home-section-transition-to-dark`, canvas glow); `home-on-light` text-only utility on Impact/Results; CTA buttons shifted left with right padding to clear artwork; Back to Top fixed above footer legal links.
- **Homepage section-anchored gradient (2026-07-24):** `HomePageGradientAnchors` measures section boundaries and drives CSS vars for dark→light→dark flow; `HomeTopZone` spans Hero+Categories with shared neural canvas + fade mask; `home-section-spacing` / `home-section-spacing-lg` utilities; heading line breaks fixed in Impact (3-line), Results (2-line), CTA (2-line block layout).
- **Homepage warm-orange gradient blend (2026-07-24):** 7-phase anchor system (`hero-blend-start` through `page-end`) measured against full body height incl. footer; 18-stop linear gradient with warm-orange middle phase (lower hero → categories → light); flat light plateau for Impact/Results; gradual light→dark through App Promo/CTA/Footer; reduced mid-page radial banding; softer neural canvas mask fade.
- **Homepage gradient transition fix (2026-07-24):** Neural canvas scoped to `#site-hero` only (`HomeHeroShell`); removed canvas bg glow/vignette fills and `HomeTopZone` wrapper; gradient anchors at hero bottom + categories bottom + impact top; proportional CSS stops between anchors; homepage header transparent with backdrop blur; removed top radial banding.
- **Homepage categories orange-to-white fade (2026-07-24):** Added `--home-warm-fade-start` anchor (58% through Categories); orange peak at 38% Categories height; light plateau starts 32% into Impact; 10-stop proportional fade from warm-fade to light for seamless Categories→Impact transition.
- **Homepage dark-to-orange fade (2026-07-24):** Replaced hero-bottom anchor with `--home-warm-blend-start` at 30% through Hero; 14-stop proportional ramp from dark through warm-blend to orange-peak; orange→white anchors unchanged.
- **Homepage bottom black plateau + text (2026-07-24):** Neutral light→`#0a0a0a` gradient (no brown stops) from Results tail through mid-CTA; solid black footer; removed bottom radial glow; app promo icon removed + white description; hero stats/body + categories subtitle → white; CTABand card unchanged.
- **Counselling modal dialog (2026-07-24):** Global `CounsellingModalProvider` reuses `HeroCounsellingForm` in `Modal`; site-wide counselling CTAs (`CounsellingCtaButton` / `CounsellingCtaAction`) open dialog instead of `/contact`; homepage category cards open modal with exam pre-selected; floating CTA hides when modal open or inline `[data-counselling-cta]` in view.
- **Hero video autoplay on click (2026-07-24):** `HeroVideoEmbed` iframe loads with `autoplay=1` after custom play click so YouTube starts immediately (no second play button); still no autoplay on page load.
- **Opaque site header (2026-07-24):** `.site-header` uses solid `bg-primary` on non-home routes; homepage uses transparent header + backdrop blur via `body.home-gradient-page .site-header`.
- **Site header frosted bar (2026-07-24):** Removed homepage transparent header override; unified `.site-header` to near-opaque `rgba(10,10,10,0.94)` with `blur(12px)` on all routes.
- **App promo light typography (2026-07-24):** `HomeAppPromotionSection` uses `home-on-light` black heading/body copy; orange accent on "Rodha App" only; glowing Rodha logo title icon; light-theme store buttons.
- **Homepage bottom orange gradient ramp (2026-07-24):** Light plateau through Results only; cream→orange ramp spans full App Promo (`--home-bottom-warm-start` → `--home-bottom-orange-peak`); orange→dark completes through CTA; neutral gray stops removed.
- **Dropdown menu UX (2026-07-27):** Hero counselling form dropdown no longer clipped (`HomeHeroShell` overflow-visible); shared `.dropdown-option` hover/active styles on `DropdownSelect`, header exam switcher, and contact/lead forms.
- **MBA homepage-theme alignment (2026-08-13):** `/mba` only — peach/white alternating sections, `SectionHeaderV2`, dual-row results marquees (`TopperCardV2` + light `ResultsStatsPanel`), light `CourseCardV2`/`TestSeriesCardV2`/`FacultyCardV2`, `CTABandV2Decorative` (image-left), polished `HomeAppPromotionSection`. Hero + other dark category pages unchanged.
- **MBA section polish (2026-08-13):** Fixed `section-header-badge` white text under `.home-on-light`; results row 2 container-width; compact no-image program cards; centered badge headers; peach test-series cards; faculty bottom CTA; dark testimonials restored.
- **MBA faculty cards premium (2026-08-14):** `FacultyCardV2` matched to `TopperCardV2` layout (white variant + `.border-image-gradient-t-light`); MBA marquee uses `getMbaStarFaculty()` with cutouts from `rodha faculty profile` matched by name.
- **MBA route → `/cat` (2026-08-14):** Category landing moved from `/mba` to `/cat`; `CATEGORIES` slug `cat`; nav/footer/switcher/links updated; `/mba` & `/gdpi` redirect to `/cat`; `getCategoryPath()` maps category id → public path.

---

## In Progress / Partial

| Item | Status | Notes |
|------|--------|-------|
| Homepage vs approved PNG | Partial | Premium polish shipped (continuous canvas, hero rebalance, timeline X-axis); app store URLs still TBD |
| Header category-state nav | Partial | Exam switcher URL-sync done; full category-state nav links still TBD |
| Category hero photography | Partial | Non-MBA landings reuse `cat-hero.jpg` with category overlay text |

---

## Remaining Tasks

### Assets still needed
- [ ] Transparent faculty / student PNGs
- [ ] Dedicated IPMAT / Law / Banking / Skill House hero images
- [ ] Dedicated leadership / advisor headshots (interim: homepage `profiles/`)
- [ ] App promotion store URLs (mockup asset integrated)

### Screens
- [ ] About / Blog / Contact / Course detail
- [x] Faculty listing `/faculty`
- [x] Faculty detail `/faculty/[slug]`
- [x] Meet the Team `/team`
- [x] FAQ listing (`/faq`)
- [x] Legal pages (Privacy / Terms / Refund / Disclaimer)
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
