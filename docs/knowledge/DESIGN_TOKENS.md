# Design Tokens

**Source of truth (implementation):** [`src/app/globals.css`](../../src/app/globals.css)  
**Source of truth (design analysis):** [UI_DESIGN_ANALYSIS.md](../UI_DESIGN_ANALYSIS.md)

Do not hardcode hex colors or magic spacing when a token or utility class exists.

---

## Color Tokens (CSS variables / Tailwind theme)

### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `orange-500` / `--color-primary` | `#F97316` | CTAs, accents, active |
| `orange-600` | `#EA580C` | Primary hover |
| `orange-400` | `#FB923C` | Highlights |
| `orange-300` | `#FDBA74` | Subtle accents |
| `orange-700` | `#C2410C` | Pressed |

### Backgrounds
| Token | Hex |
|-------|-----|
| `bg-primary` | `#0A0A0A` |
| `bg-secondary` | `#111111` |
| `bg-tertiary` | `#1A1A1A` |
| `bg-surface` | `#1E1E1E` |
| `bg-hover` | `#252525` |
| `section-white` / `.bg-section-white` | `#FFFFFF` |
| `section-beige` / `.bg-section-beige` | `#FFF3E8` |
| `section-beige-border` / `.border-section-beige` | `#FFEAD6` |
| `section-cream` / `.bg-section-cream` | `#FFFBF5` |
| `brand-orange` | `#F06B23` |

### Text
| Token | Hex |
|-------|-----|
| `text-primary` | `#FFFFFF` |
| `text-secondary` | `#D4D4D4` |
| `text-muted` | `#A3A3A3` |
| `text-dimmed` | `#737373` |
| `text-orange` | `#F97316` |

### Borders & Accents
| Token | Hex |
|-------|-----|
| `border-default` | `#262626` |
| `border-subtle` | `#1F1F1F` |
| `border-hover` | `#404040` |
| `accent-green` | `#22C55E` |
| `accent-red` | `#EF4444` |
| `accent-yellow` | `#EAB308` |
| `accent-blue` | `#3B82F6` |

---

## Typography Scale

| Class | Size | Line height | Usage |
|-------|------|-------------|-------|
| `text-hero` | 48px | 1.1 | Hero headline |
| `text-h1` | 36px | 1.2 | Section headings |
| `text-h2` | 28px | 1.3 | Sub-section |
| `text-h3` | 22px | 1.3 | Card titles |
| `text-h4` | 18px | 1.4 | Faculty names, etc. |
| `text-body-lg` | 17px | 1.6 | Lead / nav |
| `text-body` | 15px | 1.6 | Body |
| `text-body-sm` | 13px | 1.5 | Captions |
| `text-caption` | 11px | 1.4 | Tags, footer |

Font: Inter (`--font-inter` via `next/font`).

---

## Radius & Shadow

| Token | Value |
|-------|-------|
| `rounded-sm` | 4px |
| `rounded` / default | 6px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-xl` | 12px |
| `shadow-orange` | orange CTA glow |
| `shadow-orange-lg` | large orange glow |

Mixed-theme docs: [`docs/style.md`](../../docs/style.md)

---

## Utility Classes (prefer these)

| Class | Purpose |
|-------|---------|
| `.container-rodha` | Max-width 1280px + responsive padding |
| `.section-spacing` | Vertical section padding (responsive) |
| `.card-base` | Dark card + border + radius |
| `.card-hover` | Orange border + lift on hover |
| `.shine-sweep-hover` | One-shot diagonal light sweep on hover (pair with `.card-premium-hover`; stacks with `.shine-sweep`) |
| `.hover-shine` | Skewed horizontal shine-splash on hover/focus-within (1s; do not stack with `.shine-sweep*`) |
| `.premium-border-glow` | Rotating conic border glow (6s); pair with `.glow-accent-orange` or `.glow-accent-silver` |
| `.btn-primary` / `.btn-secondary` / `.btn-ghost` | Button styles |
| `.input-base` | Form input |
| `.badge-base` | Pill badge base |
| `.text-gradient-orange` | Orange gradient text |
| `.bg-hero-gradient` | Hero background |
| `.glow-orange` / `.glow-orange-strong` | Glow effects |

Also prefer the `Container` React component over raw `.container-rodha` when composing pages.

---

## Container

`--container-max-width: 1280px`
