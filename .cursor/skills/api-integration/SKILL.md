---
name: api-integration
description: >-
  Integrates Rodha public website APIs with SSR-first fetch, module services,
  mappers, and empty-section hiding. Use when adding or changing API calls,
  services, hooks, response mapping, env API config, Postman-backed endpoints,
  announcements, categories, home, or any CMS/dynamic content wiring.
---

# Rodha API Integration

Default reference for all website API work. Read Postman first; type real payloads; do not invent fields.

## Source of truth

- Collection: `docs/api-collection/Rodha website Api's.postman_collection (4).json`
- Envelope: `{ success, message, data }`
- Public GETs use `x-source` from `NEXT_PUBLIC_API_SOURCE` (optional `API_KEY` → `x-api-key` when set)
- Base URL: `NEXT_PUBLIC_API_BASE_URL` with trailing slash (Postman `{{baseUrl}}`)

## Folder structure

```
src/lib/api/
  client.ts                 # apiGet / apiGetOrNull / apiPost
  env.ts                    # base URL, source, intervals, revalidate
  types.ts                  # ApiEnvelope, ApiError
  query.ts                  # buildApiQuery
  modules/<name>/
    types.ts                # API DTOs + *ViewModel
    service.ts              # getX() — calls apiGetOrNull + mapper
    mapper.ts               # mapX — API → view-model
```

No barrel `index.ts`. Import from explicit paths.

## Naming

| Kind | Pattern | Example |
|------|---------|---------|
| Service | `getX` | `getHome`, `getActiveCategories` |
| Mapper | `mapX` / `mapXs` | `mapHomePage`, `mapCategories` |
| API DTO | `XApi` | `HomeBannerApi` |
| UI model | `XViewModel` | `HomePageViewModel` |

## Fetch pattern (SSR-first)

1. Fetch in Server Components (`layout.tsx`, `page.tsx`) via module `service.ts`
2. Pass mapped view-models as props into client islands
3. `"use client"` only for interactivity (rotation, dropdowns, carousels)
4. Do **not** install TanStack Query unless a feature needs client refetch; then update this skill
5. Soft-fail with `apiGetOrNull` on chrome/page loads — hide UI on null/empty; do not crash SSR
6. Cache: `fetch(..., { next: { revalidate } })` via `apiGet` (`API_REVALIDATE_SECONDS`, default 60)
7. Mutations (contact POST) go through a Route Handler so `API_KEY` never reaches the browser

## Rules

- Shared `apiGet` / `apiPost` only — no one-off `fetch` in components
- Mappers live next to the module, not in components
- Reuse existing modules before adding new ones (shared `mapWebsiteBanner`, `mapCourses`, `mapFacultyCards`)
- Hide entire sections when arrays are empty/unavailable — no blank cards
- Do not fall back to static mock copy for integrated list/content surfaces (avoids slug drift)
- Env for URLs, source, intervals, keys — never hardcode hosts
- Match UI fields only; ignore API fields not shown in the current UI
- When a new shared pattern appears, update this skill and `docs/knowledge/API_STANDARDS.md`

## Shared mappers

| Mapper | Use |
|--------|-----|
| `mapWebsiteBanner` | Home, category, about, team, faculty heroes. Video (`videoYoutubeLink`) wins over `mediaUrl`. Home/category keep Typewriter for `titleHighlights`; other pages use the first highlight. |
| `mapCourses` / `mapCourseType` | Category + faculty course lists. `courseType` drives existing static chips (`comprehensive` / `individual` / `crash` / `other`) in `CategoryCoursesSlider`. |
| `mapFacultyCards` | Category page `faculty[]`, faculty listing, team featured faculty |

## Env vars

| Var | Role |
|-----|------|
| `NEXT_PUBLIC_API_BASE_URL` | API host with trailing `/` |
| `NEXT_PUBLIC_API_SOURCE` | `x-source` header |
| `NEXT_PUBLIC_ANNOUNCEMENT_INTERVAL_MS` | Banner flip interval (default 8000) |
| `API_KEY` | Optional server-only key |
| `API_REVALIDATE_SECONDS` | ISR window (default 60) |

If a secret key must never reach the browser, proxy through a Route Handler.

## Current modules

| Module | Endpoint | Consumers |
|--------|----------|-----------|
| announcements | `GET api/website/announcements` | Root layout → `PromotionalBanner` |
| categories | `GET api/website/categories` | Root layout → `Header` / `MobileNav` |
| categories | `GET api/website/categories/:slug` | `/category/[slug]` — banner, courses (`courseType`), faculty cards, testimonials, successStories, FAQs, results |
| home | `GET api/website/home` | `/` page → hero, categories, FAQs, results |
| faculty | `GET api/website/faculty` | `/faculty` — banner, featured, paginated list (`page`, `limit`, `search`, `categoryIds`, `subjectIds`, `sortBy`) |
| faculty | `GET api/website/faculty/:slug` | `/faculty/[slug]` — profile, testimonials, videos, courses (`courseType`) |
| subjects | `GET api/website/subjects` | Faculty listing subject filter |
| about | `GET api/website/about` | `/about` — banner, journeys, stacks, galleries |
| team | `GET api/website/team` | `/team` — banner, featuredFaculty, galleries |
| legal | `GET api/website/legal-pages?pageType=` | Privacy / Terms / Refund / Disclaimer HTML + TOC from headings |
| contact | `POST api/website/contact` | Route Handler `/api/leads` for contact, counselling, lead-capture |

Out of scope until requested: FAQ listing page API, blogs.

## Checklist for a new endpoint

1. Read Postman example response; add `types.ts`
2. Add `mapper.ts` → view-model matching existing UI props
3. Add `service.ts` using `apiGetOrNull` (or `apiPost` via Route Handler)
4. Fetch in RSC; pass props; hide empty UI
5. Extend `next.config.ts` `images.remotePatterns` if new image hosts
6. Update `REUSABLE_INVENTORY.md`, `PROGRESS.md`, this skill if a new pattern lands

## Additional resources

- Field mapping notes: [reference.md](reference.md)
- Project API standards: `docs/knowledge/API_STANDARDS.md`
