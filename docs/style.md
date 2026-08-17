# Rodha Mixed Theme Style Guide

Canonical visual contract for Phase 1 marketing pages after the homepage and `/category/cat` references.

Implementation source of truth: [`src/app/globals.css`](../src/app/globals.css)

---

## Philosophy

Rodha pages use a **mixed theme**, not a single light or dark skin.

- Dark sections establish authority (hero, testimonials, dense utility surfaces)
- Beige / peach sections (`#FFF3E8`) create warmth and visual rhythm
- White sections provide calm reading and card contrast
- Orange (`#F97316` / `#F06B23`) remains the only primary accent

Do **not** force an entire page into one theme. Alternate section surfaces intentionally.

---

## Surface Tokens

| Token / class | Value | Use |
|---|---|---|
| `bg-bg-primary` / dark default | `#0A0A0A` | Dark sections, page chrome |
| `bg-section-white` | `#FFFFFF` | Light reading / results / FAQ |
| `bg-section-beige` | `#FFF3E8` | Courses, faculty, CTA shells, app promo |
| `border-section-beige` | `#FFEAD6` | Light-card borders |
| `bg-section-cream` | `#FFFBF5` | Soft cream footers / legal accents |
| `text-brand-orange` / `#F06B23` | Brand orange | Badges, emphasis |

Light text helpers:

- Wrap light sections with `home-on-light`
- Prefer `home-light-heading`, `home-light-body`, `home-light-muted` when needed

---

## Alternating Section Rules

Recommended category landing rhythm (reference):

1. Dark hero
2. White results
3. Beige courses
4. White test series
5. Beige faculty
6. Dark testimonials
7. Beige CTA
8. White stories
9. Beige app promo
10. White FAQs

General page guidance:

- Start with dark or beige hero depending on page purpose
- Never place two identical light surfaces back-to-back when a beige/white swap is available
- Keep at least one dark island on long pages for contrast
- Preserve existing section order/content while changing surface classes

---

## Typography

| Class | Size | Notes |
|---|---|---|
| `text-hero` | 48px | Dark heroes |
| `text-h1` | 36px | Page titles |
| `text-h2` / `text-h2-v2` | 28px / 32→48px | Section titles (`SectionHeaderV2`) |
| `text-h3` | 22px | Card titles |
| `text-h4` | 18px | Names / compact titles |
| `text-body-lg` | 17px | Lead copy |
| `text-body` | 15px | Body |
| `text-body-sm` | 12→13px | Support copy |
| `text-caption` | 11px | Meta / tags |

Fonts:

- Inter for UI / body
- Montserrat for selected V2 headings

On light sections, headings should resolve near `#0A0A0A`; muted body near `#737373` / `#525252`.

---

## Spacing

| Utility | Mobile → Desktop |
|---|---|
| `.section-spacing` | 1.5rem → 2.25rem (legacy denser pages) |
| `.home-section-spacing` | 2.5rem → 4.5rem (mixed-theme pages) |
| `.home-section-spacing-lg` | 3rem → 5rem |
| `.section-header` | 25px bottom margin locked |

Prefer `home-section-spacing` for new/updated mixed-theme pages.

---

## Radius, Borders, Shadows

Implemented radii:

- `4px` small badges
- `6px` default cards / buttons / inputs
- `8px` larger cards
- `12px` XL surfaces

Shadows:

- Neutral elevation for light cards
- `shadow-orange` / `shadow-orange-lg` for CTA emphasis
- Premium utilities: `.premium-border-glow`, `.hover-shine`, `.shine-sweep*`

Avoid inventing one-off radii when `rounded-[6px]` / token radii already match the system.

---

## Components to Prefer

| Need | Use |
|---|---|
| Light section header | `SectionHeaderV2` |
| Dark section header | `SectionHeader` |
| Light course / test / faculty / topper cards | `*CardV2` |
| Category hero | `CategoryHeroSectionV2` |
| Decorative CTA | `CTABandV2Decorative` |
| FAQ on light | `AccordionV2` |
| Light stats | `ResultsStatsPanel variant="light"` |

---

## Accessibility

- Maintain contrast for text on both dark and beige/white surfaces
- Keep focus rings visible (`input-base` orange ring pattern)
- Respect `prefers-reduced-motion` (already centralized in `globals.css`)
- Preserve semantic heading order when restyling

---

## Do / Don't

**Do**

- Alternate dark / beige / white intentionally
- Reuse V2 components and tokenized surfaces
- Keep homepage and category reference structure intact

**Don't**

- Flip global `body` to light
- Hardcode peach hex when `bg-section-beige` exists
- Rebuild page structure just to match theme
- Keep abandoned top-level category URLs as live pages (use `/category/[slug]` + redirects)
