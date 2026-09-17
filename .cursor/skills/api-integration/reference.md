# API integration reference

## Announcements

- Show `description` (HTML)
- Countdown only when `endAt` is present and in the future
- Rotate every `NEXT_PUBLIC_ANNOUNCEMENT_INTERVAL_MS` with 3D flip
- Hide bar when list empty after filtering expired items

## Categories (nav)

| API | UI |
|-----|-----|
| `name` | Switcher trigger / short label |
| `title` | `menuLabel` (dropdown + mobile) |
| `slug` | `/category/${slug}` |
| `description` | Secondary line |

Active exam: match pathname slug against the API list.

## Home

### Banner

| API | UI |
|-----|-----|
| `title` | H1 |
| `titleHighlights` | Typewriter words (normalize string / string[] / `{text}[]`) |
| `description` | Supporting copy; hide if null |
| `stacks` | Orange bottom strip `{ value, label }[]`; hide if empty/null |
| `videoYoutubeLink` | `HeroVideoEmbed` video id |
| `listItems` / `cats` | Do not render |

### Categories

Use `data.categories` via shared `mapCategories`. Local `CATEGORIES` assets for matching slugs keep ExamCardV2 infographics.

### FAQs

`id`, `question`, `answer` → accordion; hide section if empty. FAQ JSON-LD from the same list.

### studentResultGroups

| API | UI |
|-----|-----|
| `result.overline` | Badge |
| `result.title` | Title |
| `result.subTitle` | Subtitle |
| (no description on result) | Hide description paragraph |
| `category.slug` | CTA → `/category/${slug}#results` |
| `students[]` | `TopperCardV2` via `fullName`, `profileImageUrl`, `percentage`, `rank`, `collegeName`, `examYear`, `batch` |

Skip groups with zero mappable students. Hide whole results section if none remain.

## Category page (`GET api/website/categories/:slug`)

One payload drives the landing. Hide a section when its array is empty.

| API | UI |
|-----|-----|
| `banner` | `mapWebsiteBanner` → `CategoryHeroSectionV2` (Typewriter highlights; video over image) |
| `faculty[]` | Faculty cards (`mapFacultyCards`) — same response as testimonials / successStories / FAQs |
| `courses[]` | `CategoryCoursesSlider`; map `courseType` for existing static chips |
| `testimonials[]` | Student testimonials |
| `successStories[]` | YouTube story cards via `youtubeLink` |
| `faqs[]` | Accordion + FAQ JSON-LD |
| `studentResultsByResult` | Topper cards + optional result stacks |

JSON landings remain only for section copy/themes, not for faculty/courses/testimonials.

## Faculty

Listing filters are URL search params mapped to `categoryIds` / `subjectIds` (API numeric ids), `search`, `sortBy` (`rating-desc` → `experience_desc`). Featured marquee hides when `featuredFaculty` is empty.

Detail courses use the same `mapCourses` + `courseType` chips as category. Hide courses / reviews / videos / achievements / results when empty. Do not invent result stats.

## Banners (shared)

Video (`videoYoutubeLink`) wins when both video and `mediaUrl` exist. Home + category keep Typewriter for highlights; about / team / faculty listing use the first highlight.

## Legal

`GET api/website/legal-pages?pageType=` (`PRIVACY_POLICY` / `TERMS_OF_USE` / `REFUND_POLICY` / `DISCLAIMER`). Render HTML; build TOC from `h2`/`h3` (or numbered `<p>` fallback). Hide TOC when empty.

## Contact POST

Browser posts to `POST /api/leads`. Route Handler calls `POST api/website/contact` with collected fields only (`fullName`, `countryCode`, `phone`, optional `email` / `websiteCategoryId` / `message`). Newsletter stays SMTP-only. SMTP also notifies ops after a successful CMS submit.
