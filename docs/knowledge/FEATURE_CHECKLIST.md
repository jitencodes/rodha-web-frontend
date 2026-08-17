# Feature Checklist — Phase 1

Statuses: **Not Started** | **Partial** | **Complete**

Update when page/section status changes. Detail: [PROGRESS.md](PROGRESS.md) · Spec: [PHASE1_PRD.md](../PHASE1_PRD.md)

---

## Global

| Feature | Status | Notes |
|---------|--------|-------|
| Promotional banner + countdown | Complete | Orange-tinted gradient bar, refined countdown pills, v2 alignment |
| Header — global nav state | Partial | Exam switcher beside logo; verify PRD links |
| Header — category nav state | Partial | Needs verification vs PRD |
| Mobile nav | Partial | Exists; test against all breakpoints |
| Floating counselling CTA | Complete | Observes `[data-counselling-cta]` only; hidden when any counselling CTA is in view or modal is open; fade/slide + idle pulse; opens counselling modal on click |
| Counselling modal (lead form) | Complete | Global provider + `HeroCounsellingForm` in `Modal`; site-wide CTABand counselling actions; homepage category cards pre-fill exam |
| Footer | Partial | v2 5-column layout (brand, courses, quick links, resources, contact); legal in bottom bar; social URLs TBD |
| Rodha Buddy CTA (external) | Partial | Outline orange in header; final URL TBD |
| Login / Sign Up → Graphy | Partial | Outline button; redirect target TBD |
| Promotion popup + lead form | Not Started | Modal + trigger logic |

---

## Home `/` (v2 — live)

| Section | Status |
|---------|--------|
| Hero (neural canvas + counselling form + YouTube + floating stats) | Complete (hero-only transparent canvas in `HomeHeroShell`) |
| Choose Your Exam | Complete (`home-section-spacing-lg`; page gradient only — no canvas overlay) |
| Impact timeline | Complete (3-line heading: students / decade of / momentum.) |
| Results / toppers | Complete (2-line heading: speak / for themselves.) |
| App promotion | Partial (app mockup image + Play Store SVG; store links `#` until URLs arrive) |
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
| Dynamic JSON-driven landings | Complete — `category-landings.json` + `CategoryLandingPage` for all five verticals |
| MBA `/category/cat` mixed-theme alignment | Complete — peach/white rhythm; V2 cards; decorative CTA; dark testimonials island |
| Other verticals (`ipmat` / `clat` / `banking` / `skillhouse`) | Complete — same CAT V2 template (content differs via JSON) |
| Category hero | Complete (`CategoryHeroSectionV2` on all five) |
| Courses overview | Complete (`CourseCardV2`) |
| Star faculty | Complete (`FacultyCardV2`) |
| Test series promo | Complete (`TestSeriesCardV2`) |
| Results & toppers | Complete (light stats + dual `TopperCardV2` marquees) |
| Testimonials | Complete (dark island) |
| Stories / app promo / FAQ | Complete |
| SEO intro copy | Partial (per-page metadata from JSON; longer SEO blocks TBD) |
| Taxonomy / switcher | Complete — public paths `/category/{slug}`; `/cat|mba|gdpi|…` permanent redirect |
| SEO structured data | Complete — Organization, category BreadcrumbList, FAQPage JSON-LD |

---

## Course Detail `/category/[category_slug]/courses/[slug]`

| Feature | Status |
|---------|--------|
| Placeholder shell | Complete (mixed-theme; validates category + course from JSON) |
| Course hero | Not Started |
| Curriculum accordion | Not Started |
| Faculty for course | Not Started |
| What's included | Not Started |
| Pricing display | Not Started |
| Sticky Enrol → Graphy | Not Started |
| Floating enquiry | Not Started |
| FAQ / related | Not Started |

---

## Content Pages

| Page | Status | Notes |
|------|--------|-------|
| About `/about` | Partial | Mixed-theme shell; content still placeholder |
| Team `/team` | Complete | Hero + leadership/faculty carousels + advisors + culture + CTA; light section shells |
| Faculty listing `/faculty` | Complete | Vertical listing cards, header-style filters in All Faculty, 4-col hero stats; mixed theme |
| Faculty detail `/faculty/[slug]` | Complete | Dark hero + light alternating body sections + decorative CTA |
| Blog listing `/blog` | Partial | Mixed-theme shell; content still placeholder |
| Blog detail `/blog/[slug]` | Partial | Mixed-theme shell; content still placeholder |
| Contact `/contact` | Partial | Beige shell + dark form island (matches dark `input-base`); ContactForm exists |
| FAQ `/faq` | Complete | Search + category pills + AccordionV2 + Pagination + CTABand |
| Privacy `/privacy-policy` | Complete | LegalPageLayout + structured content |
| Terms `/terms-and-conditions` | Complete | LegalPageLayout + structured content |
| Refund `/refund-policy` | Complete | LegalPageLayout + structured content |
| Disclaimer `/disclaimer` | Complete | LegalPageLayout + structured content |

---

## Forms

| Form | UI | Validation | Backend |
|------|----|------------|---------|
| ContactForm | Partial | Partial | Not Started |
| LeadCaptureForm | Partial | Partial | Not Started |
| NewsletterSignup | Partial | Partial | Not Started |

---

## SEO & Technical

| Item | Status |
|------|--------|
| Per-page metadata (basic) | Partial |
| Open Graph / Twitter | Partial |
| JSON-LD schemas | Not Started |
| sitemap.xml | Not Started |
| robots.txt | Not Started |
| Image alt / heading hierarchy | Partial |

---

## Explicitly Out of Scope (Phase 2)

Do not mark these as remaining Phase 1 work: SSO, payments, student dashboard, admin, dedicated course/test listing pages, resources hub, search results page, login page.
