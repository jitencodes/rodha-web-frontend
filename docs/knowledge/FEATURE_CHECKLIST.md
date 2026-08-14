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

## Category Landings `/cat` `/ipmat` `/clat` `/banking` `/skillhouse`

| Section | Status |
|---------|--------|
| MBA `/cat` homepage-theme alignment | Complete — peach/white rhythm; `SectionHeaderV2`; dual result marquees; light V2 cards; `CTABandV2Decorative`; hero unchanged; other categories still dark |
| Category hero | Complete (all five via `CategoryHeroSection`; MBA uses `CategoryHeroSectionV2`) |
| Courses overview | Complete (MBA: light `CourseCardV2` + posters; others: dark `CourseCard`) |
| Star faculty | Complete (MBA: premium white `FacultyCardV2` + profile cutouts; others: `FacultyCard`) |
| Test series promo | Complete (MBA: light `TestSeriesCardV2`; others reuse dark cards) |
| Results & toppers | Complete (MBA: light stats + dual `TopperCardV2` marquees; others: `ResultsStatsPanel` + `TopperCard`) |
| Demo / webinar CTA | Complete (resource cards on non-MBA; MBA stories + app promo) |
| Testimonials | Complete (MBA light cards/fades; others dark) |
| Resources teaser | Complete (legacy/non-MBA; MBA uses stories section) |
| Category FAQ | Complete (non-MBA; MBA FAQ deferred in current live page) |
| SEO intro copy | Partial (per-page metadata; longer SEO blocks TBD) |
| Match `cat landing page Ui.png` | Complete (structure); MBA now follows locked homepage theme |
| MBA section order | Complete — Hero → Results → Courses → Test Series → Faculty → Testimonials → CTA → Stories → App Promo |
| Taxonomy / switcher | Complete — short trigger + full menu labels; public MBA URL is `/cat`; `/mba` & `/gdpi` redirect to `/cat` |
| SEO structured data | Complete — Organization, category BreadcrumbList, FAQPage JSON-LD |

---

## Course Detail `/[category]/courses/[slug]`

| Feature | Status |
|---------|--------|
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
| About `/about` | Not Started | Placeholder |
| Team `/team` | Complete | Hero + leadership/faculty carousels + advisors + culture + CTA; mockup-aligned |
| Faculty listing `/faculty` | Complete | Vertical listing cards, header-style filters in All Faculty, 4-col hero stats; mockup-aligned |
| Faculty detail `/faculty/[slug]` | Complete | Pixel mock: hero + info/courses/achievements/reviews/videos/results; full detail for 3 featured; empty sections hidden |
| Blog listing `/blog` | Not Started | Placeholder (data + BlogCard exist) |
| Blog detail `/blog/[slug]` | Not Started | Placeholder |
| Contact `/contact` | Not Started | ContactForm exists; page stub |
| FAQ `/faq` | Complete | Search + category pills + Accordion + Pagination + CTABand |
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
