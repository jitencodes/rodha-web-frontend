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
│   │   ├── layout.tsx      # Root: banner + header + main + footer
│   │   ├── page.tsx        # Homepage
│   │   ├── globals.css     # Design tokens + utility classes
│   │   ├── about/, team/, faculty/, blog/, contact/, faq/
│   │   ├── privacy-policy/, terms-and-conditions/, refund-policy/, disclaimer/
│   │   ├── courses/[slug]/   # Course detail (canonical)
│   │   └── category/[category_slug]/
│   ├── components/
│   │   ├── ui/             # Primitives (Button, Input, Modal, …)
│   │   ├── layout/         # Header, Footer, Container, MobileNav, Banner
│   │   ├── sections/       # Page sections (Hero, CTABand, TrustBar, course/*, …)
│   │   ├── cards/          # Domain cards (Course, Faculty, Blog, …)
│   │   └── forms/          # Contact, LeadCapture, Newsletter
│   ├── data/               # Static mock data modules (+ course-details resolver)
│   ├── hooks/              # Shared React hooks
│   └── lib/                # constants, types, utils (cn)
├── AGENTS.md
├── CLAUDE.md               # @AGENTS.md
└── README.md
```

---

## Where New Code Belongs

| Creating… | Put it in… |
|-----------|------------|
| Route / page | `src/app/<route>/page.tsx` |
| UI primitive | `src/components/ui/` |
| Layout chrome | `src/components/layout/` |
| Page section | `src/components/sections/` |
| Domain card | `src/components/cards/` |
| Form | `src/components/forms/` |
| Hook | `src/hooks/` |
| Shared type | `src/lib/types.ts` (or colocated if truly local) |
| Constant / nav / site config | `src/lib/constants.ts` or `src/data/` |
| Static content lists | `src/data/<domain>.ts` |
| SVG icon / brand asset | `public/assets/icons/` or `images/` |

Do not invent parallel folder hierarchies (e.g. `src/shared/`, `src/common/`) unless discussed and logged in [DECISIONS.md](DECISIONS.md).

---

## Path Alias

`@/*` → `./src/*` (tsconfig). Prefer `@/components/...`, `@/lib/...`, `@/data/...`.
