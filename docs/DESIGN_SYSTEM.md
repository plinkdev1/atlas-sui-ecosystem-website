# Atlas Protocol Design System

## Overview

The Atlas Protocol website uses a modern dark design system inspired by HyperSui — deep navy backgrounds with electric blue accents, creating a premium, tech-forward aesthetic for the Sui blockchain infrastructure hub.

## Color Palette (5 Colors, Strictly Enforced)

All colors are defined as CSS variables in `app/globals.css` and work in both light and dark themes. The primary theme is **dark mode**.

### Dark Mode (Primary)
- **Background**: `#070D1A` — Deep navy, the primary page background
- **Foreground**: `#F0F4FF` — Cool near-white, all text
- **Primary**: `#2B7FFF` — Electric blue, all CTAs, accents, highlights, glow effects
- **Muted**: `#1A2F5A` — Dark blue-gray, card backgrounds, secondary elements
- **Muted Foreground**: `#9CA3AF` — Medium gray, secondary text, labels

### CSS Variables
All colors are accessible as both `--color-*` and direct CSS variables:
```css
/* Usage in CSS */
background-color: var(--background);
color: var(--foreground);
border-color: var(--border);
box-shadow: 0 0 20px rgba(43, 127, 255, 0.2); /* Primary blue glow */
```

### Tailwind Usage
Use the semantic Tailwind classes that reference these variables:
```jsx
<div className="bg-background text-foreground border border-border">
  <button className="bg-primary text-primary-foreground rounded-full">CTA</button>
</div>
```

## Typography

Two font families, maximum:

### Space Grotesk (Headings)
- **Font**: `Space Grotesk` (imported from Google Fonts)
- **CSS Variable**: `--font-display`
- **Usage**: All headings, section titles, bold text for emphasis
- **Classes**:
  - `.heading-hero` — 4xl/6xl, bold (hero section titles)
  - `.heading-section` — 3xl/4xl, bold (section headings)
  - `.heading-subsection` — xl/2xl, semibold (subsection titles)

```jsx
<h1 className="heading-hero">The Infrastructure Hub for Sui</h1>
<h2 className="heading-section">Why Sui Chain</h2>
<h3 className="heading-subsection">Developer-Friendly</h3>
```

### Inter (Body)
- **Font**: `Inter` (already configured via `--font-sans`)
- **CSS Variable**: `--font-sans`
- **Usage**: All body text, navigation, UI elements
- **Classes**:
  - `.text-subtitle` — lg text with leading-relaxed (hero subtitles)
  - `.text-body` — base text with leading-relaxed (paragraphs)

```jsx
<p className="text-body">Your comprehensive toolkit for blockchain infrastructure.</p>
<p className="text-subtitle">Explore the complete Sui ecosystem.</p>
```

## Component Patterns

### Cards (Modern)
Dark navy cards with subtle blue borders and hover effects.

```jsx
<div className="card-modern">
  <h3 className="heading-subsection">Wallet Cleanup</h3>
  <p className="text-body">Remove spam and scam tokens safely.</p>
</div>
```

CSS Class: `.card-modern`
- Background: `#0F1629`
- Border: `1px solid #1A2F5A`
- Hover: Border becomes `#2B7FFF` with transition

### Blue Accent Cards
For feature highlight cards (used in bento grids).

```jsx
<div className="card-modern-blue">
  <h3 className="heading-subsection">Non-Custodial Security</h3>
</div>
```

CSS Class: `.card-modern-blue`
- Background: `#2B7FFF` at 10% opacity
- Border: `#2B7FFF` at 30% opacity

### Buttons

**Primary Button** (for main CTAs)
```jsx
<button className="button-primary-modern">Open App →</button>
```
- Background: `#2B7FFF`
- Hover: Darker blue `#1E5FB0` + blue glow shadow
- Rounded: `rounded-full`
- Always includes glow effect

**Secondary Button** (for alternative actions)
```jsx
<button className="button-secondary-modern">Learn More</button>
```
- Background: Transparent
- Border: `#1A2F5A`, hover becomes `#2B7FFF`
- Rounded: `rounded-full`

### Section Spacing
```jsx
<section className="section-hero container-modern">
  {/* Hero sections with max-width container and hero padding */}
</section>

<section className="section-default container-modern">
  {/* Default sections */}
</section>
```

- `.section-hero` — `py-24 md:py-32`
- `.section-default` — `py-20 md:py-24`
- `.container-modern` — `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`

### Bento Grid (Feature Sections)
Asymmetric grid for feature displays.

```jsx
<div className="bento-grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
  <div className="bento-item">Feature 1</div>
  <div className="bento-item bento-item-large md:col-span-2 md:row-span-2">Feature 2 (Large)</div>
  <div className="bento-item">Feature 3</div>
  <div className="bento-item">Feature 4</div>
</div>
```

- `.bento-grid` — gap spacing
- `.bento-item` — base card styling
- `.bento-item-large` — `md:col-span-2 md:row-span-2` for highlighted feature

### Navbar
Sticky, translucent navbar with backdrop blur.

```jsx
<nav className="navbar-modern">
  <div className="container-modern flex justify-between items-center py-4">
    {/* Logo, links, "Open App" button */}
  </div>
</nav>
```

- `.navbar-modern` — sticky, blurred, bordered
- Becomes more opaque on scroll (`.navbar-modern-scroll` class added via JS)

### Footer
Dark navy footer matching design system.

```jsx
<footer className="footer-modern">
  <div className="container-modern">
    {/* Footer content */}
  </div>
</footer>
```

- `.footer-modern` — `bg-[#0F1629]`, top border, `py-16 md:py-20`

## Effects & Animations

### Glow Effects
Blue electric glow for emphasis.

```jsx
<div className="glow-blue">Element with subtle glow</div>
<div className="glow-blue-lg">Element with large glow</div>
```

- `.glow-blue` — `shadow-[0_0_20px_rgba(43,127,255,0.2)]`
- `.glow-blue-lg` — `shadow-[0_0_40px_rgba(43,127,255,0.3)]`

### Gradient Text
Electric blue to cyan gradient text (e.g., for feature titles).

```jsx
<h2 className="text-gradient">Premium Feature</h2>
```

CSS Class: `.text-gradient`
- Gradient: blue → cyan
- Clipped to text

### Marquee Animation
Animated logo carousel (infinite scroll, pauses on hover).

```jsx
<div className="marquee">
  {/* Logo items */}
</div>
```

CSS Class: `.marquee`
- Animation: 20s linear infinite
- Pauses on `:hover`

### Fade In Up
Entrance animation for sections (use with Intersection Observer or Framer Motion).

```jsx
<div className="fade-in-up">Content fades in with upward movement</div>
```

CSS Class: `.fade-in-up`
- Animation: 0.6s ease-out
- From: opacity 0, translateY 20px
- To: opacity 1, translateY 0

## Layout Philosophy

### Mobile-First Design
- All components start at mobile size (single column, full width)
- Use `md:` prefixes for tablet and desktop enhancements
- Never use floats or absolute positioning for layout

### Flexbox for Most Layouts
```jsx
<div className="flex items-center justify-between gap-4">
  {/* Navbar items, card content, etc. */}
</div>
```

### Grid for Complex 2D Layouts (e.g., Bento)
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Bento grid items */}
</div>
```

### Spacing with Tailwind Scale
- Gap classes: `gap-4`, `gap-x-2`, `gap-y-6`
- Padding: `p-4`, `px-6`, `py-8` (prefer scale values)
- Margins: Only use for negative space between sections
- Never use arbitrary values like `p-[16px]` — use scale instead

## Text Alignment & Readability
- Use `text-balance` or `text-pretty` on large headings to optimize line breaks
- Max line length: typically 80-90 characters (handled by container width)
- Body text line-height: `leading-relaxed` (1.6)

## Dark Mode (Only)
The site is dark-mode-only for the redesigned landing pages. All components assume dark theme.

If you need to style for light mode (legacy pages), use:
```css
:not(.dark) .component {
  /* Light mode styles */
}
```

## Design System Usage Examples

### Hero Section
```jsx
<section className="section-hero container-modern">
  <h1 className="heading-hero">The Infrastructure & Security Hub for Sui</h1>
  <p className="text-subtitle mt-6">
    Explore the complete Sui ecosystem with curated tools and providers.
  </p>
  <div className="flex gap-4 justify-center mt-12">
    <button className="button-primary-modern">Explore the Hub →</button>
    <button className="button-secondary-modern">View Roadmap</button>
  </div>
</section>
```

### Feature Section
```jsx
<section className="section-default container-modern">
  <h2 className="heading-section mb-12">Core Tools</h2>
  <div className="bento-grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="card-modern">
      <h3 className="heading-subsection">Wallet Cleanup</h3>
      <p className="text-body mt-3">Remove spam tokens and suspicious assets.</p>
    </div>
    <div className="card-modern-blue md:col-span-2 md:row-span-2 flex items-center justify-center">
      <div className="text-center">
        <h3 className="heading-subsection">Curated Directory</h3>
      </div>
    </div>
    <div className="card-modern">
      <h3 className="heading-subsection">Explainer</h3>
      <p className="text-body mt-3">Decode any Sui transaction instantly.</p>
    </div>
  </div>
</section>
```

## Accessing the Design System in Code

### CSS
```css
background-color: var(--background);
color: var(--primary);
font-family: var(--font-display); /* For headings */
```

### Tailwind
```jsx
className="bg-background text-primary font-bold"
```

### Next.js Variables
All fonts are available as CSS variables in the root layout:
- `--font-sans` (Inter)
- `--font-display` (Space Grotesk)
- Plus 5 core color variables

## Summary Table

| Element | Class | Colors | Font | Notes |
|---------|-------|--------|------|-------|
| Hero Heading | `.heading-hero` | Text: `#F0F4FF` | Space Grotesk, 6xl bold | Use in hero sections |
| Section Heading | `.heading-section` | Text: `#F0F4FF` | Space Grotesk, 4xl bold | Main section titles |
| Subsection Heading | `.heading-subsection` | Text: `#F0F4FF` | Space Grotesk, 2xl bold | Card/subsection titles |
| Body Text | `.text-body` | Text: `#9CA3AF` | Inter, base | Paragraphs, descriptions |
| Card | `.card-modern` | BG: `#0F1629`, Border: `#1A2F5A` | — | Dark card with blue hover |
| Card (Blue) | `.card-modern-blue` | BG: `#2B7FFF`/10%, Border: `#2B7FFF`/30% | — | Feature highlight card |
| Primary Button | `.button-primary-modern` | BG: `#2B7FFF` | Inter, semibold | Main CTAs only |
| Secondary Button | `.button-secondary-modern` | Border: `#1A2F5A` | Inter, semibold | Alternative actions |
| Glow | `.glow-blue` / `.glow-blue-lg` | Blue: 43, 127, 255 | — | Subtle/large shadows |
| Gradient Text | `.text-gradient` | Blue → Cyan | Space Grotesk | For emphasis |

---

**Last Updated**: Phase 2, Global Design System
**Status**: Active — All new landing pages should use these patterns
