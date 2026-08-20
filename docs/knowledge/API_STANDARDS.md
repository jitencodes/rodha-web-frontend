# API Standards (Phase 1)

Phase 1 is a **static marketing site**. There is no first-party course/test/payment API.

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
| Contact / Inquiry | Name, Phone, Email, Category, Message | **Complete** — `POST /api/leads` → SMTP → `support@rodha.co.in` |
| Lead capture (promo) | Name, Mobile, Email, Exam | **Complete** — same API (`formType: lead-capture`) |
| Counselling (hero / modal) | Name, Phone, Exam | **Complete** — same API (`formType: counselling`) |
| Newsletter | Email | **Complete** — same API (`formType: newsletter`) |

**Rules:**
- Validate on the client per [PHASE1_PRD.md](../PHASE1_PRD.md) §4; server re-validates in `parseLeadPayload`
- SMTP via Nodemailer (`src/lib/email/*`); light Rodha HTML template with **absolute** logo URL from `NEXT_PUBLIC_BASE_URL` / `https://rodha.co.in` (never request Host)
- Prefer server-only `EMAIL_SMTP_*` env vars for secrets; `NEXT_PUBLIC_EMAIL_*` kept as fallback only
- Existing form components: `ContactForm`, `LeadCaptureForm`, `NewsletterSignup`, `HeroCounsellingForm`

---

## Data Layer (Phase 1)

- Static TypeScript modules in `src/data/`
- Types in `src/lib/types.ts`
- No ORM, no authenticated fetch to Rodha backend
- Blog may later use CMS — until then, static content is correct

---

## SEO / Structured Data

Required for Phase 1 (PRD §8):

- Unique meta title/description per page (`export const metadata` or `generateMetadata`)
- Open Graph / Twitter tags
- Canonical URLs
- JSON-LD where applicable: Organization, Course, FAQ, BreadcrumbList, Person, BlogPosting
- `sitemap.xml` and `robots.txt` (pending implementation)
- Semantic HTML, heading hierarchy, image alt text

---

## Phase 2 Preview (do not implement now)

SSO with Graphy/ThinkExam, payment gateway (Razorpay/Cashfree TBC), Admin APIs, dashboard data — see [SCOPE.md](SCOPE.md) open points.
