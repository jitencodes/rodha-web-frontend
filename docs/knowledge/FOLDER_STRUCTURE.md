# Folder Structure

```
rodha-web-frontend/
├── .cursor/rules/          # Cursor agent rules (always / glob-scoped)
├── docs/
│   ├── PHASE1_PRD.md       # Phase 1 PRD (authoritative detail)
│   ├── UI_DESIGN_ANALYSIS.md
│   └── knowledge/          # This knowledge base
├── public/
│   └── assets/
│       ├── backgrounds/    # Hero/section SVG backgrounds
│       ├── icons/          # UI & brand icons (SVG)
│       ├── images/         # Logos + placeholders/
│       ├── patterns/       # Texture / grid patterns
│       └── shapes/         # Decorative shapes
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── layout.tsx      # Root: fonts, globals, metadata, JSON-LD only
│   │   ├── globals.css     # Design tokens + utility classes
│   │   ├── (website)/      # Public site route group (URLs unchanged)
│   │   │   ├── layout.tsx  # WebsiteStoreProvider + SiteFrame (banner/header/footer; auth chrome on /login /signup)
│   │   │   ├── page.tsx    # Homepage `/`
│   │   │   ├── login/, signup/
│   │   │   ├── about/, team/, faculty/, blog/, contact/, faq/
│   │   │   ├── privacy-policy/, terms-and-conditions/, refund-policy/, disclaimer/
│   │   │   ├── courses/, test-series/, category/[category_slug]/
│   │   │   └── legacy-homepage/
│   │   ├── account/            # Nested AccountShell only (no public SiteFrame)
│   │   └── api/                # Route Handlers
│   ├── components/
│   │   ├── auth/           # Login/signup screen, banner slider, Google button
│   │   ├── account/        # AccountShell, sidebar, header, cards, cart, orders, profile, theme CSS, AccountPagination
│   │   ├── ui/             # Primitives (Button, Input, Modal, …)
│   │   ├── layout/         # Header, Footer, Container, MobileNav, Banner, SiteFrame
│   │   ├── sections/       # Page sections (Hero, CTABand, TrustBar, course/*, …)
│   │   ├── cards/          # Domain cards (Course, Faculty, Blog, …) — CourseCardV2 optional ctaLabel for account Buy tab
│   │   └── forms/          # Contact, LeadCapture, Newsletter
│   ├── data/               # Static mock data modules (+ course-details resolver; account/*)
│   ├── hooks/              # Shared React hooks
│   └── lib/                # constants, types, utils (cn), api/, auth/, account/ (types, cart-totals, pagination)
│       └── api/            # Website CMS client + module services/mappers
├── AGENTS.md
├── CLAUDE.md               # @AGENTS.md
└── README.md
```

---

## Where New Code Belongs

| Creating… | Put it in… |
|-----------|------------|
| Public route / page | `src/app/(website)/<route>/page.tsx` (URLs omit `(website)`) |
| Account route / page | `src/app/account/<route>/page.tsx` |
| Route / page (generic) | `src/app/<route>/page.tsx` |
| Account dashboard UI | `src/components/account/` |
| Account types / helpers | `src/lib/account/` |
| UI primitive | `src/components/ui/` |
| Layout chrome | `src/components/layout/` |
| Page section | `src/components/sections/` |
| Domain card | `src/components/cards/` |
| Form | `src/components/forms/` |
| Hook | `src/hooks/` |
| Shared type | `src/lib/types.ts` (or colocated if truly local) |
| Website API module | `src/lib/api/modules/<name>/{types,service,mapper}.ts` |
| API client / env | `src/lib/api/client.ts`, `src/lib/api/env.ts` |
| Constant / nav / site config | `src/lib/constants.ts` or `src/data/` |
| Static content lists | `src/data/<domain>.ts` |
| Account static data | `src/data/account/` |
| SVG icon / brand asset | `public/assets/icons/` or `images/` |

Do not invent parallel folder hierarchies (e.g. `src/shared/`, `src/common/`) unless discussed and logged in [DECISIONS.md](DECISIONS.md).

---

## Path Alias

`@/*` → `./src/*` (tsconfig). Prefer `@/components/...`, `@/lib/...`, `@/data/...`.
