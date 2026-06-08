# Atlas Protocol - Design System Documentation

## Design Philosophy

Atlas uses a glassmorphism-based design system with a dark-first approach. The aesthetic is premium crypto/DeFi with frosted glass panels, gradient accents, and subtle animations. Light mode mirrors the glass treatment with blue-tinted whites.

## Color Palette

### Dark Theme (Primary)
| Token | Value | Usage |
|---|---|---|
| `--background` | `#070D1A` | Page background |
| `--foreground` | `#f1f5f9` | Primary text |
| `--card` | `rgba(255,255,255,0.04)` | Card backgrounds |
| `--primary` | `#2B7FFF` | Interactive elements |
| `--accent` | `#1e293b` | Hover states |

### Light Theme
| Token | Value | Usage |
|---|---|---|
| `--background` | `#f8faff` | Page background (blue-tinted white) |
| `--foreground` | `#0f172a` | Primary text (high contrast) |
| `--card` | `#f0f4ff` | Card backgrounds |
| `--primary` | `#2B7FFF` | Interactive elements |
| `--accent` | `#e0f2fe` | Hover states |

### Brand Gradients
| Name | Values | Usage |
|---|---|---|
| Text Gradient | `#00d4aa -> #4d9fff` | Hero headings, brand text |
| Brand Gradient | `#00d4aa -> #4d9fff` | CTA buttons |
| Orange CTA | `#F97316 -> #ea580c` | Secondary CTA sections |
| Divider Gradient | `transparent -> #4d9fff -> #00d4aa -> transparent` | Section dividers |

### Usage Rules
- Orange (`#F97316`) is ONLY for CTA sections, never as general accent
- Teal (`#00d4aa`) and Blue (`#4d9fff`) are the primary brand pair
- All backgrounds must use design tokens, never raw colors like `bg-white` or `bg-black`

## Glass Classes

### `.glass-panel` (Primary)
```css
background: rgba(255,255,255,0.02);
backdrop-filter: blur(12px);
border: 1px solid rgba(99,179,237,0.1);
border-top: 1px solid rgba(99,179,237,0.2);
border-radius: 1rem;
box-shadow: 0 4px 30px rgba(0,0,0,0.3);
transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```
Hover: `translateY(-4px)`, border glow to `rgba(77,159,255,0.3)`.

### `.glass-card` (Alias)
Same properties as `.glass-panel`. Used interchangeably.

### `.card-modern` (Legacy)
Glass treatment in both themes. Light mode: `rgba(255,255,255,0.65)` with blue border.

### `.bento-item`
Glass card for grid layouts. Flex column with space-between.

## Typography

| Font | Variable | Usage |
|---|---|---|
| Inter | `--font-sans` | Body text |
| Space Grotesk | `--font-display` | Display headings |
| Outfit | `--font-outfit` | Optional display alternative |
| Geist Mono | `--font-mono` | Code blocks |

## Animation Classes

| Class | Effect |
|---|---|
| `.shimmer-bg` | Horizontal light sweep (3s infinite) |
| `.reveal` + `.active` | Fade up from 30px (0.8s ease-out) |
| `.animate-float` | Vertical float 10px (6s ease-in-out) |
| `.animate-pulse-glow` | Opacity + box-shadow pulse (3s) |
| `.radial-bloom` | Radial gradient overlay (dark only) |
| `.mesh-bg` | Dot grid pattern with fade mask |

## Component Patterns

### RevealSection
Wraps content with IntersectionObserver-triggered `.reveal.active` animation.

### GlassPanel
Wrapper div with `.glass-panel` class, optional `hover` and `glow` props.

### LogoImage (in protocol-card.tsx)
Multi-source image with fallback chain: provided URL -> Clearbit -> gradient letter-avatar. Never shows broken image symbols.

### PartnerMarquee
Infinite CSS scroll carousel with Clearbit logos, edge fade masks, hover pause.

## Spacing and Layout
- Use Tailwind spacing scale: `p-4`, `gap-6`, `py-20`
- Sections use `container mx-auto px-4` with `py-20 md:py-28`
- Cards use `p-6` or `p-8` padding
- Grid gaps: `gap-6` for cards, `gap-4` for compact grids

## Responsive Breakpoints
- Mobile first: base styles
- `md:` (768px): 2-column grids, larger text
- `lg:` (1024px): 3-4 column grids, max-width containers

## Light Mode Considerations
- Radial bloom and mesh-bg overlays are hidden (`hidden dark:block`)
- Glass panels use `rgba(255,255,255,0.7)` with blue-tinted borders
- Mobile nav uses `bg-background/80` (theme-aware)
- Footer uses frosted white background
- Scrollbar is theme-aware (light blue in light mode)
