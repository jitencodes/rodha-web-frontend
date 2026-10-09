# Feature Checklist — Phase 1

Statuses: **Not Started** | **Partial** | **Complete**

Update when page/section status changes. Detail: [PROGRESS.md](PROGRESS.md) · Spec: [PHASE1_PRD.md](../PHASE1_PRD.md)

---

## Global

| Feature | Status | Notes |
|---------|--------|-------|
| Promotional banner + countdown | Complete | API-driven announcements; 3D flip every 8s (env); countdown only when `endAt` present |
| Header — global nav state | Partial | Exam switcher from Active Categories API; Test Series → mocks.rodha.co.in; Free Resources category-aware |
| Header — category nav state | Partial | Exam switcher syncs under `/category/[slug]` via API slugs; Free Resources uses that vertical's Graphy course |
| Mobile nav | Partial | Same Active Categories API as desktop; login removed; Free Resources / Test Series match desktop |
| Floating counselling CTA | Complete | Observes `[data-counselling-cta]` only; hidden when any counselling CTA is in view or modal is open; fade/slide + idle pulse; opens counselling modal on click |
| Counselling modal (lead form) | Complete | Global provider + `HeroCounsellingForm` in `Modal`; site-wide CTABand counselling actions; homepage category cards pre-fill exam |
| Footer | Partial | v2 5-column layout; Success Stories removed; Free Resources category-aware |
| Rodha Buddy CTA (external) | Partial | Outline orange in header; final URL TBD |
| Login / Sign Up → Graphy | Not Started | Removed from header/mobile until a live destination is ready |
| Promotion popup + lead form | Not Started | Modal + trigger logic |

---

## Home `/` (v2 — live)

| Section | Status |
|---------|--------|
| Hero (neural canvas + counselling form + YouTube + floating stats) | Complete — Get Home `banner` (title, titleHighlights, description, stacks, video); empty stacks/highlights hidden |
| Choose Your Exam | Complete — Get Home `categories`; section hidden when empty |
| Impact timeline | Complete (3-line heading: students / decade of / momentum.) — currently commented out in assembler |
| Results / toppers | Complete — Get Home `studentResultGroups`; section hidden when empty |
| App promotion | Complete (Rodha Buddy + Rodha App copy; live Play Store / App Store URLs) — currently commented out |
| FAQ | Complete — Get Home `faqs` + FAQ JSON-LD; section hidden when empty |
| CTA Band | Complete (2-line block heading; buttons clear of bg artwork) |
| Continuous page canvas background | Complete (7-phase warm-orange gradient; body-height anchors incl. footer) |

## Home `/legacy-homepage` (frozen v1 backup)

| Section | Status |
|---------|--------|
| Hero | Complete (hero-home.png + floating features) |
| Choose Your Exam | Complete |
| Why Thousands Choose Rodha | Complete |
| Featured Courses carousel | Complete |
| Faculty carousel | Complete |
| Results / toppers | Complete |
| Blog / insights | Complete |
| CTA Band | Complete |

---

## Category Landings `/category/[category_slug]`

| Section | Status |
|---------|--------|
| Dynamic JSON-driven landings | Complete — `GET api/website/categories/:slug` + JSON copy/themes; unknown CMS slugs use name-based chrome fallback (`category-landing-defaults.ts`); faculty/testimonials/stories/FAQs/courses from the same payload |
| MBA `/category/cat` mixed-theme alignment | Complete — peach/white rhythm; V2 cards; decorative CTA; dark testimonials island |
| Other verticals (`ipmat` / `clat` / `banking` / `skillhouse`) | Complete — same CAT V2 template; empty API sections hidden |
| Category hero | Complete — `CategoryHeroSectionV2` from CMS banner (Typewriter + video/image) |
| Courses overview | Complete — Embedded category `packages` → full-card `CourseCardV2` → `/courses/[slug]`; tabs from `groups.subCategory1` + All; View all → `/courses?categoryId=`; discount % from price fields |
| Star faculty | Complete — `FacultyCardV2` from category-page `faculty[]` (same response as testimonials/FAQs) |
| Test series promo | Complete — `TestSeriesCardV2`; static catalog fallback while CMS `testSeries` is empty |
| Results & toppers | Complete — light stats + second marquee only at 15+ cards; short lists stay on one left-aligned row |
| Testimonials | Complete — 3-column vertical layout at 6+ items (2 per column); otherwise a single horizontal row |
| Stories / app promo / FAQ | Complete |
| SEO intro copy | Partial (per-page metadata from JSON; longer SEO blocks TBD) |
| Taxonomy / switcher | Complete — public paths `/category/{slug}`; `/cat|mba|gdpi|…` permanent redirect |
| SEO structured data | Complete — Organization, category BreadcrumbList, FAQPage JSON-LD |

---

## Auth `/login` `/signup`

| Feature | Status | Notes |
|---------|--------|-------|
| Split-panel screen | Complete | Full-bleed left slides + `rodha-logo.webp`; desktop viewport lock, form-only scroll |
| Password signup | Complete | `POST api/auth/user/signup` via `/api/auth/signup`; +91 mobile field |
| Password login | Complete | `POST api/auth/user/login` with `is_web: true` via `/api/auth/login` |
| Forgot password | Complete | `/forgot-password` → `/api/auth/forgot-password` → `api/auth/user/forgot-password` |
| Reset password | Complete | `/reset-password` → `/api/auth/reset-password` → `api/auth/user/reset-password` (`email`/`token` query prefill) |
| Google | Complete (client) | GIS ID token → `/api/auth/google` → `api/auth/user/google` (not in Postman) |
| Session | Complete | httpOnly `rodha_access_token`; redirect `/account/dashboard` |
| Account static data | Complete | `src/lib/account/types.ts` + `src/data/account/*` |
| Logout | Complete | `POST /api/auth/logout` clears cookie; header profile menu |

## Student Account `/account/*`

| Feature | Status | Notes |
|---------|--------|-------|
| Shell (sidebar + header + main) | Complete | `AccountShell` under `/account`; public chrome only in `(website)` layout |
| Scoped light/dark theme | Complete | `data-account-theme` + circular transition; no `html.dark` |
| Sidebar nav + mobile drawer | Complete | Products accordion, cart badge, Need Help; Escape/overlay close |
| Header chrome | Complete | Mobile search overlay, Ctrl+K, theme, notifications dot, Live Dashboard, profile/Logout |
| Settings stub | Complete | `/account/settings` placeholder card |
| Courses tabs | Complete | `/account/courses?tab=continue\|buy` (+ aliases); Continue/Buy search + Postman filters + mobile bottom sheet; Continue cards + Buy `CourseCardV2`; theme-aware pagination |
| Course detail (assigned) | Complete | `/account/courses/[courseId]` client island + BFF; progress, content-type tabs (not chapters), filters, paginated items → Graphy `takeUrl` + SSO |
| Test Series listing | Complete | `/account/test-series` `TestSeriesCardV2` grid + theme-aware pagination |
| Dashboard | Complete | Welcome, todayContents Live Classes, continue watching, recommended, progress ring, orders preview, quick links |
| Quick Content | Complete | `/account/content` tabs + search/filters + server pagination via Quick Actions API |
| Orders | Complete | `/account/orders` table + mobile cards; product image fallback; no Payment column |
| Profile | Complete | `/account/profile` avatar, edit name + change password (client-only) |
| Cart content | Complete | `/account/cart` computed summary, coupon, Continue to Pay UI, You May Also Like |
| Responsive polish | Complete | Drawer, stacked grids, orders overflow-x inside table, mobile search |

## Course Listing `/courses`

| Feature | Status | Notes |
|---------|--------|-------|
| Canonical listing route | Complete | `/courses` beside existing `/courses/[slug]` detail |
| Dark hero | Complete | `ListingHeroSection` + `/assets/images/courses/banner/banner.png` |
| URL filters | Complete | Master-driven: `categoryId`, subCategory1 tabs, faculty, subject, sort, search `q`; Type (`type`→graphyCategory) UI temporarily hidden; mobile Filter bottom sheet; desktop dropdowns portaled above cards |
| Cards + pagination | Complete | `CourseCardV2` (category card); 12 per page; URL `Pagination` light |
| Stories + CTA | Complete | Merged category stories (hidden if empty) then `CTABandV2Decorative` |

## Test Series Listing `/test-series`

| Feature | Status | Notes |
|---------|--------|-------|
| Canonical listing route | Complete | `/test-series` |
| Dark hero | Complete | Same listing hero + banner as courses; test-series copy |
| URL filters | Complete | Category chips, search, paid/free. Course type hidden (no `courseType` on test series) |
| Cards + pagination | Complete | `TestSeriesCardV2` (category card); 10 per page |
| Stories + CTA | Complete | Same stories section as courses; CTA primary Explore Courses |

## Course Detail `/courses/[slug]`

| Feature | Status |
|---------|--------|
| Canonical route + SSG | Complete (`/courses/[slug]`; nested category course URLs redirect) |
| Package Detail By Slug API | Complete (`getPackageBySlug` + mapper; empty sections hidden) |
| Course hero | Complete (dark hero, breadcrumb, highlights, faculty avatars) |
| Sticky purchase card | Complete (same-tab Buy Now → login or checkout; checkout errors surfaced) |
| Curriculum accordion | Complete (`CourseCurriculumAccordion`; hidden when no modules) |
| Faculty for course | Complete (package `faculty[]` via `FacultyCardV2`; hidden when empty) |
| What's included + schedule | Complete (API benefits/schedule only; no invented defaults on package path) |
| Pricing / Plans section | Removed (purchase via sticky card only) |
| Testimonials | Complete (package testimonials; hidden when empty) |
| Related courses | Complete (`similarPackages` → `CourseCardV2` → `/courses/[slug]`) |
| FAQ | Complete (package FAQs; hidden when empty) |
| Floating enquiry | Complete (`LeadCaptureForm` light Enquire Now + mobile sticky) |
| Course card discount % | Complete (derived from `price` / `discountedPrice` on `CourseCard` / `CourseCardV2`) |

---

## Content Pages

| Page | Status | Notes |
|------|--------|-------|
| About `/about` | Complete | CMS banner, journeys, impact stacks, galleries; empty sections hidden |
| Team `/team` | Complete | CMS banner, featured faculty, Loved Team galleries |
| Faculty listing `/faculty` | Complete | SSR list + URL filters stay on `#faculty-list`; CMS banner + featured |
| Faculty detail `/faculty/[slug]` | Complete | Nested CMS `{ faculty, packages }`; courses with `courseType` chips; empty sections hidden |
| Blog listing `/blog` | Complete | Unfiltered listing shows `isFeatured` post; filters All/MBA/IPMAT/SSC |
| Blog detail `/blog/[slug]` | Complete | Related posts from `relatedBlogs`; BlogPosting JSON-LD with author |
| Contact `/contact` | Complete | Form posts through `/api/leads` → CMS contact + SMTP notify |
| FAQ `/faq` | Complete | 42 real FAQs; filters All/General/CAT/IPMAT/SSC/CLAT/Skill House |
| Privacy `/privacy-policy` | Complete | CMS HTML legal page + TOC from headings |
| Terms `/terms-and-conditions` | Complete | CMS HTML legal page |
| Refund `/refund-policy` | Complete | CMS HTML legal page |
| Disclaimer `/disclaimer` | Complete | CMS HTML legal page |

---

## Forms

| Form | UI | Validation | Backend |
|------|----|------------|---------|
| ContactForm | Complete | Complete — required fields, 10-digit phone, alphabetic name | Complete — CMS contact via `/api/leads` + SMTP |
| LeadCaptureForm | Complete | Complete — same client rules as contact | Complete — same Route Handler |
| NewsletterSignup | Complete | Complete | Complete — SMTP `/api/leads` |

---

## SEO & Technical

| Item | Status |
|------|--------|
| Per-page metadata (basic) | Complete | `buildPageMetadata` + category JSON titles; canonicals on key routes |
| Open Graph / Twitter | Complete | Default `og-rodha.png`; blog/faculty use page images |
| JSON-LD schemas | Partial | Organization, WebSite, Breadcrumb, FAQPage, Person, BlogPosting, Course; sitemap still TBD |
| sitemap.xml | Not Started |
| robots.txt | Not Started |
| Image alt / heading hierarchy | Partial |
| Favicon / site icons | Complete | `/favicon.png` (+ apple reuse); distinct apple-touch asset missing |

---

## Explicitly Out of Scope (Phase 2)

Do not mark these as remaining Phase 1 work: payments, full student dashboard, admin, resources hub, search results page, mock tests page. Login `/login` and signup `/signup` were requested and are implemented (password APIs from Graphy collection under `api/auth/user/*`; Google backend path `api/auth/user/google` is not in Postman). Course listing `/courses` and test series listing `/test-series` are implemented. Header Test Series still points at mocks.rodha.co.in.
