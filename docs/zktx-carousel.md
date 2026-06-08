# Atlas Protocol - Advertising Guide

## Overview

The Atlas Protocol home page features a premium advertising system with two distinct advertising slots designed to maximize visibility for partner projects and ecosystem builders on Sui.

## Advertising System Components

### 1. Premium Ad Leaderboard Modal
**Location**: Home page, accessible via prominent CTA
**Type**: Permanent branded section
**Features**:
- "Promote Your Project" call-to-action section
- Featured projects carousel (6 rotating carousels total)
- Partnership statistics (10K+ monthly visitors, 50+ partner projects, 24/7 display)
- Contact mechanism for reservation inquiries

### 2. Featured Projects Carousel
**Component**: `ZktxAppsCarousel`
**Location**: Inside Premium Ad Leaderboard Modal
**Type**: Auto-scrolling carousel
**Scroll Speed**: 4-5 seconds per slide
**Total Slides**: 5 featured applications

## @zktx_io Featured Carousel

### Overview
The @zktx_io showcase carousel highlights innovative applications built on Sui blockchain, promoting the zktx_io ecosystem to thousands of platform visitors.

### Featured Applications

| App | Link | Description |
|-----|------|-------------|
| **PTB Builder** | https://ptb.wal.app/ | Programmable Transaction Builder for Sui |
| **Notary** | https://notary.wal.app/ | Secure transaction notarization |
| **PlayMove** | https://playmove.wal.app/ | Gaming platform on Sui |
| **Sui VS Extension** | https://marketplace.visualstudio.com/items?itemName=zktxio.sui-extension | Visual Studio development tools |
| **zktx Docs** | https://docs.zktx.io/ | Comprehensive documentation |

### Carousel Features

- **Auto-scroll**: Advances to next slide every 4-5 seconds
- **Navigation**: Chevron buttons for manual browsing
- **Indicators**: Dot pagination with click-to-jump
- **Responsive**: Fully mobile and desktop optimized
- **Images**: 5 app showcase images at `/public/images/zktx-*.png`

### Footer Attribution

All carousel slides include consistent footer branding:
```
"Built by zktx_io, check linktree https://linktr.ee/zktx_io"
```

**Both text and linktree link are clickable**, opening in new browser tabs.

### User Experience Flow

1. **User visits home page** → Premium Ad Leaderboard visible
2. **Auto-scroll begins** → Carousel transitions every 4-5 seconds
3. **User can manually navigate**:
   - Click chevrons (left/right)
   - Click dot indicators
   - Any manual interaction pauses auto-scroll
4. **User clicks app** → Opens external app URL in new tab
5. **User clicks linktree** → Opens https://linktr.ee/zktx_io in new tab

## Integration Architecture

### Component Files
```
components/
├── premium-ad-leaderboard.tsx      (Main container, 87 lines)
└── zktx-apps-carousel.tsx          (Carousel component, 182 lines)
```

### Assets
```
public/images/
├── zktx-ptb-builder.png
├── zktx-notary.png
├── zktx-playmove.png
├── zktx-sui-extension.png
└── zktx-docs.png
```

### Styling
- **Framework**: Tailwind CSS
- **Color Scheme**: Blue accents (primary color)
- **Responsive**: Mobile-first design
- **Dark Mode**: Full support

## Marketing Rationale

### Why Free Marketing Slot?

1. **Ecosystem Growth**: Showcasing quality projects strengthens Sui ecosystem visibility
2. **Partner Value**: zktx_io tools are core infrastructure for Atlas Protocol users
3. **User Benefit**: Developers discover valuable dev tools directly
4. **Traffic**: 10K+ monthly visitors see featured apps
5. **Reciprocal**: zktx_io apps link back to Atlas Protocol

### Visibility Metrics

- **Monthly Visitors**: 10,000+
- **Display Duration**: 24/7 rotation
- **Click-through Potential**: High (verified partner links)
- **Premium Placement**: Prominent modal position on home page

## Technical Implementation

### ZktxAppsCarousel Component

```typescript
- 5 hardcoded ZKTX_APPS (no database needed)
- Auto-scroll via useEffect interval
- State-based carousel (no external dependencies)
- Image optimization with Next.js Image component
- Keyboard and mouse navigation support
```

### Premium Ad Leaderboard Integration

```typescript
- Imports ZktxAppsCarousel component
- Renders carousel in "Featured Projects" section
- Maintains existing "Promote Your Project" CTA
- Responsive layout (full-width on mobile, split on desktop)
- Dark mode compatible
```

### Icon Update

- **Previous**: Crown emoji (👑)
- **Current**: Lucide `Crown` icon (clean, SVG-based)
- **Benefits**: Scalable, theme-compatible, professional appearance

## Admin Management

### For Partners

**Reserve Your Slot**: Contact `partners@atlasprotocol.io`

The "Reserve Your Slot" button in the Premium Ad Leaderboard opens an email client pre-addressed to the partnerships team.

### For Administrators

**Updating Featured Apps**: Modify the `ZKTX_APPS` array in `components/zktx-apps-carousel.tsx`:

```typescript
const ZKTX_APPS: ZktxApp[] = [
  {
    id: "app-id",
    name: "App Name",
    description: "Brief description",
    image: "/images/zktx-app-name.png",
    url: "https://app.example.com",
  },
  // ... more apps
]
```

**Updating Scroll Speed**: Change interval in `ZktxAppsCarousel.tsx`:

```typescript
setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % ZKTX_APPS.length)
}, 4000) // Change 4000ms to desired duration
```

## Testing Checklist

- [x] Carousel displays all 5 apps correctly
- [x] Images load without errors
- [x] Auto-scroll activates after 4-5 seconds
- [x] Navigation chevrons advance/retreat slides
- [x] Dot indicators work and show current position
- [x] Manual navigation stops auto-scroll
- [x] App links open in new browser tabs
- [x] Linktree links open correctly
- [x] Responsive on mobile/tablet/desktop
- [x] Dark mode styling applies correctly
- [x] Crown icon renders cleanly (not emoji)
- [x] "Promote Your Project" section unchanged
- [x] All zktx images load properly

## Future Enhancements

Potential additions (without disrupting current implementation):

1. **Additional Carousels**: Add different app categories
2. **Marketplace Integration**: Connect to admin panel for carousel management
3. **Analytics**: Track carousel interactions and link clicks
4. **A/B Testing**: Compare different featured app rotations
5. **User Testimonials**: Add carousel for partner feedback

## Troubleshooting

### Images Not Loading
- Check `/public/images/zktx-*.png` files exist
- Verify Next.js Image component path is correct
- Clear browser cache and rebuild

### Carousel Not Auto-scrolling
- Check `isAutoplay` state is true initially
- Verify interval is set in useEffect
- Check browser console for JavaScript errors

### Styling Issues
- Verify Tailwind CSS is compiled
- Check dark mode preference in system settings
- Inspect element styling in browser DevTools

## Contact

**For Partnership Inquiries**: partners@atlasprotocol.io
**@zktx_io Linktree**: https://linktr.ee/zktx_io

---

**Last Updated**: February 2026
**Status**: Active
**Carousel Status**: Live with 5 featured apps
