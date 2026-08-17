# Naming Conventions

## Files

| Kind | Convention | Example |
|------|------------|---------|
| React component | `PascalCase.tsx` | `CourseCard.tsx` |
| Hook | `camelCase.ts` prefixed `use` | `useCountdown.ts` |
| Util / data / lib | `camelCase.ts` | `courses.ts`, `utils.ts` |
| Route segment | kebab-case folder | `privacy-policy/`, `terms-and-conditions/` |
| Dynamic segment | `[slug]` | `faculty/[slug]/page.tsx` |
| Docs | `SCREAMING_SNAKE` or descriptive | `PROGRESS.md`, `UI_STANDARDS.md` |
| Cursor rules | kebab-case `.mdc` | `ui-standards.mdc` |

## Components & Hooks

- Components: `PascalCase` (`HeroSection`, `CTABand`)
- Hooks: `use` + `PascalCase` remainder (`useCountdown`)
- Props types: `ComponentNameProps` when exported separately

## Types & Constants

- Types / interfaces: `PascalCase` (`Course`, `CategoryId`)
- Union string IDs: lowercase literals (`"cat" | "ipmat" | "gdpi" | "clat"`)
- Constants / config objects: `SCREAMING_SNAKE` or `PascalCase` object export matching existing (`CATEGORIES`, `VALUE_PROPS`)
- Enums: avoid unless necessary; prefer union types

## CSS / Tailwind

- Custom utility classes: kebab-case prefixed by role (`.btn-primary`, `.card-base`, `.container-rodha`)
- Theme tokens: match `globals.css` (`bg-bg-primary`, `text-text-muted`, `orange-500`)
- Do not invent parallel token names

## Routes & URLs

| Page | Path |
|------|------|
| Home | `/` |
| Category | `/category/[category_slug]` (e.g. `/category/cat`) |
| Course detail | `/category/[category_slug]/courses/[slug]` |
| Faculty | `/faculty`, `/faculty/[slug]` |
| Blog | `/blog`, `/blog/[slug]` |

Slugs: kebab-case.

## Assets

- Icons: descriptive kebab-case SVG (`chevron-down.svg`, `cat-icon.svg`)
- Logos: `rodha-logo*.svg`
- Placeholders: `public/assets/images/placeholders/<role>.svg`
