# Progress Tracker

**Last updated:** 2026-08-20 (hero videos + faculty doc refresh)
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
- **CAT category content refresh (2026-08-17):**
  - Updated CAT hero headline, three rotating conversion outcomes, and data-driven selection/aspirant stats
  - Added 40 CAT 2025 student results and 27 curated testimonials; downloaded, validated, and optimized 46 supplied Drive portraits (text-only entries retain the placeholder)
  - Added four supplied CAT mock-package card images and limited CAT faculty to the nine supplied faculty profiles
  - Replaced the CAT course catalog with six current Rodha offerings and exact external course URLs; category course sections use a responsive slider with four desktop cards, arrow controls, mouse dragging, and touch swiping
  - Removed unused legacy category JSON fields (`sectionOrder`, `heroFeatures`, `resources`, `featuredCourseIds`, and unused hero/story fields)
- **About Us `/about` + Contact Us `/contact` (2026-08-17):**
  - About: dark hero, mission/vision, journey timeline, differentiators, impact stats, CAT `FacultyCardV2` carousel, featured testimonials, light counselling CTA
  - Contact: dark form hero (counselling +91 phone chrome), channel strip, office map, support hours, FAQ accordion, Rodha Buddy CTA
  - Page-specific contact details in `src/data/contact.ts` so Footer `CONTACT_INFO` stays unchanged
- **Blog listing `/blog` + detail `/blog/[slug]` (2026-08-19):**
  - Listing: light hero with breadcrumb/eyebrow/heading, URL-driven category filters + search, featured post (article variant), latest posts grid (4-col), pagination, CTABandV2Decorative. No newsletter.
  - Detail: breadcrumb, category badge link, title, description, date/readTime, hero image, HTML blog body with `.blog-prose` styles, sticky sidebar with reusable `BlogCategories` + `ShareBlog` (copy, WhatsApp, Facebook, X, LinkedIn), related posts grid, CTABandV2Decorative.
  - 16 blog posts across 7 categories with HTML content in `src/data/blog.ts`; `BlogPost` type updated (backward compat for legacy homepage overlay cards).
  - `BlogCard` article variant (white card, category link badge, calendar/clock meta); overlay variant preserved for legacy homepage.
  - `Pagination` supports URL-based navigation (`basePath` + `query`) and `variant="light"` for light backgrounds.
  - `blogPostingJsonLd` added to `structured-data.ts`; detail pages have full OG/Twitter/canonical meta + BreadcrumbList + BlogPosting JSON-LD.
  - No author UI, no "On This Page", no newsletter section.
- **Theme alignment pass (2026-08-19):**
  - `SearchInput` now has `variant?: "dark" | "light"` with stronger `pl-11` icon clearance
  - `DropdownSelect` light menu (white bg, dark text, orange hover) when `variant="light"`
  - `Input` / `Textarea` prefix padding increased to `pl-11`
  - `BlogCard` article variant: unified orange badge, orange-tinted shadow, orange meta icons
  - Faculty listing + featured: `FacultyCardV2` replaces `FacultyListingCard`; light filters/dropdowns/pagination/reset
  - Team: breadcrumb moved into dark hero; `LeadershipCard` vertical light; `FacultyCardV2` for experts; Advisors title black
  - About: quote card repositioned into hero image plane (bottom-right); Mission/Vision icon enlarged + black bg removed; timeline connector bounded/visible; differentiators title aligned; 3D impact icons for all stats; testimonial shorter
  - Contact: dark compact form (Name|Phone row); breadcrumb in left column; overlapping unified info strip; office/map unified card; support hours simplified + holidays line; Why Contact star header
  - Blog listing: dark hero; `SectionHeaderV2` for Featured/Latest; both sections white
  - Blog detail: white article body; beige sidebar cards; `SectionHeaderV2` for Related; orange badges/icons
- **Faculty detail `/faculty/[slug]` light mixed-theme (2026-08-20):**
  - Dark 2-column hero (portrait + copy/stats); breadcrumb in hero; decorative third column removed
  - Body: white/beige alternating sections with light cards (`border-section-beige`, white surfaces)
  - Three-column About / Teaching Philosophy / Subject Expertise; `SectionHeaderV2` on courses + results
  - `withFacultyDetailDefaults()` + `getFacultyHonorific()` — every faculty slug gets full section data from JSON defaults
  - `react-icons` via `src/lib/faculty-icons.tsx`; `CTABandV2Decorative` optional `tertiaryAction` (Rodha Buddy on detail)
- **Category course catalog + filter chips (2026-08-20):**
  - Light filter chips above the existing category course slider: All (default), Comprehensive, Individual, Crash Course
  - Slider and `CourseCardV2` layout unchanged; cards now tolerate FREE pricing and missing included-course counts
  - Replaced CAT / IPMAT / CLAT / SSC / Skill House course JSON from the latest sheet (titles, copy, prices, CTAs)
  - Downloaded named thumbnails into `public/assets/images/courses/{cat,ipmat,clat,ssc,skillhouse}/`
  - CAT mock packages included in the CAT All list; CAT test-series cards now point at the live ThinkExam package URLs
- **Faculty / Team / Category content cleanup (2026-08-20):**
  - Removed all dummy faculty; kept 18 real profiles (12 enriched from `Rodha Faculty.docx` + 6 portrait-only)
  - Faculty detail: publications removed; achievements full-width; reviews from category testimonials (max 3, relevance-matched); YouTube snippets open in `StoriesModal`; courses from landing `faculty` strings via `CategoryCoursesSlider`
  - Faculty listing: Average Rating hero stat removed; Featured uses `InfiniteMarquee`; Experience filter replaced with Category + derived Subject filters
  - Team: Faculty Experts + Advisors commented out; new `LovedTeamSection` full-width image carousel (3s autoplay)
  - Course filter chips are data-driven; filter bar hidden when only one `courseType` exists
  - Category testimonials: initials for missing photos; blurred-bg + `object-contain` for real photos
- **SMTP lead forms (2026-08-20):**
  - `POST /api/leads` + Nodemailer SMTP (Gmail) emails all Contact / Counselling / LeadCapture / Newsletter submissions to `support@rodha.co.in`
  - Light Rodha HTML template; logo absolute URL `https://rodha.co.in/assets/images/rodha-logo-orange.svg` (from `NEXT_PUBLIC_BASE_URL`, never request Host)
- **Content & SEO migration (2026-08-20):**
  - Featured faculty ordered list of 13 (Team + Faculty marquees); Himanshu renamed to Himanshu Kushwaha; 5 others remain in All Faculty only
  - Replaced 16 dummy blogs with 9 migrated articles from rodha.co.in (full HTML, tables, local images under `public/assets/images/blog/{slug}/`); categories All/MBA/IPMAT/SSC
  - Legal pages rewritten from live Privacy / Terms / Refund; Disclaimer rebuilt from Terms §11 + Rodha product facts (**legal review flagged**)
  - FAQ listing rebuilt from Home + 5 vertical FAQs; filters All/General/CAT/IPMAT/SSC/CLAT/Skill House (42 items after dedupe)
  - SEO: `metadataBase`, default OG `og-rodha.png`, favicon/apple icons, `buildPageMetadata` canonicals, `webSiteJsonLd`, BlogPosting author/dateModified, homepage FAQ JSON-LD; Contact FAQ JSON-LD removed (UI hidden)
  - Redirects: `/privacypolicy`, `/termsofuse`, `/refundpolicy` → new routes
- **Hero videos + faculty doc refresh (2026-08-20):**
  - Homepage + five category heroes now pass distinct YouTube ids into existing `HeroVideoEmbed` (`hero.videoId` on category landings)
  - All 18 faculty profiles enriched from `Rodha Faculty (1).docx` (remaining six: Himanshu, Divya Kumar Garg, Kriti Bhatnagar, Rupal Choudhary, Ananya Singhal, Abhishek Dubey)
  - Faculty detail courses resolve via authored `courseGraphyIds` matched to existing category-landing cards only (skip CAT R1 comprehensive + COMPLETE OMETS 2026 — no cards); Tarun has empty list (no usable links)
  - Category `facultyIds` realigned (CLAT / SSC / Skill House); Skill House carousel shows Divya only

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
- [ ] Dynamic faculty result stats (Results Attributed section still static)

### Screens
- [x] About `/about`
- [x] Blog listing `/blog` + detail `/blog/[slug]`
- [ ] Course detail (content depth; mixed-theme shells done)
- [x] Contact `/contact`
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
