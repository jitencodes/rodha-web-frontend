# Decision Log

Log significant architectural and implementation decisions here. Append new entries at the top (newest first).

Format:

```
### YYYY-MM-DD — Short title
- **Decision:** …
- **Rationale:** …
- **Alternatives considered:** …
- **Consequences:** …
```

---

### 2026-08-20 — IPMAT results, homepage CAT/IPMAT carousels, live app store URLs
- **Decision:** Keep CAT's 35 result cards and add 16 IPMAT cards as the only student-result datasets. Homepage results show two banner slides (CAT, IPMAT) with a max of 10 cards each. IPMAT cards display AIR rank when present and an Achiever/Topper placeholder otherwise. The category results section renders only on CAT and IPMAT. Rodha App / Rodha Buddy store buttons use the supplied Play Store and App Store URLs.
- **Rationale:** Product supplied IPMAT convert photos and asked to stop showing placeholder CAT students on other verticals and extra homepage result slides.
- **Alternatives considered:** Keep four homepage result banners; show percentile on IPMAT cards; leave empty result marquees on CLAT/SSC/Skill House.
- **Consequences:** Other verticals no longer have a `#results` section or Results nav link. IPMAT stories use the seven supplied YouTube interviews. Re-run `node scripts/sync-ipmat-results.mjs` (requires `sharp`) if Drive portraits change.

### 2026-08-20 — Hero videos + faculty Graphy-id course matching
- **Decision:** Pass distinct YouTube ids into existing `HeroVideoEmbed` (homepage default + optional `hero.videoId` per category landing). Enrich all 18 faculty from `Rodha Faculty (1).docx` (including the former portrait-only six). Faculty detail courses use authored `courseGraphyIds` resolved against existing `category-landings.json` cards only — never invent course records. Skip doc links with no matching card (CAT R1 comprehensive, COMPLETE OMETS 2026). Empty `courseGraphyIds` hides the courses section (Tarun).
- **Rationale:** Product supplied new hero videos and an updated faculty sheet with Graphy course links; UI must stay intact while course lists stay accurate to live catalog cards.
- **Alternatives considered:** Keep name-string matching on course `faculty` fields; fabricate missing R1/OMETS cards; invent YouTube ids for title-only snippets.
- **Consequences:** CLAT/SSC/Skill House `facultyIds` realigned to doc roles; Skill House faculty carousel shows Divya only; Tarun detail has no courses block.

### 2026-08-20 — Content & SEO migration from rodha.co.in
- **Decision:** Replace dummy blog/FAQ/legal content with live Rodha sources without UI redesign. Featured faculty uses ordered `FEATURED_FACULTY_SLUGS` (13 names). Blogs: 9 full articles + local images; categories trimmed to All/MBA/IPMAT/SSC. Legal: migrate Privacy/Terms/Refund verbatim into `LegalSection` blocks; Disclaimer synthesized from Terms §11 + Rodha product facts and flagged for legal review (no dedicated old-site disclaimer page). FAQ listing aggregates Home + category FAQs with vertical filters. SEO uses shared `buildPageMetadata`, default OG `public/assets/og/og-rodha.png`, and `webSiteJsonLd`. Canonical host remains `SITE_URL` (`https://rodha.in`).
- **Rationale:** Preserve rankings/content accuracy while keeping existing layouts; avoid inventing missing legal/blog material.
- **Alternatives considered:** Keeping dummy blogs as fallback; inventing Disclaimer copy without Terms sourcing; changing SITE_URL to rodha.co.in in this pass.
- **Consequences:** Skill House FAQ count is 5 after deduping identical “Are sessions live or recorded?” with CLAT. Some in-article links still point at non-migrated `ipmat.rodha.co.in` posts. Privacy Policy retains Graphy-template GDPR/CCPA/PDPB wording pending counsel review. Sitemap/robots still pending.

### 2026-08-20 — SMTP lead emails for all website forms
- **Decision:** Add `POST /api/leads` (Node runtime + Nodemailer) as the single backend for Contact, Hero/Modal counselling, LeadCapture, and Newsletter forms. Notify `support@rodha.co.in` with a light-theme Rodha HTML template. Logo uses a fixed absolute URL rooted at `NEXT_PUBLIC_BASE_URL` / `https://rodha.co.in` (never the request Host). Prefer server-only `EMAIL_SMTP_*` secrets; accept `NEXT_PUBLIC_EMAIL_*` as a temporary fallback.
- **Rationale:** Phase 1 needs working lead capture without a CRM; Gmail SMTP matches provided credentials; absolute logo URLs keep email images working from localhost and preview deploys.
- **Alternatives considered:** Third-party form SaaS; Graphy webhooks; deriving asset base from `request.url`.
- **Consequences:** Forms show success/error states; SMTP misconfiguration returns 502; Gmail may block SVG logos in some clients — prefer hosting a PNG/WebP at the same absolute path if deliverability issues appear.

### 2026-08-20 — Faculty real-data cleanup + dynamic reviews/courses/filters
- **Decision:** Remove all dummy faculty from `src/data/faculty.ts`. Enrich 12 verified profiles from `Rodha Faculty.docx` (achievements, philosophy, YouTube snippets). Keep 6 portrait-only faculty without inventing detail content. Faculty reviews are selected at build/request time from category-landing testimonials (name → subject → category relevance, max 3). Faculty courses come from landing course `faculty` strings. Course filter chips are derived from present `courseType` values and hidden when only one type exists. Featured Faculty reuses category `InfiniteMarquee`. Team Faculty Experts / Advisors are commented out of render; `LovedTeamSection` reuses existing CTA images in a full-width `Carousel`.
- **Rationale:** Product requires original data only; fabricated publications/reviews/videos/courses misrepresent faculty. Reuse existing carousel/modal patterns for consistency and accessibility (`prefers-reduced-motion` on marquee + carousel).
- **Alternatives considered:** Keep dummy faculty in listing only; hardcode review IDs per faculty; separate faculty course card grid.
- **Consequences:** `withFacultyDetailDefaults()` no longer fabricates achievements/publications/videos/courses; Publications UI unused; AdvisorsSection kept for later; Results Attributed remains static until real data arrives.

### 2026-08-20 — Category course filter chips + sheet-driven catalog
- **Decision:** Keep the category course slider and `CourseCardV2` layout unchanged. Add a client `CategoryCoursesSlider` with four light filter chips (All default, Comprehensive, Individual, Crash Course) driven by a new `courseType` field. Replace all five verticals' course records from the supplied sheet, download named thumbnails locally, and keep enrolment on the external Graphy/ThinkExam URLs.
- **Rationale:** Categories now have mixed course types in one carousel; filtering must not require a new card or slider. Local thumbnails avoid remote `next/image` host config. Mapping: Comprehensive / All-In-One / Program → comprehensive; Individual / Self-Paced / Single Module / Practice Engine → individual; Crash Course → crash; Free and mock packages → All only.
- **Alternatives considered:** URL query filters like blog; extra chips for Mocks/Free; changing card layout for long titles.
- **Consequences:** CAT All includes mock packages as well as live batches; CAT test-series posters keep their design but now link to the live ThinkExam package URLs. Re-run `node scripts/sync-category-courses.mjs` when the sheet changes.

---

### 2026-08-20 — Faculty detail light mixed-theme + data defaults
- **Decision:** Upgrade `/faculty/[slug]` in place: keep dark hero (aligned with Faculty listing / Blog / category landings); convert body to white/beige mixed theme with local light card classes (no global `.card-base` change). Split About / Philosophy / Expertise into three cards. Add `withFacultyDetailDefaults()` so all ~36 faculty slugs render complete pages; rich authored entries (Nishant, Anand, Neha) override defaults. Icon keys in JSON resolved via `src/lib/faculty-icons.tsx` (`react-icons`). Extend `CTABandV2Decorative` with optional `tertiaryAction` for faculty detail Rodha Buddy CTA only.
- **Rationale:** Reference layout requires three info cards and light surfaces; sparse faculty entries broke detail pages; scoped light styling avoids homepage/category regressions.
- **Alternatives considered:** Light hero for entire page; per-faculty page files; storing React icon components in JSON.
- **Consequences:** `getFacultyBySlug` always returns merged detail data; listing page unchanged; `react-icons` added as dependency.

---

### 2026-08-19 — Blog pages use article BlogCard variant, URL-driven filters, static HTML content
- **Decision:** Build `/blog` listing and `/blog/[slug]` detail from the approved blog UI reference screens. Add `variant="article"` to `BlogCard` (white card with category link badge, calendar/clock meta) while keeping the legacy `variant="overlay"` (dark overlay card) as the default so the frozen legacy homepage is unaffected. Category filtering and search are URL-driven (`/blog?category=ipmat&q=…`), server-rendered. Blog content is static trusted HTML rendered via `dangerouslySetInnerHTML` + `.blog-prose` CSS — no markdown library. `Pagination` extended with `basePath`/`query` URL mode and `variant="light"`. Sidebar replaces the reference's "On This Page" with reusable `BlogCategories` + `ShareBlog` components. No author UI, no newsletter section.
- **Rationale:** URL-driven filtering allows SSR/SSG and shareable filtered views. Static HTML content keeps the stack simple until a CMS is introduced (Phase 2). Overlay vs article variants avoid a risky refactor of the legacy card.
- **Alternatives considered:** Client-side filtering with `useState`; markdown-to-HTML library; single card component with CSS-only theme switch.
- **Consequences:** `BlogPost` type has deprecated compat fields (`excerpt`, `image`, `publishedAt`, `author`) for the legacy homepage; these should be removed when legacy is retired. Blog thumbnails reuse `hero-blog.png` and placeholder SVG until dedicated images arrive.

---

### 2026-08-17 — About and Contact pages use page-local data and CAT faculty cards
- **Decision:** Ship full mixed-theme `/about` and `/contact` layouts from the supplied UI references. Keep canonical routes `/about` and `/contact` (no `/about-us`). Reuse CAT `FacultyCardV2` plus `Carousel` on About. Keep Footer `CONTACT_INFO` unchanged and store Contact page phone/email/address/map in `src/data/contact.ts`. Add optional `variant="light"` on `Input` / `Textarea` / `DropdownSelect` (default remains dark). Contact form keeps counselling +91 phone chrome and stub submit.
- **Rationale:** Header/Footer/homepage/category pages are locked; Contact page numbers differ from current footer placeholders; counselling modal must stay intact.
- **Alternatives considered:** Redirect `/about-us`; mutate global `CONTACT_INFO`; new faculty card; reuse homepage `ImpactGrowthTimeline` / `CTABandV2Decorative` for mismatched mocks.
- **Consequences:** About hero uses the team-hero photograph until a dedicated building asset arrives; form backend remains TODO; Footer contact details can be updated later without restyling Contact.

---
- **Decision:** Render `category.courses` directly in the shared category course slider and remove the duplicate `featuredCourses` JSON collection. Use the reusable `Carousel` with responsive 1/2/4-card sizing, desktop arrow controls, mouse pointer dragging, and native touch swiping.
- **Rationale:** Every configured course should appear, duplicated course collections were drifting out of sync, and users need deliberate slider controls instead of automatic continuous motion.
- **Alternatives considered:** Keep a four-card grid; maintain separate `courses` and `featuredCourses`; use a continuously moving marquee.
- **Consequences:** All category verticals receive the same responsive course-slider behavior; CAT course cards use direct Rodha course URLs while internal detail routes remain available for courses without an external link.

---

### 2026-08-17 — Category content schema follows rendered sections
- **Decision:** Keep category-specific hero stats, typewriter phrases, test-series posters, result records, testimonials, and faculty selections in `category-landings.json`; make the shared hero and cards consume those values. Remove legacy category fields that the current landing template does not render.
- **Rationale:** Each vertical needs independent content without duplicating or changing the shared page layout.
- **Alternatives considered:** Hardcode CAT content in components; preserve unused legacy blocks for hypothetical future sections.
- **Consequences:** Other verticals retain their current presentation and can adopt poster images or rotating hero phrases through the same optional data fields; removed sections must be reintroduced explicitly if the layout later needs them.

---

### 2026-08-16 — Dynamic `/category/[slug]` + sitewide mixed theme
- **Decision:** Canonical category URLs live under `/category/[category_slug]` (courses at `/category/[category_slug]/courses/[slug]`). One JSON source (`src/data/category-landings.json`) owns full category landing content. All five verticals render through shared `CategoryLandingPage` (CAT V2 mixed-theme stack). Old top-level category paths permanently redirect straight to `/category/...` (including `/mba` and `/gdpi` → `/category/cat`, no chains). Scoped section tokens (`section-white/beige/cream`, `brand-orange`) + `docs/style.md` document the mixed dark/beige/white contract without flipping global dark defaults, so `/` and `/legacy-homepage` stay unchanged.
- **Rationale:** One template + one content file scales five verticals; redirects preserve bookmarks; scoped tokens avoid homepage regression.
- **Alternatives considered:** Keep five static route trees; global light-theme flip; dual V1 dark + V2 light templates per category.
- **Consequences:** Internal id `mba` remains distinct from public slug `cat`; Header/MobileNav active state reads the slug under `/category/...`; content pages adopt alternating light shells with intentional dark islands (hero, testimonials, dark cards).

### 2026-08-14 — MBA public route is `/cat`
- **Decision:** Move the MBA category landing from `/mba` to `/cat`. Keep internal category id `mba` for data; set `CATEGORIES[].slug` to `cat`. Add `getCategoryPath()` for course/faculty links. Permanent redirects: `/mba` and `/gdpi` (and nested paths) → `/cat`.
- **Rationale:** Product wants the CAT URL as the primary MBA entry; header switcher/footer already key off `slug`.
- **Alternatives considered:** Rename category id to `cat` across all data; keep dual `/mba` and `/cat` pages without redirect.
- **Consequences:** Superseded 2026-08-16 — canonical path is now `/category/cat`; `/cat` redirects there.

### 2026-08-13 — MBA theme alignment without global migration
- **Decision:** Align only the MBA category landing (now `/cat`) to the locked homepage black/white/cream/orange system. Introduce MBA-scoped light cards (`CourseCardV2`, `TestSeriesCardV2`, `FacultyCardV2`) and `CTABandV2Decorative` (duplicated from `CTABandV2` with image-left / content-right). Add optional `variant="light"` on `ResultsStatsPanel` (default `"dark"`). Do not restyle shared dark cards or homepage `CTABandV2`.
- **Rationale:** Homepage is locked; other category pages still depend on the dark theme. Scoped forks/variants avoid unintended regressions.
- **Alternatives considered:** Global theme token flip; mutating shared `CourseCard`/`FacultyCard`/`CTABand` in place.
- **Consequences:** MBA and other category landings diverge visually until those pages are migrated individually.

### 2026-07-24 — Homepage gradient transition fix (hero-only canvas)
- **Decision:** Scope `HeroNeuralCanvas` to `#site-hero` via `HomeHeroShell`; remove full-rect canvas bg glows and dark vignette (particles/lines only); delete `HomeTopZone`. Anchor `--home-hero-blend-start` at hero bottom, `--home-orange-peak` at categories bottom, `--home-light-start` at impact top. Use proportional `calc()` stops between anchors in `body.home-gradient-page`. Homepage header transparent with backdrop blur.
- **Rationale:** Canvas fills and bottom fade mask created visible seams inside Categories; warm blend starting at 72% hero height misaligned with section boundaries.
- **Alternatives considered:** Keep shared Hero+Categories canvas with mask removed only; fixed-percent gradient stops.
- **Consequences:** Categories shows uninterrupted page gradient; neural animation confined to hero; `HomeTopZone.tsx` removed.

### 2026-07-24 — Global counselling modal
- **Decision:** Add `CounsellingModalProvider` at root layout; reuse `HeroCounsellingForm` inside existing `Modal`. Site-wide counselling CTAs with `href: "/contact"` render via `CounsellingCtaAction` / `CounsellingCtaButton` (opens modal). Homepage `ExamCard` uses `onCounsellingSelect` to open modal with exam pre-selected. Floating CTA opens modal directly (no `data-counselling-cta` on itself); hides when modal is open or any `[data-counselling-cta]` is in view.
- **Rationale:** Keeps one lead-capture form UX everywhere; avoids `/contact` navigation for counselling intent; preserves existing IntersectionObserver hide logic for hero submit + CTABand buttons.
- **Alternatives considered:** Separate modal form component; URL query param (`?counselling=open`); homepage-only modal wiring.
- **Consequences:** `Modal` is now in use; `HeroCounsellingForm` supports `inline` / `modal` variants; category cards on homepage no longer navigate to category pages.

### 2026-07-24 — Homepage CTA image-background variant
- **Decision:** Extend `CTABand` with optional `backgroundImage`, `titleAccent`, and `secondaryOutline` props instead of a separate `HomeCtaSection`. When `backgroundImage` is set, skip CAT icon, gradient overlays, and `AmbientBackground`; render split headline and orange-outline secondary.
- **Rationale:** Matches existing `decorativeImage` variant pattern; keeps one reusable CTA component; other pages unchanged.
- **Alternatives considered:** Dedicated `HomeCtaSection` wrapper; site-wide CTA restyle.
- **Consequences:** Home page passes `home-cta-bg.png` and split title props; category/team/faculty CTAs keep default gradient style.

### 2026-07-24 — Continuous homepage gradient (document-level)
- **Decision:** Move the base dark→light→dark gradient to `body.home-gradient-page` (applied only on `/` via `HomePageBodyTheme` client island). `HomePageBackground` retains accent-only radial glows; section shells stay transparent. Footer is transparent on homepage only; other routes unchanged.
- **Rationale:** Footer sits outside `HomePageBackground` in root layout; body-level gradient spans main + footer without seams. Sharper canvas linear-gradient stops caused visible bands when stretched over tall pages.
- **Alternatives considered:** Fixed viewport gradient; wrapping footer inside homepage; site-wide transparent footer.
- **Consequences:** Client navigation away from `/` must remove body class (handled in cleanup). Hero components untouched.

---

### 2026-07-24 — Homepage premium polish (continuous canvas)
- **Decision:** Wrap v2 homepage in `HomePageBackground` with a single vertical gradient stack (`.home-page-canvas` + glow layer). Strip per-section solid backgrounds and blend pseudo-elements from homepage sections; use `.home-on-light` text overrides on categories/impact only. Hero shell becomes transparent with `overflow-visible` (canvas clipped in inner wrapper). Extract `HeroTrustMetrics` below video; `ImpactStatsRow` replaces vertical stat stack.
- **Rationale:** Eliminate hard section color breaks and hero gradient artifact; align with v2 mock's seamless scroll experience; fix dropdown clipping from hero `overflow-hidden`.
- **Alternatives considered:** Keep per-section gradient blends; retain vertical impact stats.
- **Consequences:** Legacy route retains old section-gradient CSS; homepage sections are transparent shells; `DropdownSelect` menu z-index raised globally to `z-[100]`.

---

### 2026-07-24 — Homepage v2 UI refinements
- **Decision:** Hero mouse tracking lifted to `HomeHeroShell` (section-level) with canvas `pointer-events-none`. Form exam field uses `DropdownSelect` (not `Select`). Video is click-to-play with no autoplay on page load; iframe mounts with `autoplay=1` only after the user clicks the custom play button. Light homepage sections via additive `.home-section-light` + extended gradient blends. Impact stats move to left column as icon badges; timeline uses positioned milestone pills; final milestone year `2026`. Footer restructured to v2 5-column + bottom legal bar. App promo uses `public/assets/app promotion/app mockup.png`.
- **Rationale:** Close gaps with approved v2 mock; improve neural interaction responsiveness; seamless dark→light scroll transitions.
- **Alternatives considered:** Keep stats below timeline; keep canvas mouse listeners; autoplay video on scroll.
- **Consequences:** `Footer.tsx` updated globally; neural physics constants tuned in `HeroNeuralCanvas`.

---

### 2026-07-24 — Homepage v2 redesign + legacy route preservation
- **Decision:** Ship v2 homepage at `/` via new `HomePage` composition (`src/components/sections/home/*`). Freeze v1 at `/legacy-homepage` using unchanged `LegacyHomePage`. Do not modify legacy section components (`HeroSection`, `TopperCard`, `LeadCaptureForm`, etc.); add variants (`TopperCardAlternate`, `HeroCounsellingForm`) instead. Hero background uses a single client `<canvas>` neural-network animation (RAF, spatial grid connections, mouse repulsion). Design reference: `referrence/ui/home page Ui v2.png`.
- **Rationale:** Approved v2 layout differs materially (counselling form hero, video, impact timeline, no courses/faculty/blog on home). Preserving legacy route enables rollback/comparison without duplicating the entire codebase.
- **Alternatives considered:** In-place refactor of `LegacyHomePage`; SVG particle hero; animation library (Framer/GSAP).
- **Consequences:** `/` is v2; `/legacy-homepage` is noindex backup; app promo uses placeholder until device assets arrive; new CSS utilities (`.home-hero-shell`, `.glass-card-hero`, `.section-blend-*`) are additive only.

---

### 2026-07-21 — Faculty detail optional fields + dedicated cards
- **Decision:** Extend `Faculty` with optional detail fields (`about`, `philosophy`, `coursesTaught`, `publications`, `reviews`, `videos`, `resultStats`, etc.). Fully populate only 3 featured profiles (Nishant Agarwal, Anand Mishra, Neha Agarwal); other slugs render hero + CTA and hide empty sections. Create faculty-specific card variants instead of stretching `CourseCard` / `TestimonialCard`. Extend `CTABand` with optional `tertiaryAction`. Achievements use `rank.png`; results use `faculty/detail/results-podium.png`.
- **Rationale:** Approved mock spacing/composition differs from listing/homepage cards; Phase 1 static content cannot fully author every faculty profile yet.
- **Alternatives considered:** Full mock detail for all faculty; reuse generic CourseCard/TestimonialCard; page-local 3-button CTA without extending CTABand.
- **Consequences:** `/faculty/[slug]` is mock-faithful for flagship profiles; thin profiles stay usable via listing fields in the hero; inventory gains Faculty* cards/sections.

---

### 2026-07-17 — CTA glow color-matched and sped up
- **Decision:** Rotate `.premium-border-glow` at 6s with a tighter, brighter peak. Orange CTAs use `.glow-accent-orange`; white outline CTAs use intensified `.glow-accent-silver`.
- **Rationale:** 16s sweep felt slow and faint; orange outline buttons incorrectly used silver glow so CTAs read as white.
- **Alternatives considered:** Keep shared orange-only glow; animate box-shadow instead of conic border.
- **Consequences:** Primary/orange outline CTAs glow orange; CTABand white secondaries and View All stay white-glow; cards inherit the faster stronger default.

---

### 2026-07-17 — Footer single active link + solid badges
- **Decision:** Footer highlights at most one link via preferred labels for shared paths (`/mba`, `/blog`, `/contact`). Badge `default`/`outline` are solid colorful with white text; course Starter → success; blog categories map to colored variants.
- **Rationale:** Duplicate footer hrefs caused multiple orange actives; dark badges with orange text looked broken on course/blog cards.
- **Alternatives considered:** Exact href match only; keep dark outline badges.
- **Consequences:** One footer active at a time; badges are always colored fill + white text.

---

### 2026-07-17 — Shine-splash hover utility for key cards
- **Decision:** Add `.hover-shine` matching the reference skewed light-band effect; apply it to TopperCard, CourseCard, FacultyCard, ValuePropCard, and AdvisorCard in place of `.shine-sweep` / `.shine-sweep-hover`.
- **Rationale:** Those cards share a single `::after` pseudo-element; stacking ambient and hover shine broke the splash. The reference effect is a clearer one-shot hover interaction.
- **Alternatives considered:** Keep `.shine-sweep-hover`; use a nested overlay element; rename to `hover:shine` (conflicts with Tailwind `hover:` variant).
- **Consequences:** Named cards get the splash only; buttons/CTAs/ResultsStatsPanel keep ambient `.shine-sweep`. Do not combine `.hover-shine` with `.shine-sweep*`.

---

### 2026-07-17 — Accent-aware glow + counselling CTA IO
- **Decision:** Drive `.premium-border-glow` from `--glow-base` / `--glow-peak` CSS variables (category accent hex or silver presets). Stagger shine via `.shine-delay-N`. Observe only `[data-counselling-cta]` elements for the floating counselling button instead of entire hero/footer sections. Add `.btn-outlined-premium` for View All and secondary outlined CTAs.
- **Rationale:** Orange-only glow clashed with purple/emerald/amber cards; section-level IO hid the floating CTA on category heroes that lack a counselling button; outlined buttons still felt static.
- **Alternatives considered:** Keep orange-only glow; continue observing `#site-hero`; per-button custom keyframes.
- **Consequences:** Course/Exam cards inherit category color glow; floating CTA shows whenever no counselling control is in view; outlined buttons share one reusable premium utility.

---

### 2026-07-17 — CSS-first premium motion system
- **Decision:** Centralize premium motion in `globals.css` with opt-in reveal, card-hover, border-glow, shine, button-highlight, ambient, and pulse utilities. Add a server-rendered `AmbientBackground` SVG primitive and keep Intersection Observer limited to the existing reveal and floating CTA client islands.
- **Rationale:** The finalized layout needed more perceived responsiveness and depth without adding animation-library weight, hiding SSR content, changing hierarchy, or introducing continuous scroll work.
- **Alternatives considered:** Framer Motion or GSAP; page-wide client components; canvas/WebGL particles; custom cursor effects.
- **Consequences:** Shared cards and key homepage surfaces gain consistent subtle motion; animated decoration remains low-opacity and reduced-motion safe; new effects should reuse these utilities instead of adding one-off keyframes.

---

### 2026-07-17 — SSR-first UI motion and SEO polish
- **Decision:** Add premium polish with CSS-first reveal utilities, a tiny `RevealGroup` client wrapper around card groups, `Carousel` autoplay for testimonials, observer-based `FloatingCounsellingCta`, and server-rendered JSON-LD helpers. Keep hero and section content as Server Components and rename display copy to Skill House while retaining `/skillhouse`.
- **Rationale:** Client requested more interactive polish, but SEO and Core Web Vitals require minimal hydration, static above-the-fold hero content, rendered testimonial HTML, and no scroll listeners.
- **Alternatives considered:** Use framer-motion; wrap full sections in client reveal components; animate hero content; scroll-position math for the floating CTA.
- **Consequences:** Motion is progressive enhancement only; reduced-motion disables reveal/autoplay/hover movement; Organization/Breadcrumb/FAQ JSON-LD improves SEO without client JS.

---

### 2026-07-17 — Five-vertical category taxonomy
- **Decision:** Replace CAT / IPMAT / GDPI / CLAT with MBA, Integrated Programs, Law, Banking & Government Exams, and Skill House. Routes: `/mba`, `/ipmat`, `/clat`, `/banking`, `/skillhouse`. Fold GDPI into MBA (retag data). Permanent redirects `/cat` and `/gdpi` (and nested paths) → `/mba`. Switcher trigger uses short `name`; dropdown uses full `menuLabel`.
- **Rationale:** Client feedback: GDPI is part of the MBA vertical; add Banking (incl. SSC) and Skill House; keep header compact with short selected labels.
- **Alternatives considered:** Keep `/cat` as MBA URL; rename IPMAT/CLAT slugs to `/integrated` and `/law`.
- **Consequences:** Homepage exam grid shows five cards; forms/footer/nav consume `CATEGORIES`; new landings clone MBA/CAT section stack and reuse existing hero/icon assets until dedicated creatives arrive.

---

### 2026-07-16 — Meet the Team page composition
- **Decision:** Build `/team` with dedicated `TeamHeroSection`, `LeadershipCard`, `FacultyExpertCard`, `AdvisorCard`, and `CultureSection`; extend `SectionHeader` (label + split description) and `CTABand` (`decorativeImage`). Reuse homepage `profiles/` cutouts and existing `Carousel` / `faculty.ts`.
- **Rationale:** Mockup card layouts differ from homepage `FacultyCard` (tall portrait experts; horizontal leadership). Page-specific themed PNG icons match Rodha visual language without generic SVGs.
- **Alternatives considered:** Overload homepage `HeroSection` / `FacultyCard`; invent new button styles.
- **Consequences:** `/team` matches mock section order; interim profile photos until dedicated leadership/advisor assets arrive; Header highlights About Us on `/team`, Footer highlights Meet the Team.

---

### 2026-07-14 — FAQ listing + shared LegalPageLayout
- **Decision:** Build global FAQ as a client island (`FAQClient`) with search, category pills, Accordion, and Pagination over `src/data/faq.ts`. Implement all four legal routes via one Server Component `LegalPageLayout` fed by structured `src/data/legal.ts`.
- **Rationale:** Scope requires categorized searchable FAQs plus title/date/structured legal content and grievance contact; shared legal shell avoids four near-duplicate layouts and keeps content CMS-ready.
- **Alternatives considered:** Inline FAQ filters in the page file; hardcode legal JSX per route.
- **Consequences:** `/faq` and legal routes match homepage dark/orange tokens; CTABand secondary supports external HTTP links (Rodha Buddy) in a new tab.

---

### 2026-07-14 — Section header spacing + CAT premium PNG icons
- **Decision:** Add shared `.section-header` utility (24px / 30px mb, +50% vs original `mb-4`/`md:mb-5`); restore stock JPG hero trust avatars; flat solid badges with white text; switch CAT hero trust, quick-stats, and test-series to premium PNG icons; trim CAT results to 2 stats with left-aligned selection/rank images.
- **Rationale:** User corrected title spacing direction and required non-SVG orange/white premium icons on the CAT landing plus contrast-safe course badges.
- **Alternatives considered:** Keep reduced header gap; leave SVG Icon chips on category hero.
- **Consequences:** Spacing is consistent site-wide via one class; CAT landing visual language matches homepage results icons; other category landings still use SVG until their assets arrive.

---

### 2026-07-14 — Generalized CategoryHeroSection for all exam landings
- **Decision:** Replace `CATHeroSection` with reusable `CategoryHeroSection` (props for headline, image, features, stats, CTAs). Move shared landing types (`CategoryHeroFeature`, `CategoryQuickStat`, `TestSeriesItem`, `ResourceItem`, `FaqItem`) to `src/lib/types.ts`. Add `clat-landing.ts`, `gdpi-landing.ts`, `ipmat-landing.ts` mirroring `cat-landing.ts`.
- **Rationale:** All four category landings share the same section structure; only copy/stats/FAQs differ. One hero component avoids three near-duplicates.
- **Alternatives considered:** Clone `CATHeroSection` per category; keep types in `cat-landing.ts` and re-export.
- **Consequences:** `/cat`, `/ipmat`, `/gdpi`, `/clat` stay in sync structurally; non-CAT pages temporarily reuse `cat-hero.jpg` with category overlay text until dedicated hero assets arrive.

---

### 2026-07-14 — Homepage UI: profile cutouts + exam/course/footer polish
- **Decision:** Ship transparent profile PNGs under `public/assets/images/profiles/`; verticalize ExamCard stats; category-tinted CourseCard backgrounds with white text; solid orange AIR badge; results selection/rank icons; brand-left/links-right footer; CAT-icon CTA band with white secondary button.
- **Rationale:** User requested these homepage refinements against reference assets; cutouts unblock Course/Faculty/Results fidelity.
- **Alternatives considered:** Keep JPG placeholders; leave CourseCards border-only.
- **Consequences:** Homepage photography gap closed for mock profiles; reusable cards now expect cutout-friendly `object-contain`.

---

### 2026-07-14 — Homepage visual QA: 6px radius + denser spacing + logo webp
- **Decision:** Standardize interactive surfaces to ~6px radius; cut `.section-spacing` by ~50%; ship official `rodha-logo.webp`; keep using existing faculty/student JPGs until transparent PNG cutouts are delivered.
- **Rationale:** Approved homepage mock uses subtle corners and compact vertical rhythm; prior pass left 8–14px radii and excess padding.
- **Alternatives considered:** Wait on transparent PNGs before further layout work.
- **Consequences:** Closer visual match; remaining photography gap is cutout fidelity only.

---

### 2026-07-14 — Homepage polish: 3D exam icons + hero photo + layout alignment
- **Decision:** Treat `referrence/ui/rodha home page UI screen.png` as visual SoT; ship provided `hero-home.png` and CAT/IPMAT/GDPI/CLAT 3D PNGs into `public/assets/images/`; keep SVG placeholders for faculty/course/topper photos until client assets arrive.
- **Rationale:** User mandated no unrelated stock substitution; missing photography must be reported rather than replaced with generic faces.
- **Alternatives considered:** Keep SVG line icons for exam cards; invent stock photography.
- **Consequences:** Homepage layout is much closer to the mock; pixel-perfect photography still blocked on client assets.

---

### 2026-07-14 — Dedicated CATHeroSection for category landing
- **Decision:** Implement CAT hero as `CATHeroSection` instead of extending homepage `HeroSection`.
- **Rationale:** Approved CAT mockup uses a left copy + right cinematic visual + feature chips + stats strip layout that differs from the homepage floating-feature card hero.
- **Alternatives considered:** Mode/props on shared `HeroSection`; page-only markup in `cat/page.tsx`.
- **Consequences:** Homepage hero stays unchanged; other category pages can clone/adapt `CATHeroSection` or later extract a more generic `CategoryHero`.

---

### 2026-07-14 — Persistent knowledge base + Cursor rules
- **Decision:** Establish `docs/knowledge/` as the single source of truth and `.cursor/rules/*.mdc` for always-on agent guidance; convert scope `.docx` to `SCOPE.md`.
- **Rationale:** Future prompts should not restate project standards; agents must read context before changes and update progress after work.
- **Alternatives considered:** AGENTS.md-only; Cursor hooks for progress (deferred — agent rule preferred).
- **Consequences:** Agents must update PROGRESS / DECISIONS / FEATURE_CHECKLIST / REUSABLE_INVENTORY after meaningful tasks.

---

### 2025-07 — Tailwind v4 CSS-first design tokens
- **Decision:** Configure design tokens in `src/app/globals.css` via `:root` + `@theme inline`; no `tailwind.config.js`.
- **Rationale:** Matches Next.js 16 + Tailwind v4 stack; single place for theme.
- **Alternatives considered:** Classic `tailwind.config.ts` theme extend.
- **Consequences:** All new styles should use CSS/theme tokens and existing utility classes.

---

### 2025-07 — Feature-based component folders
- **Decision:** Organize under `components/{ui,layout,sections,cards,forms}`.
- **Rationale:** Scales with page count; clearer ownership than a flat components dump.
- **Alternatives considered:** Atomic design folders only; feature-per-route components.
- **Consequences:** New components must land in the correct folder; page-specific one-offs discouraged.

---

### 2025-07 — Phase 1 fully static with external redirects
- **Decision:** No on-site auth/payments/course player; Graphy / ThinkExam / Rodha Buddy for interactive actions.
- **Rationale:** Combined scope + Phase 1 PRD boundaries.
- **Alternatives considered:** Partial SSO or embedded players in Phase 1.
- **Consequences:** CTAs are external links; no Phase 2 admin/dashboard work unless explicitly requested.

---

### 2025-07 — Inter via next/font
- **Decision:** Use Google Inter through `next/font/google` as `--font-inter`.
- **Rationale:** Approved design system typography.
- **Alternatives considered:** Poppins as primary heading font.
- **Consequences:** Root layout wires font variable; avoid ad-hoc font imports.

---

### 2025-07 — Mock data in `src/data/` until CMS/API
- **Decision:** Phase 1 content lives in typed static modules.
- **Rationale:** Static marketing site; Phase 2 / CMS later.
- **Alternatives considered:** Headless CMS from day one.
- **Consequences:** Pages import from `@/data/*`; keep types in sync with `lib/types.ts`.

---

### 2025-07 — No barrel index.ts exports
- **Decision:** Import components from explicit file paths.
- **Rationale:** Current codebase convention; avoids circular re-exports.
- **Alternatives considered:** Barrel files per folder.
- **Consequences:** Prefer `@/components/ui/Button` style imports unless a later decision changes this.

---

### 2026-08-19 — Theme alignment: FacultyCardV2 as canonical faculty card + light shared primitives
- **Decision:** `FacultyCardV2` is now the only faculty card used on Faculty listing, Team, About, and Category pages. `SearchInput` gains `variant="light"`. `DropdownSelect` light menu (white bg, dark text) when `variant="light"`. `Input`/`Textarea` prefix padding increased to `pl-11`. `BlogCard` article variant uses unified orange badge + orange-tinted shadow. Contact form stays dark with Name|Phone same row. Blog listing uses dark hero. Old `FacultyListingCard` / `FacultyExpertCard` files kept but unused.
- **Rationale:** Align all content pages to the locked category-page design system without affecting homepage or dark-page patterns.
- **Alternatives considered:** Keeping per-page card styles; adding light variant to `FacultyListingCard`.
- **Consequences:** Dark defaults preserved for counselling/FAQ/other forms. Homepage unchanged. Old card files can be deleted in a future cleanup pass.
