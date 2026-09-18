# Coding Standards

## Language & Types

- TypeScript strict usage for all new code
- Shared domain types live in [`src/lib/types.ts`](../../src/lib/types.ts)
- Prefer interfaces for object shapes already used in the project
- Avoid `any`; narrow with existing union types (e.g. `CategoryId`)

## Imports

- Path alias: `@/` → `src/`
- Order (conventional):
  1. External packages (`react`, `next`, …)
  2. `@/components/...`
  3. `@/lib/...`, `@/data/...`, `@/hooks/...`
  4. Relative imports (rare)
- Class merging: `import { cn } from "@/lib/utils"`

## React / Next.js

- App Router pages export `metadata` (or `generateMetadata`) where SEO applies
- Prefer Server Components; `"use client"` only when needed
- Check `node_modules/next/dist/docs/` for Next.js 16 APIs before using unfamiliar APIs
- Do not assume legacy Pages Router or old Next APIs

## Components

- Functional components only
- Named exports for components
- Props: explicit type or interface; optional `className?: string`
- Keep files focused — split when a file becomes a monolith

## Styling

- Tailwind utility classes + tokens from `globals.css`
- No new CSS modules unless justified and logged
- No hardcoded hex when a token exists
- Use `cn()` for conditional classes

## Data & Constants

- Static Phase 1 content: `src/data/*.ts`
- Site-wide config: `src/lib/constants.ts`
- Website CMS APIs use `src/lib/api/` (SSR-first). Follow `.cursor/skills/api-integration/SKILL.md` and [API_STANDARDS.md](API_STANDARDS.md)

## Forms

- Client components with controlled or form-state pattern matching existing forms
- Client-side validation per PRD rules
- Submission: currently TODO — do not silently invent unverified backends; follow [API_STANDARDS.md](API_STANDARDS.md)

## Lint

- Run `npm run lint` for material changes when practical
- Follow `eslint-config-next` rules
