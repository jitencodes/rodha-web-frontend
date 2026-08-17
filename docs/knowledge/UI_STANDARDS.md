# UI Standards

## Design Source of Truth

| Screen | Mockup | Notes |
|--------|--------|-------|
| Homepage | `rodha home page UI screen.png` | Approved — pixel-perfect target |
| CAT landing | `cat landing page Ui.png` | Category page reference |
| Spec extract | [UI_DESIGN_ANALYSIS.md](../UI_DESIGN_ANALYSIS.md) | Tokens & component specs |

Before implementing any approved screen:

1. Analyze the design
2. Extract measurements, spacing, typography, shadows, gradients, backgrounds, icons
3. Map to existing tokens / components
4. Recreate with maximum visual accuracy — do not approximate

---

## Theme

- Mixed theme for Phase 1 marketing site: alternating **dark**, **beige (`#FFF3E8`)**, and **white** section surfaces
- Primary accent: orange `#F97316` / brand orange `#F06B23`
- Reference pages: Homepage `/` and category landings via `/category/[slug]` (CAT reference composition)
- Full rules: [`docs/style.md`](../../docs/style.md)
- Use design tokens — see [DESIGN_TOKENS.md](DESIGN_TOKENS.md)
- Prefer utility classes and shared components over inline styles
- Do not flip the global body to a single light theme

---

## Responsive Breakpoints (PRD)

| Tier | Width | Target |
|------|-------|--------|
| Mobile S | 320px | Small phones |
| Mobile | 375px – 639px | Standard phones |
| Tablet | 640px – 1023px | Tablets |
| Desktop | 1024px – 1279px | Standard desktop |
| Desktop L | 1280px – 1535px | Large desktop |
| Desktop XL | 1536px+ | Ultra-wide |

Implement responsive behavior in the first pass (not desktop-first then retrofit). Prefer fluid layouts; avoid fixed widths unless required by the design.

Tailwind defaults map roughly: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

---

## Layout Patterns

- Page shell: `PromotionalBanner` + `Header` + `<main>` + `Footer` (root layout)
- Content width: `Container` / `.container-rodha` (max 1280px)
- Sections: `.section-spacing` + `SectionHeader` when applicable
- Card grids: 1 → 2 → 4 columns for exam/course cards; faculty often 5-col on large desktop
- Carousels: use existing `Carousel` for horizontal card rows

---

## Interaction & Motion

- Hover: card lift, orange border/glow, button darken — match existing patterns
- Use theme animations sparingly: `animate-fade-in`, `animate-slide-up`, etc. from `globals.css`
- Countdown: `CountdownTimer` + `useCountdown`

---

## Icons & Images

- Prefer assets in `public/assets/icons/` and `public/assets/images/`
- Always provide meaningful `alt` text
- Use placeholders in `public/assets/images/placeholders/` until real assets exist
- Optimize images; avoid shipping large unoptimized bitmaps when SVG or Next Image is appropriate

---

## Accessibility Baselines

- Semantic HTML (`main`, headings hierarchy, labels on form fields)
- Sufficient contrast on dark backgrounds (white/secondary text on `#0A0A0A`)
- Focus styles on interactive controls (inputs already have orange focus ring via `.input-base`)
