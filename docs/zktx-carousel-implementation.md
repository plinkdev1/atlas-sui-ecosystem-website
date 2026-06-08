# @zktx_io Apps Carousel Implementation Plan

## Executive Summary
Integrate @zktx_io ecosystem carousel into the existing Premium Ad Slot modal (`components/premium-ad-leaderboard.tsx`) on the home page. This showcases 5 zktx_io applications with auto-scrolling carousel, maintaining the existing "Promote Your Project" section and replacing the crown emoji with a clean enterprise icon.

---

## Scope & Objectives

### Carousel Configuration
- **Apps to Showcase**: 
  1. PTB Builder (https://ptb.wal.app/)
  2. Notary (https://notary.wal.app/)
  3. PlayMove (https://playmove.wal.app/)
  4. Sui VS Extension (https://marketplace.visualstudio.com/items?itemName=zktxio.sui-extension)
  5. zktx Docs (https://docs.zktx.io/)

- **Auto-Scroll Settings**: 4-5 seconds per slide (fast rotation for refinement effect)
- **Branding**: "built by zktx_io, check linktree https://linktr.ee/zktx_io"
- **Images**: Placeholder paths `/public/images/zktx-*.png`

### Layout Structure
The updated Premium Ad modal will contain:
1. **Promote Your Project** section (existing, unchanged)
2. **@zktx_io Apps Carousel** (new section below)
   - 5 carousel slides with app info
   - Navigation arrows
   - Dot indicators
   - Auto-scroll enabled

### Existing Elements to Preserve
- "Promote Your Project" heading & description
- "Reserve Your Slot" button
- Stats grid (10K+ visitors, etc.)
- Theme-adaptive styling

### Elements to Replace
- Crown emoji (👑) → Clean enterprise crown SVG icon from lucide-react

---

## Technical Stack

### Technology Choices
- **Carousel Library**: Embla Carousel (already used in `components/ui/carousel.tsx`)
- **Components**: Build custom carousel similar to `ad-carousel.tsx` pattern
- **Icons**: Lucide React (ChevronLeft, ChevronRight, Crown)
- **Styling**: Tailwind CSS with theme variables
- **State Management**: React hooks (useState, useEffect)
- **Images**: PNG format in `/public/images/`

### No Breaking Changes
- Reuse existing Embla Carousel or create simple state-based carousel
- Maintain current `premium-ad-leaderboard.tsx` structure
- Keep all existing CSS classes and theme integration
- Preserve responsive design patterns

---

## Implementation Roadmap

### Phase 1: Create Carousel Component
**File**: `components/zktx-apps-carousel.tsx`

```tsx
interface ZktxApp {
  id: string
  name: string
  image: string
  url: string
  description: string
}

export function ZktxAppsCarousel()
- 5 carousel slides with app data
- Auto-scroll at 4500ms intervals
- Manual navigation arrows
- Dot indicators for navigation
- Link handling with target="_blank"
```

### Phase 2: Update Premium Ad Modal
**File**: `components/premium-ad-leaderboard.tsx`

**Changes**:
- Replace crown emoji with lucide Crown icon
- Add `<ZktxAppsCarousel />` below the "Promote Your Project" section
- Adjust spacing and padding for new carousel
- Maintain existing stats grid

### Phase 3: Create Image Assets
**Location**: `/public/images/`

**Files needed**:
- `zktx-ptb-builder.png` (640x360px)
- `zktx-notary.png` (640x360px)
- `zktx-playmove.png` (640x360px)
- `zktx-sui-extension.png` (640x360px)
- `zktx-docs.png` (640x360px)

### Phase 4: Documentation
**Files**:
- `docs/zktx-carousel.md` - Integration guide
- `docs/advertising-guide.md` - Partner marketing guide with tabs

---

## UI Design Specifications

### Carousel Slide Layout
```
┌─────────────────────────────────┐
│ [App Image 640x360]             │
├─────────────────────────────────┤
│ App Name (Heading)              │
│ "built by zktx_io, check        │
│  linktree https://linktr.ee..." │
│ [Open App →] button             │
└─────────────────────────────────┘
```

### Navigation Elements
- **Left/Right Arrows**: Hidden by default, visible on hover
- **Dot Indicators**: Clickable, bottom-center
- **Auto-Play**: Enabled by default, paused on manual navigation

### Styling
- **Background**: Gradient matching premium card (primary/25 → accent/10)
- **Border**: primary/30 with dark mode adjustments
- **Text**: Responsive sizing (sm on mobile, base on desktop)
- **Buttons**: Blue gradient with accent
- **Spacing**: Consistent with existing premium card padding

### Responsive Breakpoints
- Mobile: Full width, single column
- Tablet (md): Adjusted padding, larger text
- Desktop (lg): Full styling with hover effects

---

## Component Architecture

### ZktxAppsCarousel Component
```
ZktxAppsCarousel
├── State Management
│   ├── currentIndex (useState)
│   ├── isAutoPlay (useState)
│   └── isPaused (useState)
├── Effects
│   ├── Auto-scroll effect (setInterval)
│   └── Cleanup on unmount
├── Handlers
│   ├── goToPrevious()
│   ├── goToNext()
│   └── goToSlide()
└── Render
    ├── Carousel wrapper
    ├── App card (image + info)
    ├── Navigation arrows
    ├── Dot indicators
    └── CTA button (links to app)
```

### Data Structure
```typescript
interface ZktxApp {
  id: 'ptb-builder' | 'notary' | 'playmove' | 'sui-extension' | 'docs'
  name: string
  image: string
  url: string
  description?: string
}
```

---

## File Changes Summary

| File | Change | Type |
|------|--------|------|
| `components/premium-ad-leaderboard.tsx` | Add ZktxAppsCarousel, replace crown emoji | Modify |
| `components/zktx-apps-carousel.tsx` | New carousel component | Create |
| `docs/zktx-carousel.md` | Integration guide | Create |
| `docs/advertising-guide.md` | Partner marketing guide | Create |
| `/public/images/zktx-*.png` | 5 app images | Create |

---

## Testing Checklist

- [ ] Carousel renders all 5 slides correctly
- [ ] Auto-scroll activates at 4-5 second intervals
- [ ] Navigation arrows work (prev/next)
- [ ] Dot indicators are clickable and update
- [ ] Images load without 404 errors
- [ ] App links open in new tab (target="_blank")
- [ ] "built by zktx_io" link opens linktree in new tab
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Theme toggle (dark/light) works correctly
- [ ] Auto-scroll pauses on manual navigation
- [ ] Existing "Promote Your Project" section unchanged
- [ ] No console errors or warnings
- [ ] Crown icon displays correctly (not emoji)

---

## Deployment Checklist

- [ ] All images uploaded to `/public/images/`
- [ ] ZktxAppsCarousel component created and tested
- [ ] premium-ad-leaderboard.tsx updated
- [ ] Documentation files created
- [ ] No breaking changes to existing components
- [ ] Build passes without errors
- [ ] Preview displays correctly
- [ ] All links tested and working
- [ ] Responsive design verified on all breakpoints

---

## Notes

1. **Image Quality**: Use 640x360px (16:9 aspect ratio) for consistent carousel appearance
2. **Auto-Scroll Speed**: 4500ms recommended for balanced effect (fast but readable)
3. **Icon Replacement**: Use `<Crown className="h-5 w-5" />` from lucide-react
4. **Branding**: Footer sentence "built by zktx_io" links to https://linktr.ee/zktx_io
5. **Carousel Library**: Can use simple state-based carousel or Embla (both work)
6. **Dark Mode**: All components auto-adapt via Tailwind dark: prefix classes
