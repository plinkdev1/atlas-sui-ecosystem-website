# Atlas Protocol - Advertising Partners Guide

## Quick Start

**Goal**: Feature your project in Atlas Protocol's premium advertising slot
**Location**: Home page Premium Ad Leaderboard
**Monthly Visitors**: 10,000+
**Display Duration**: 24/7

---

## For End Users

### Discovering Featured Projects

1. **Visit Atlas Protocol home page**
2. **Scroll to "Premium Ad Slot" section** or click "Promote Your Project" CTA
3. **View carousel** of featured applications
4. **Auto-scroll** changes featured app every 4-5 seconds
5. **Click app name or image** to visit project website

### Navigation Options

| Action | Result |
|--------|--------|
| Wait (no interaction) | Auto-scroll to next app |
| Click left chevron | Previous app |
| Click right chevron | Next app |
| Click dot indicator | Jump to specific app |
| Click app link | Open in new browser tab |
| Click "linktree" | Open https://linktr.ee/zktx_io in new tab |

### Platform Support

- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet browsers (iPad Safari, Android Chrome)
- Mobile browsers (iOS Safari, Android Chrome)

---

## For Partners & Projects

### Getting Featured

#### Qualification Criteria
- Active Sui blockchain project or developer tool
- Ecosystem value demonstrated
- Professional branding assets
- Commitment to quality user experience

#### Application Process

1. **Email**: Send inquiry to `partners@atlasprotocol.io`
2. **Subject**: "Featured App Request - [Your Project Name]"
3. **Include**:
   - Project name and website
   - 1-2 sentence description
   - App icon/screenshot (500x400px recommended)
   - Category (Developer Tool / Gaming / Finance / Other)
   - Call-to-action link
   - Target audience description

#### Timeline
- **Application**: Day 0
- **Review**: 3-5 business days
- **Integration**: Up to 1 week
- **Live**: Featured in carousel

### Marketing Benefits

| Metric | Value |
|--------|-------|
| **Monthly Visitors** | 10,000+ |
| **Display Time** | 24/7 |
| **Auto-scroll Cycles** | ~180 per day |
| **Potential Impressions** | 1.8M+ monthly |
| **Premium Placement** | Home page prominent section |
| **Target Audience** | Blockchain builders & infrastructure professionals |

### Example: @zktx_io Carousel

**Current Featured Apps**:
- PTB Builder: Programmable Transaction Builder
- Notary: Transaction Notarization
- PlayMove: Sui Gaming Platform
- Sui VS Extension: Developer Tools
- zktx Docs: Documentation Platform

**Marketing Message**: "Built by zktx_io, check linktree https://linktr.ee/zktx_io"

**Result**: Free ecosystem promotion reaching 10K+ visitors monthly

---

## For Integrators & Developers

### Component Architecture

#### Premium Ad Leaderboard
**File**: `components/premium-ad-leaderboard.tsx`

```typescript
- Renders "Promote Your Project" section
- Renders ZktxAppsCarousel component
- Preserves existing partnership stats
- Maintains admin contact flow
```

#### ZktxAppsCarousel Component
**File**: `components/zktx-apps-carousel.tsx`

**Props**: None (uses internal ZKTX_APPS array)

**Features**:
```
- 5 featured applications
- Auto-scroll every 4 seconds
- Manual navigation (chevrons, dots)
- Responsive design
- Dark mode support
- Opens links in new tabs
```

#### Data Structure

```typescript
interface ZktxApp {
  id: string              // Unique identifier
  name: string            // App display name
  description: string     // 1-2 sentence description
  image: string          // Path to image in /public/images/
  url: string            // External link
}
```

### Adding New Featured Apps

#### Step 1: Prepare Assets
- App name and 1-2 sentence description
- Image file (recommended: 500x400px PNG)
- External URL

#### Step 2: Update Component
Edit `components/zktx-apps-carousel.tsx`:

```typescript
const ZKTX_APPS: ZktxApp[] = [
  // ... existing apps
  {
    id: "your-app-id",
    name: "Your App Name",
    description: "What your app does",
    image: "/images/zktx-your-app.png",
    url: "https://yourapp.com",
  },
]
```

#### Step 3: Add Image
Place image file at: `/public/images/zktx-your-app.png`

#### Step 4: Test
- Verify image loads
- Check carousel navigation
- Test responsive layout
- Confirm external link works

### Carousel Configuration

#### Auto-scroll Interval
**File**: `components/zktx-apps-carousel.tsx`, line ~45

```typescript
const interval = setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % ZKTX_APPS.length)
}, 4000) // 4000ms = 4 seconds
```

**To Change**: Modify `4000` to desired milliseconds

#### Styling Customization
- Color accent: Uses `blue-500` and `blue-600` classes
- Background: Gradient from `blue-500/10` to `blue-500/5`
- Border: `blue-500/20` with hover effect
- Button hover: `blue-700`

### Integration Checklist

- [ ] Component imports are correct
- [ ] Image files exist at `/public/images/`
- [ ] ZktxAppsCarousel component added to premium-ad-leaderboard
- [ ] No breaking changes to existing modal
- [ ] Carousel renders on home page
- [ ] Auto-scroll works
- [ ] Navigation buttons functional
- [ ] Links open in new tabs
- [ ] Responsive on all screen sizes
- [ ] Dark mode styling correct
- [ ] Console has no errors

### Accessibility Features

- Semantic HTML (`button`, `a` elements)
- ARIA labels: `aria-label` on all interactive elements
- Keyboard navigation: Tab and Enter support
- Focus indicators: Visible focus states
- Alt text: Image descriptions via Next.js Image component

### Performance Optimization

- **Image Optimization**: Next.js Image component with priority
- **No Dependencies**: Uses React hooks only
- **Minimal Re-renders**: UseEffect cleanup function
- **CSS Classes**: Tailwind utility classes (no CSS-in-JS)
- **Bundle Size**: ~6KB gzipped

---

## API & Customization

### Theme Integration

The carousel automatically adapts to theme settings:

```css
/* Light mode (default) */
- Border: blue-500/20
- Button: blue-600 → blue-700 on hover
- Text: foreground/muted-foreground

/* Dark mode */
- Border: blue-500/30
- Button: blue-600 → blue-700 on hover
- Text: foreground/muted-foreground
```

### Removing Auto-scroll

If you want manual-only carousel:

```typescript
// In ZktxAppsCarousel.tsx, comment out the interval:
// const interval = setInterval(() => {
//   setCurrentIndex((prev) => (prev + 1) % ZKTX_APPS.length)
// }, 4000)
```

### Custom Styling

Override Tailwind classes in parent component:

```typescript
<div className="[custom-class]">
  <ZktxAppsCarousel />
</div>
```

---

## Troubleshooting

### Issue: Images Not Loading
**Solution**:
1. Check files exist at `/public/images/zktx-*.png`
2. Verify Next.js build completed
3. Clear browser cache
4. Check console for 404 errors

### Issue: Carousel Not Auto-scrolling
**Solution**:
1. Check `isAutoplay` state is true
2. Verify interval is set in useEffect
3. Check if manual navigation was triggered
4. Look for JavaScript errors in console

### Issue: Links Open in Same Tab
**Solution**:
1. Verify `target="_blank"` is present in anchor tags
2. Check `rel="noopener noreferrer"` for security
3. Reload page after code changes

### Issue: Styling Not Applied
**Solution**:
1. Verify Tailwind CSS is compiled
2. Check build output includes new component
3. Test in different browser
4. Inspect element in DevTools

---

## Support & Contact

**Partnership Inquiries**: partners@atlasprotocol.io
**Integration Support**: dev@atlasprotocol.io
**zktx_io Linktree**: https://linktr.ee/zktx_io

---

**Documentation Version**: 1.0
**Last Updated**: February 2026
**Status**: Active - Production Ready
