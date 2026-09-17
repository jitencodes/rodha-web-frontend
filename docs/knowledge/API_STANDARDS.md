# API Standards

Phase 1 marketing site now loads **selected CMS content** from the public website API. Auth, payments, and course/test players remain out of scope.

Authoritative agent workflow: [`.cursor/skills/api-integration/SKILL.md`](../../.cursor/skills/api-integration/SKILL.md).

---

## Website CMS API (SSR-first)

| Concern | Rule |
|---------|------|
| Client | `src/lib/api/client.ts` — `apiGet` / `apiGetOrNull` / `apiPost` |
| Modules | `src/lib/api/modules/<name>/{types,service,mapper}.ts` |
| Rendering | Fetch in Server Components; pass view-models as props |
| Empty data | Hide the section / chrome — do not render blank UI |
| Types | Copy Postman response shapes; do not invent fields |
| Env | `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_SOURCE`, `NEXT_PUBLIC_ANNOUNCEMENT_INTERVAL_MS`, optional `API_KEY` |
| Collection | `docs/api-collection/Rodha website Api's.postman_collection (4).json` |

**Integrated now:** announcements, active categories, Get Home, category page (faculty + testimonials + stories + FAQs + courses/`courseType`), faculty listing/detail, subjects, about, team, legal HTML pages, contact POST (via `/api/leads`).

**Not yet:** FAQ listing API, blogs.

Do **not** use TanStack Query for these marketing surfaces unless a feature needs client refetch.

Shared mappers: `mapWebsiteBanner`, `mapCourses` (`courseType` for static section filters), `mapFacultyCards` (category faculty is in the same category-page payload as testimonials / successStories / FAQs).

---

## External Redirects

| User action | Platform | Behavior |
|-------------|----------|----------|
| Login / Sign Up | Graphy | `external` link / `window` navigate to portal URL |
| Enrol Now | Graphy | Course-specific enrollment URL from course data |
| Test Series / Mocks | ThinkExam | Portal URL |
| Rodha Buddy | Rodha Buddy | Chatbot URL |

Store URLs in data/constants (`enrollmentUrl`, future `EXTERNAL_URLS`). Until client provides finals, keep placeholders and flag in [PROGRESS.md](PROGRESS.md) blockers.

Do not build SSO, payment gateways, or Graphy/ThinkExam API clients in Phase 1.

---

## Forms

| Form | Fields (summary) | Backend status |
|------|------------------|----------------|
| Contact / Inquiry | Name, Phone, Email, Category, Message | **Complete** — `POST /api/leads` → CMS `api/website/contact` + SMTP notify |
| Lead capture (promo) | Name, Mobile, Email, Exam | **Complete** — same Route Handler (`formType: lead-capture`) |
| Counselling (hero / modal) | Name, Phone, Exam | **Complete** — CMS contact with collected fields only (`websiteCategoryId` from exam) |
| Newsletter | Email | **Complete** — SMTP only (`formType: newsletter`) |

**Rules:**
- Validate on the client per [PHASE1_PRD.md](../PHASE1_PRD.md) §4; server re-validates in `parseLeadPayload`
- SMTP via Nodemailer (`src/lib/email/*`); light Rodha HTML template with **absolute** logo URL from `NEXT_PUBLIC_BASE_URL` / `https://rodha.co.in` (never request Host)
- Prefer server-only `EMAIL_SMTP_*` env vars for secrets; `NEXT_PUBLIC_EMAIL_*` kept as fallback only
- Existing form components: `ContactForm`, `LeadCaptureForm`, `NewsletterSignup`, `HeroCounsellingForm`

---

## Data Layer

- Dynamic surfaces: API modules under `src/lib/api/modules/`
- Remaining static TypeScript modules in `src/data/` (category landings, faculty, blog, legal, etc.)
- Types in `src/lib/types.ts` plus API DTOs/view-models colocated with modules
- No ORM; public website GETs are unauthenticated (optional `API_KEY` only if backend requires it)

---

## SEO / Structured Data

Required for Phase 1 (PRD §8):

- Unique meta title/description per page (`export const metadata` or `generateMetadata`)
- Open Graph / Twitter tags
- Canonical URLs
- JSON-LD where applicable: Organization, Course, FAQ, BreadcrumbList, Person, BlogPosting
- Homepage FAQ JSON-LD uses Get Home FAQs when present
- `sitemap.xml` and `robots.txt` (pending implementation)
- Semantic HTML, heading hierarchy, image alt text

---

## Phase 2 Preview (do not implement now)

SSO with Graphy/ThinkExam, payment gateway (Razorpay/Cashfree TBC), Admin APIs, dashboard data — see [SCOPE.md](SCOPE.md) open points.
