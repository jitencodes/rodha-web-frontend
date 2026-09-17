# Project Context — Rodha Web Frontend

## Product Vision

**Rodha** is India’s trusted platform for competitive exam and career preparation covering **MBA (CAT + GDPI), Integrated Programs (IPMAT), Law (CLAT), Banking & Government Exams, and Skill House**.

Core messaging: **“Expert Mentorship. Proven Strategies. Real Results.”**

Value props: top faculty, personalized mentorship, result-oriented approach, AI-powered Rodha Buddy, high-quality test series, engaged community.

Trust metrics (marketing copy): 2,50,000+ students, 4.8/5 Google rating, 10,000+ selections, 250+ top-100 ranks.

---

## Phase Scope

### Phase 1 (current — in scope)
- Fully **static marketing website** (Next.js App Router, SSG/SSR)
- Dark theme: orange (`#F97316`) + shades of black
- No on-site auth, payments, or course/test players
- Enrollment / login / tests redirect to external platforms

### Phase 2 (out of scope — do not build unless explicitly requested)
- SSO authentication, on-site payments, Student Dashboard, Admin Module
- Dedicated Course Listing, Test Series, Mock Tests, Results, Testimonials, Resources Hub pages
- Search Results, Login/Sign Up, Payment pages
- In-app course/test navigation (subject → topic → content)

Authoritative boundary source: [SCOPE.md](SCOPE.md). Detailed Phase 1 specs: [PHASE1_PRD.md](../PHASE1_PRD.md).

---

## External Platforms (Phase 1)

| Action | Destination |
|--------|-------------|
| Login / Sign Up / Enrol Now | **Graphy** (category/course-specific URLs — TBD) |
| Test Series / Mock Tests | **ThinkExam** (URLs — TBD) |
| Rodha Buddy CTA | **Rodha Buddy** chatbot (URL — TBD) |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first tokens in `src/app/globals.css`) |
| Utilities | `clsx`, `tailwind-merge` → `cn()` in `src/lib/utils.ts` |
| Font | Inter via `next/font/google` |

**Critical:** This Next.js version differs from training data. Read `node_modules/next/dist/docs/` before implementing Next.js APIs.

---

## Design References

| Asset | Role |
|-------|------|
| `rodha home page UI screen.png` | Approved homepage — design source of truth |
| `cat landing page Ui.png` | CAT category landing reference |
| [UI_DESIGN_ANALYSIS.md](../UI_DESIGN_ANALYSIS.md) | Extracted tokens & component specs |
| `src/app/globals.css` | Implemented design tokens + utility classes |

---

## Current Implementation Snapshot

- **Complete:** Design system, layout shell, home page (all sections), reusable component library scaffold, static data modules, SSR CMS API layer for announcements / categories / Get Home
- **Partial:** Category landing pages (still JSON-driven); remaining Postman endpoints not wired
- **Placeholder:** About, Team, Faculty, Blog, Contact, FAQ listing, Legal still use static modules until their APIs are integrated

Live status: [PROGRESS.md](PROGRESS.md) · [FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md)
