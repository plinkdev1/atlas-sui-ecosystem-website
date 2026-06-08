# ATLAS PROTOCOL - COMPREHENSIVE BUILD PLAN
## Ultra-Detailed Task Specifications for Agent Execution

**Generated:** 2026-03-02
**Repository:** plinkdev1/v0-sui-atlas
**Total Tasks:** ~140 mini-batch tasks across 7 Epics, 9 Phases

---

## TABLE OF CONTENTS

1. [Epic A: Bug Fixes, Layout, Admin, Ads, Design Polish](#epic-a)
2. [Epic B: Homepage About Section 3D Interactive Cards](#epic-b)
3. [Epic C: Logo System Cleanup](#epic-c)
4. [Epic D: Hero 3D Background Enhancement](#epic-d)
5. [Epic E: Design System Extraction Document](#epic-e)
6. [Epic F: Wallet & Authentication System](#epic-f)
7. [Epic G: Airpoints System UI Restoration](#epic-g)
8. [Execution Order (Dependency-Aware Phases)](#execution-order)
9. [Key Files Reference](#key-files-reference)
10. [Supabase Tables Reference](#supabase-tables)
11. [Manual Steps Required](#manual-steps)

---

<a id="epic-a"></a>
## EPIC A: Bug Fixes, Layout, Admin, Ads Systems, Design Polish

---

### A1: Disclaimer Modal - New Design System

**Problem:** `components/risk-disclaimer-modal.tsx` uses old `GlassCard` import + basic `bg-background` styling. Needs full design system upgrade.
**File:** `components/risk-disclaimer-modal.tsx` (167 lines)
**Current imports:** `GlassCard` from `@/components/glass-card`, `AlertCircle` from lucide, `Button`

#### A1.1 - Replace GlassCard wrapper with glass-panel
**What to do:** Remove the `GlassCard` import and component wrapper. Replace with a plain `<div>` using class `glass-panel rounded-2xl border border-[rgba(43,127,255,0.15)]`.
**Find this code (line 94):**
```tsx
<GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
```
**Replace with:**
```tsx
<div className="glass-panel rounded-2xl border border-[rgba(43,127,255,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
```
**Also find the closing tag** (last line before the closing function brace):
```tsx
</GlassCard>
```
**Replace with:**
```tsx
</div>
```
**Also remove the import:**
```tsx
import { GlassCard } from "@/components/glass-card"
```

#### A1.2 - Restyle the header sticky bar
**Find this code (lines 98-101):**
```tsx
<div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center gap-3">
  <AlertCircle className="w-6 h-6 text-yellow-600" />
  <h2 className="text-xl font-bold text-foreground">Risk Disclaimer</h2>
</div>
```
**Replace with:**
```tsx
<div className="sticky top-0 z-10 bg-[#070d1a]/90 backdrop-blur-xl border-b border-[rgba(43,127,255,0.15)] px-6 py-4 flex items-center gap-3">
  <div className="icon-badge"><AlertCircle className="w-5 h-5 text-[#00d4aa]" /></div>
  <h2 className="heading-section !text-lg">Risk Disclaimer</h2>
</div>
```

#### A1.3 - Restyle section headings
**Find all instances of this pattern (6 occurrences):**
```tsx
<h3 className="font-semibold text-foreground">
```
**Replace each with:**
```tsx
<h3 className="font-semibold text-foreground text-sm tracking-wide">
```
**Find all instances of:**
```tsx
<p className="text-muted-foreground">
```
**(in the section bodies) Replace each with:**
```tsx
<p className="text-muted-foreground text-sm leading-relaxed">
```

#### A1.4 - Restyle the warning box
**Find (line 104-107):**
```tsx
<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
  <p className="text-yellow-600 font-semibold">
```
**Replace with:**
```tsx
<div className="glass-panel rounded-xl p-4 border border-[#00d4aa]/30">
  <p className="text-[#00d4aa] font-semibold text-sm">
```

#### A1.5 - Restyle info box and CTA button
**Find the blue info box (near line 155):**
```tsx
<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
  <p className="text-blue-400 text-sm">
```
**Replace with:**
```tsx
<div className="card-modern rounded-xl p-4">
  <p className="text-muted-foreground text-sm">
```
**Find the Accept button (near line 163):**
```tsx
<Button onClick={handleAccept} disabled={isLoading} className="bg-primary hover:bg-primary/90">
```
**Replace with:**
```tsx
<Button onClick={handleAccept} disabled={isLoading} className="button-primary-modern">
```

#### A1.6 - Restyle modal backdrop and add mesh overlay
**Find the outer backdrop div (line 93):**
```tsx
<div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
```
**Replace with:**
```tsx
<div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
```
**Add mesh overlay inside the glass-panel div, as first child:**
```tsx
<div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none rounded-2xl" />
```

---

### A2: Cookie Consent Banner - New Design System

**Problem:** `components/cookie-banner.tsx` uses plain `bg-background/95` without glass design.
**File:** `components/cookie-banner.tsx` (141 lines)

#### A2.1 - Replace container with glass-panel styling
**Find (line 118):**
```tsx
<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm" role="region" aria-label="Cookie preferences">
```
**Replace with:**
```tsx
<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(43,127,255,0.15)] bg-[#070d1a]/95 backdrop-blur-xl" role="region" aria-label="Cookie preferences">
```

#### A2.2 - Restyle heading and body text
**Find:**
```tsx
<h3 className="font-semibold text-foreground mb-2">Cookie & Privacy Settings</h3>
```
**Replace with:**
```tsx
<h3 className="font-semibold text-foreground mb-2 text-sm tracking-wide">Cookie & Privacy Settings</h3>
```

#### A2.3 - Restyle buttons
**Find the Reject button:**
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={handleRejectOptional}
  disabled={isLoading}
  className="whitespace-nowrap bg-transparent"
>
```
**Replace with:**
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={handleRejectOptional}
  disabled={isLoading}
  className="whitespace-nowrap bg-transparent border-[rgba(43,127,255,0.3)] hover:bg-[rgba(43,127,255,0.1)] text-foreground"
>
```
**Find the Accept button:**
```tsx
<Button size="sm" onClick={handleAcceptAll} disabled={isLoading} className="whitespace-nowrap">
```
**Replace with:**
```tsx
<Button size="sm" onClick={handleAcceptAll} disabled={isLoading} className="button-primary-modern whitespace-nowrap !py-2 !px-4 !text-sm">
```

#### A2.4 - Restyle close X button
**Find:**
```tsx
className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-1 text-muted-foreground hover:text-foreground"
```
**Replace with:**
```tsx
className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
```

#### A2.5 - Add top gradient border glow
**After the opening `<div>` of the banner container, add as first child:**
```tsx
<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2B7FFF]/50 to-transparent" />
```

---

### A3: Protocol Pages - Header Overlap / Spacing Fix

**Problem:** All 22 protocol pages have `section-gradient-blue container-modern` as the hero section class, but the `<main>` wrapper from `client-layout.tsx` only adds `pt-16` which is not enough. The hero sections need internal top padding to clear the ~80px fixed header. The "Back to Protocols" link gets hidden behind the header.
**Files:** All 22 files in `app/protocols/*/page.tsx`

**The exact 22 pages (found via grep for "Back to Protocols"):**
1. `app/protocols/dex/page.tsx`
2. `app/protocols/wallets/page.tsx`
3. `app/protocols/bridges/page.tsx`
4. `app/protocols/perps/page.tsx`
5. `app/protocols/lending/page.tsx`
6. `app/protocols/oracles/page.tsx`
7. `app/protocols/liquid-staking/page.tsx`
8. `app/protocols/nft/page.tsx`
9. `app/protocols/gaming/page.tsx`
10. `app/protocols/socialfi/page.tsx`
11. `app/protocols/depin/page.tsx`
12. `app/protocols/ai-agents/page.tsx`
13. `app/protocols/btc-primitives/page.tsx`
14. `app/protocols/rwa/page.tsx`
15. `app/protocols/identity/page.tsx`
16. `app/protocols/launchpads/page.tsx`
17. `app/protocols/storage/page.tsx`
18. `app/protocols/hardware-wallets/page.tsx`
19. `app/protocols/prediction-markets/page.tsx`
(some pages like protocols index may also be affected)

#### A3.1 - Add top padding to all protocol hero sections
**In every protocol page file, find:**
```tsx
<section className="section-gradient-blue container-modern relative overflow-hidden">
```
**Replace with:**
```tsx
<section className="section-gradient-blue container-modern relative overflow-hidden pt-24 md:pt-32">
```
**Apply this to all 22 files.** Use `replace_all` or do each file individually. Every protocol page has exactly this class string as the first `<section>`.

#### A3.2 - Verify wallets page (already has design system, check padding)
**File:** `app/protocols/wallets/page.tsx`
**Wallets page is the reference implementation.** Check if it already has `pt-24` — if yes, match all others to it. If no, add it here too.

#### A3.3 - Verify on mobile
After applying changes, visually confirm on a 375px viewport that the "Back to Protocols" link is fully visible below the mobile header.

---

### A4: Bridges Page White Screen Fix

**Problem:** `app/protocols/bridges/page.tsx` has a DUPLICATE import on lines 5-6 causing a compilation error and white screen.
**File:** `app/protocols/bridges/page.tsx`

#### A4.1 - Remove duplicate import
**Find (lines 5-6, exact content):**
```tsx
import { RevealSection } from "@/components/reveal-section"
import { RevealSection } from "@/components/reveal-section"
```
**Replace with (single import):**
```tsx
import { RevealSection } from "@/components/reveal-section"
```

---

### A5: Admin Password / Login Modal Fix

**Problem:** Admin pages use `validateAdminCredentialsViaAPI()` from `lib/admin-auth.ts` which calls `/api/admin/login`. The login modal either doesn't render or doesn't work properly. The `/admin/advertising/page.tsx` may not have an auth gate at all.
**Files:**
- `lib/admin-auth.ts` (45 lines) — has `validateAdminCredentialsViaAPI`, `getAdminAuthFromStorage`, `setAdminAuthToStorage`
- `app/api/admin/login/route.ts` — POST handler checking `ADMIN_PASSWORD` env var
- `app/api/admin/verify-password/route.ts` — POST handler checking password
- `app/admin/partners/page.tsx` — has login form using these functions
- `app/admin/advertising/page.tsx` — needs auth gate

#### A5.1 - Audit admin-auth.ts functions
**File:** `lib/admin-auth.ts`
**Verify these functions exist and work:**
- `validateAdminCredentialsViaAPI(username, password)` -> calls `/api/admin/login` POST
- `getAdminAuthFromStorage()` -> reads `localStorage.getItem("admin-authenticated")`
- `setAdminAuthToStorage(bool)` -> sets/removes `localStorage.getItem("admin-authenticated")`
**Current code is correct** but depends on env var `ADMIN_PASSWORD` being set on the server.

#### A5.2 - Verify API routes
**File:** `app/api/admin/login/route.ts`
**Ensure the POST handler:**
1. Reads `process.env.ADMIN_PASSWORD`
2. Compares with submitted password
3. Returns `{ success: true }` on match
4. Returns `{ success: false, error: "..." }` on mismatch
**If ADMIN_PASSWORD is not set**, return `{ success: false, error: "Admin password not configured" }` with 500 status.

#### A5.3 - Fix admin partners page login flow
**File:** `app/admin/partners/page.tsx`
**Ensure:**
1. State `isAuthenticated` defaults to `false`
2. On mount, check `getAdminAuthFromStorage()` — if true, skip login
3. Login form is rendered when `!isAuthenticated`
4. On submit, call `validateAdminCredentialsViaAPI(username, password)`
5. On success, call `setAdminAuthToStorage(true)`, set `isAuthenticated = true`
6. Login form uses `card-modern` styling, `button-primary-modern` for submit

#### A5.4 - Add setup modal for when ADMIN_PASSWORD is not set
**File:** `app/admin/partners/page.tsx` (or a shared admin component)
**New behavior:** If login returns `{ error: "Admin password not configured" }`, show a message directing the user to set `ADMIN_PASSWORD` in Vercel env vars. Do NOT allow setting password from the UI (security risk). Show a `card-modern` info card with instructions.

#### A5.5 - Add auth gate to admin advertising page
**File:** `app/admin/advertising/page.tsx`
**Add the same login pattern** as `admin/partners/page.tsx`:
1. Import `{ getAdminAuthFromStorage, setAdminAuthToStorage, validateAdminCredentialsViaAPI }` from `@/lib/admin-auth`
2. Add `isAuthenticated` state
3. Check on mount
4. Render login form if not authenticated
5. Render dashboard content if authenticated

#### A5.6 - Design system for admin login modals
**In both admin login forms, use:**
- Container: `glass-panel rounded-2xl p-8 max-w-md mx-auto`
- Icon: `icon-badge` with `Shield` icon
- Heading: `heading-section !text-xl`
- Input fields: `bg-white/5 border-[rgba(43,127,255,0.2)] rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/30`
- Submit button: `button-primary-modern w-full`
- Error message: `text-red-400 text-sm`

---

### A6: About Page - Header Overlap Fix

**File:** `app/about/page.tsx`
**Problem:** First section uses `section-gradient-blue container-modern` without enough top padding.

#### A6.1 - Add top padding
**Find (line 10):**
```tsx
<section className="section-gradient-blue container-modern relative overflow-hidden">
```
**Replace with:**
```tsx
<section className="section-gradient-blue container-modern relative overflow-hidden pt-24 md:pt-32">
```

---

### A7: RFP Deliverables Page - Header Overlap Fix

**File:** `app/rfp-deliverables/page.tsx`

#### A7.1 - Add top padding
**Find the first `<section>` with `section-gradient-blue` class and add `pt-24 md:pt-32`.**

---

### A8: Subscription Page - Header Overlap Fix

**File:** `app/subscription/page.tsx`

#### A8.1 - Add top padding
**Find the first `<section>` with `section-gradient-blue` class and add `pt-24 md:pt-32`.**

---

### A9: Turbopack Intermittent Errors on Protocol Pages

**Problem:** Brief turbopack error flashes on protocol pages during dev. Typically caused by duplicate imports, unused imports, or type mismatches.

#### A9.1 - Scan all protocol pages for duplicate imports
**Run grep for duplicate `RevealSection` imports across all protocol files** (bridges already confirmed as having one). Check all 22 pages.
**Command pattern:** Search for `import.*RevealSection.*\n.*import.*RevealSection` in each file.

#### A9.2 - Fix any found duplicates
Remove duplicate import lines in any affected files.

#### A9.3 - Check for unused imports
Verify no pages import components they don't use (e.g., `ArrowRight` imported but not used).

---

### A10: Infra-Discovery Provider Tiers - Restore Logic & Paywall

**Problem:** `app/infra-discovery/page.tsx` has basic provider listing but no functional tier cards, no Stripe paywall buttons, no gating logic. `components/infra-discovery-content.tsx` may have the original full implementation.
**Files:** `app/infra-discovery/page.tsx`, `components/infra-discovery-content.tsx`

#### A10.1 - Audit infra-discovery-content.tsx
**File:** `components/infra-discovery-content.tsx`
Read the full file. Check if it contains: tier definitions, Stripe checkout calls, filter logic, provider card component with tier badges.

#### A10.2 - Restore tier pricing cards
**Design:** Three tier cards in a row:
- **Explorer (Free):** Basic listing, category tags, website link. Card: `card-modern rounded-2xl p-8`
- **Verified ($49/mo):** Everything in Free + "Verified" badge, analytics dashboard, priority support. Card: `card-modern rounded-2xl p-8 border-[#00d4aa]/30`
- **Premium ($149/mo):** Everything in Verified + "Premium" badge, featured placement, custom branding, API access. Card: `card-modern-blue rounded-2xl p-8 ring-2 ring-[#2B7FFF]/30`

#### A10.3 - Add Stripe checkout buttons
**For Verified tier button:**
```tsx
<button
  onClick={() => handleStripeCheckout('verified')}
  className="button-primary-modern w-full"
>
  Upgrade to Verified
</button>
```
**For Premium tier button:**
```tsx
<button
  onClick={() => handleStripeCheckout('premium')}
  className="btn-brand-gradient w-full"
>
  Upgrade to Premium
</button>
```
**`handleStripeCheckout` function:**
```tsx
const handleStripeCheckout = async (tier: 'verified' | 'premium') => {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, provider_id: currentProviderId })
  })
  const { url } = await res.json()
  if (url) window.location.href = url
}
```
**Note:** The `/api/stripe/checkout` route needs to exist. If it doesn't, create it in a sub-task.

#### A10.4 - Add tier badges to provider cards
**Badge component per tier:**
```tsx
{tier === 'premium' && <span className="px-2 py-0.5 rounded-full bg-[#2B7FFF]/20 text-[#2B7FFF] text-xs font-medium">Premium</span>}
{tier === 'verified' && <span className="px-2 py-0.5 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium">Verified</span>}
{tier === 'free' && <span className="px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground text-xs font-medium">Explorer</span>}
```

#### A10.5 - Add "Contact Sales" CTA for Premium
```tsx
<a href="mailto:hello@atlasprotocol.space" className="text-sm text-[#2B7FFF] hover:underline">
  Or contact sales for custom plans
</a>
```

#### A10.6 - Restore category filter pills
**Category pills row above provider grid:**
```tsx
const categories = ['All', 'RPC Providers', 'Indexers', 'Oracles', 'Data Analytics', 'Security', 'DevTools']
// Render as horizontal scroll of pills:
<div className="flex gap-2 overflow-x-auto pb-2">
  {categories.map(cat => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={cn(
        "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
        activeCategory === cat
          ? "bg-[#2B7FFF] text-white"
          : "glass-panel text-muted-foreground hover:text-foreground"
      )}
    >
      {cat}
    </button>
  ))}
</div>
```

#### A10.7 - Paywall gating for locked content
**For providers above the free tier, blur locked sections:**
```tsx
{!hasAccess && (
  <div className="relative">
    <div className="blur-sm pointer-events-none">{lockedContent}</div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="glass-panel rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">Upgrade to access</p>
      </div>
    </div>
  </div>
)}
```

#### A10.8 - Apply design system to all components
Ensure all cards use `card-modern`, all sections use `section-gradient-blue` or `section-default container-modern`, all headings use `heading-section`, all body text uses `text-body` or `text-muted-foreground leading-relaxed`.

---

### A11: Sponsored Partners vs Featured Partners - System Separation

**Problem:** The `AdCarousel` component from `components/ad-carousel.tsx` is currently shared between the footer (Featured Partners) and `/partners` page (Sponsored Partners). They should be two completely separate systems with separate data sources.

**Current architecture:**
- `ads_slots` table in Supabase = Footer "Featured Partners" data
- `advertising_partners` table in Supabase = Should be "Sponsored Partners" data
- `components/ad-carousel.tsx` = Currently used for BOTH (wrong)
- `components/ad-management-modal.tsx` = Admin modal for `ads_slots` (Featured)

**Target architecture:**
- **Featured Partners** (footer carousel): `ads_slots` -> `AdCarousel` -> managed via `ad-management-modal.tsx`
- **Sponsored Partners** (/partners page): `advertising_partners` -> NEW `SponsoredCarousel` -> managed via `/admin/sponsored` page

#### A11.1 - Create SponsoredCarousel component
**New file:** `components/sponsored-carousel.tsx`
**Fetches from:** `/api/advertising/partners` (reads `advertising_partners` table)
**Design:** Full-width cards (not the small footer cards). Each card should be:
```tsx
<div className="card-modern-blue rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 min-h-[200px]">
  <div className="flex-shrink-0">
    <img src={partner.logo_url} alt={partner.name} className="w-20 h-20 rounded-2xl object-cover" />
  </div>
  <div className="flex-1 space-y-3 text-center md:text-left">
    <h3 className="heading-section !text-xl">{partner.name}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{partner.tagline}</p>
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {partner.chains?.map(chain => (
        <span key={chain} className="px-2 py-0.5 rounded-full glass-panel text-xs">{chain}</span>
      ))}
    </div>
  </div>
  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="button-primary-modern flex-shrink-0">
    Visit Partner
  </a>
</div>
```
**Carousel controls:** Left/right arrows + dot indicators. Auto-rotate every 6 seconds.
**Size:** The carousel should fill the full section width with generous padding.

#### A11.2 - Replace AdCarousel in partners page with SponsoredCarousel
**File:** `app/partners/page.tsx`
**Find:**
```tsx
import { AdCarousel } from "@/components/ad-carousel"
```
**Replace with:**
```tsx
import { SponsoredCarousel } from "@/components/sponsored-carousel"
```
**Find:**
```tsx
<AdCarousel />
```
**Replace with:**
```tsx
<SponsoredCarousel />
```

#### A11.3 - Keep AdCarousel in footer unchanged
**File:** `components/footer.tsx`
Verify `AdCarousel` is still imported and used. Do NOT change the footer.

#### A11.4 - Create API route for sponsored partners
**New file:** `app/api/advertising/partners/route.ts`
```ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from("advertising_partners")
    .select("*")
    .eq("active", true)
    .order("slot_position", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

#### A11.5 - Label admin pages correctly
**File:** `app/admin/advertising/page.tsx`
Change the page title/heading from "Advertising Management" to "Sponsored Partners Management". This is the admin page for `advertising_partners` table.
**File:** The footer's "Manage Ads" modal (`ad-management-modal.tsx`) should keep its label as "Featured Partners" / "Footer Ads".

---

### A12: Featured Partners Footer Carousel - Design System Update

**Files:** `components/ad-carousel.tsx`, `components/ad-management-modal.tsx`

#### A12.1 - Restyle AdCarousel card
**File:** `components/ad-carousel.tsx`
Find the card container div and replace its classes with `card-modern` styling:
- Card: `card-modern rounded-xl p-4 flex items-center gap-4`
- Image: `rounded-lg`
- CTA button: `button-primary-modern !py-1.5 !px-3 !text-xs`

#### A12.2 - Restyle AdManagementModal
**File:** `components/ad-management-modal.tsx`
- Modal container: Replace any plain `bg-background` with `glass-panel`
- Input fields: Use `bg-white/5 border-[rgba(43,127,255,0.2)] rounded-xl` pattern
- Buttons: Use `button-primary-modern` for save, outline variant for cancel
- Table/list: Use `card-modern` for each ad slot row

#### A12.3 - Add proper section label in footer
In the footer ad section, ensure the label says "Featured Partners" (not "Sponsored").

---

### A13: Create Admin Sponsored Partners CRUD Page

**New file:** `app/admin/sponsored/page.tsx`

#### A13.1 - Create page with admin auth gate
Copy the auth gate pattern from `app/admin/partners/page.tsx`:
```tsx
"use client"
import { useState, useEffect } from "react"
import { getAdminAuthFromStorage, setAdminAuthToStorage, validateAdminCredentialsViaAPI } from "@/lib/admin-auth"
// ... login form pattern from A5.6
```

#### A13.2 - Add partner creation form
Fields: `name` (text), `logo_url` (text/URL), `tagline` (text), `website` (URL), `chains` (multi-select or comma-separated), `badge` (select: Standard/Gold/Diamond), `slot_position` (number), `active` (toggle)
All inputs styled with design system input classes from A5.6.

#### A13.3 - Add partner list table
Display all `advertising_partners` in a table with columns: Logo, Name, Tagline, Active, Position, Actions (Edit/Delete/Toggle).
Style: `card-modern rounded-xl overflow-hidden` for table container.

#### A13.4 - Wire CRUD to Supabase
- **Create:** POST to `/api/advertising/partners` with partner data -> insert to `advertising_partners`
- **Update:** PUT to `/api/advertising/partners/[id]` -> update in `advertising_partners`
- **Delete:** DELETE to `/api/advertising/partners/[id]` -> delete from `advertising_partners`
- **Toggle active:** PATCH to `/api/advertising/partners/[id]/toggle`

#### A13.5 - Add navigation link
Add "Sponsored Partners" link to the admin sidebar/nav in `app/admin/page.tsx`.

---

### A14: Advertising Page Disconnect Fix

#### A14.1 - Verify /advertising route status
**Check:** Does `app/advertising/page.tsx` exist? (It does NOT currently exist based on exploration.)

#### A14.2 - Create redirect
**New file:** `app/advertising/page.tsx`
```tsx
import { redirect } from "next/navigation"
export default function AdvertisingPage() {
  redirect("/partners")
}
```
This redirects old `/advertising` URLs to the new `/partners` page where sponsored partners are shown.

#### A14.3 - Verify data flows
Confirm that `advertising_partners` data from Supabase appears in the new `SponsoredCarousel` on `/partners` page.

---

### A15: Cookie Consent & Disclaimer - Supabase Persistence Fix

**Problem:** Modals reappear on dev server restart because localStorage gets cleared in sandbox, and the Supabase persistence may have issues.
**Tables:**
- `cookie_consents`: columns `id`, `user_identifier`, `analytics_accepted`, `marketing_accepted`, `essential_accepted`, `created_at`, `expires_at`
- `risk_disclaimers`: columns `id`, `user_identifier`, `accepted`, `created_at`

#### A15.1 - Audit /api/cookies/check
**File:** `app/api/cookies/check/route.ts`
**Ensure it:**
1. Reads `id` from query params
2. Queries `cookie_consents` WHERE `user_identifier = id`
3. Checks if `expires_at > now()` (if `expires_at` column exists)
4. Returns `{ hasValidConsent: true/false }`

#### A15.2 - Audit /api/cookies/save
**File:** `app/api/cookies/save/route.ts`
**Ensure it:**
1. Reads body: `{ user_identifier, analytics_accepted, marketing_accepted, essential_accepted }`
2. Upserts to `cookie_consents` with `expires_at = NOW() + interval '20 days'`
3. Uses `ON CONFLICT (user_identifier) DO UPDATE`

#### A15.3 - Audit /api/disclaimers/check
**File:** `app/api/disclaimers/check/route.ts`
**Ensure it:**
1. Reads `id` from query params
2. Queries `risk_disclaimers` WHERE `user_identifier = id AND accepted = true`
3. Returns `{ hasAccepted: true/false }`

#### A15.4 - Audit /api/disclaimers/accept
**File:** `app/api/disclaimers/accept/route.ts`
**Ensure it:**
1. Reads body: `{ user_identifier, accepted }`
2. Upserts to `risk_disclaimers`

#### A15.5 - Fix getOrCreateIdentifier
**In both `cookie-banner.tsx` and `risk-disclaimer-modal.tsx`:**
The `getOrCreateIdentifier()` function uses `crypto.randomUUID()` with a fallback. The issue is that in sandbox environments, localStorage persists within a session but may clear across restarts. The fix: **also set an HTTP-only cookie as a secondary identifier** OR accept that localStorage clearing = modal re-showing (expected behavior for cleared browser data).

**Recommended fix:** Add a server-side cookie approach:
```tsx
// In the check API routes, also look for a cookie-based identifier
const cookieStore = cookies()
const identifierCookie = cookieStore.get('atlas_anon_id')
```
**But this requires using Next.js cookies() in the API route.** This is the most reliable approach.

#### A15.6 - Create migration script if needed
**Check if `expires_at` column exists on `cookie_consents` table.** If not, create script:
```sql
-- scripts/add-expires-at-cookie-consents.sql
ALTER TABLE cookie_consents
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '20 days');
```

#### A15.7 - Create migration script for risk_disclaimers if needed
**Check if the table has proper indexes:**
```sql
-- scripts/fix-risk-disclaimers-index.sql
CREATE INDEX IF NOT EXISTS idx_risk_disclaimers_user_identifier
ON risk_disclaimers (user_identifier);

CREATE INDEX IF NOT EXISTS idx_cookie_consents_user_identifier
ON cookie_consents (user_identifier);
```

#### A15.8 - End-to-end test
1. Clear localStorage
2. Load site -> disclaimer should appear
3. Accept -> refresh -> should NOT reappear
4. Cookie banner should appear after disclaimer dismissed
5. Accept cookies -> refresh -> should NOT reappear

---

### A16: Global Spacing Audit

#### A16.1 - Define consistent pattern
All pages using `section-gradient-blue` as their first section should have `pt-24 md:pt-32` on that section.

#### A16.2 - Audit remaining pages
Check these pages for the same issue:
- `app/protocols/page.tsx` (protocols index)
- `app/settings/page.tsx`
- `app/settings/rpc/page.tsx`
- `app/contact/page.tsx`
- `app/contact/partnership/page.tsx`
- `app/provider-dashboard/page.tsx`

#### A16.3 - Mobile responsive check
Verify `pt-24` (96px) is enough for mobile header (which may be shorter). If mobile header is ~56px, `pt-20` may suffice. Use responsive: `pt-20 md:pt-28`.

---

<a id="epic-b"></a>
## EPIC B: Homepage About Section - 3D Interactive Cards

---

### B1: Build 3D Motion Components from Attachments

**Source files:**
- `user_read_only_context/text_attachments/1-KxtR0.txt` — CSS/HTML for a **rotating cube** effect (cube with 6 faces, CSS 3D transforms, animation)
- `user_read_only_context/text_attachments/2-OuTNt.txt` — CSS/HTML for a **book/page flip** effect (3D card flip animation)
- `user_read_only_context/text_attachments/3-cCBKg.txt` — CSS/HTML for **isometric stacked boxes** (layered 3D boxes with hover)
- `user_read_only_context/text_attachments/4-IyXFL.txt` — CSS/HTML for **tower/block stacking** (animated building blocks)

#### B1.1 - Copy attachment files for reference
Copy all 4 text files to project for easier access during development.

#### B1.2 - Create CuratedEffect component
**New file:** `components/3d-effects/curated-effect.tsx`
- Convert attachment 1 (rotating cube) HTML/CSS to a React client component
- Use CSS modules or inline styles for the 3D transforms
- Adapt colors: replace any default colors with `#00d4aa` (teal) and `#2B7FFF` (blue)
- Component should be self-contained, ~100-150px square, auto-animating
- Add `perspective: 800px` wrapper

#### B1.3 - Create NativeSuiEffect component
**New file:** `components/3d-effects/native-sui-effect.tsx`
- Convert attachment 2 (book/page flip) to React
- Colors: `#4d9fff` primary, `#2B7FFF` secondary

#### B1.4 - Create UserCentricEffect component
**New file:** `components/3d-effects/user-centric-effect.tsx`
- Convert attachment 3 (isometric boxes) to React
- Colors: `#00d4aa` primary

#### B1.5 - Create AlwaysEvolvingEffect component
**New file:** `components/3d-effects/always-evolving-effect.tsx`
- Convert attachment 4 (tower blocks) to React
- Colors: `#4d9fff` primary

---

### B2: Redesign About Section Layout

**File:** `app/page.tsx`, lines 130-165 (the "SECTION 2: WHAT IS ATLAS" section)

**Current layout:** Left side = text + CTA, Right side = 2x2 grid of 4 small glass-panel cards
**New layout:** Full-width section with 4 alternating rows, each row = text card + 3D effect

#### B2.1 - Replace current 2-column grid
**Find (lines 150-163):**
```tsx
<div className="grid grid-cols-2 gap-4">
  {[
    { icon: Shield, title: "Curated", desc: "Verified providers, vetted protocols", color: "#00d4aa" },
    { icon: Rocket, title: "Native on Sui", desc: "Built for performance and scale", color: "#4d9fff" },
    { icon: Zap, title: "User-Centric", desc: "Tools designed for real needs", color: "#00d4aa" },
    { icon: Sparkles, title: "Always Evolving", desc: "New tools every quarter", color: "#4d9fff" },
  ].map((card) => (
    <RevealSection key={card.title} delay={200} className="glass-panel p-5 rounded-xl">
      <card.icon className="h-7 w-7 mb-3 icon-glow" style={{ color: card.color }} />
      <h3 className="font-semibold text-foreground mb-1.5 text-sm">{card.title}</h3>
      <p className="text-xs text-muted-foreground">{card.desc}</p>
    </RevealSection>
  ))}
</div>
```
**Replace with 4 alternating rows (new section below the existing text):**
```tsx
<div className="space-y-16 mt-16">
  {/* Row 1: Text LEFT, 3D RIGHT */}
  <RevealSection delay={100}>
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <Shield className="h-8 w-8 text-[#00d4aa] icon-glow" />
        <h3 className="heading-section !text-xl">Curated</h3>
        <p className="text-muted-foreground leading-relaxed">Verified providers, vetted protocols. Every listing is manually reviewed for quality and legitimacy.</p>
      </div>
      <div className="flex items-center justify-center h-[250px]">
        <CuratedEffect />
      </div>
    </div>
  </RevealSection>

  {/* Row 2: 3D LEFT, Text RIGHT */}
  <RevealSection delay={200}>
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="flex items-center justify-center h-[250px]">
        <NativeSuiEffect />
      </div>
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <Rocket className="h-8 w-8 text-[#4d9fff] icon-glow" />
        <h3 className="heading-section !text-xl">Native on Sui</h3>
        <p className="text-muted-foreground leading-relaxed">Built for performance and scale. Leveraging Sui's parallel execution and object-centric model.</p>
      </div>
    </div>
  </RevealSection>

  {/* Row 3: Text LEFT, 3D RIGHT */}
  <RevealSection delay={300}>
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <Zap className="h-8 w-8 text-[#00d4aa] icon-glow" />
        <h3 className="heading-section !text-xl">User-Centric</h3>
        <p className="text-muted-foreground leading-relaxed">Tools designed for real needs. Every feature is built based on actual user feedback and usage patterns.</p>
      </div>
      <div className="flex items-center justify-center h-[250px]">
        <UserCentricEffect />
      </div>
    </div>
  </RevealSection>

  {/* Row 4: 3D LEFT, Text RIGHT */}
  <RevealSection delay={400}>
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="flex items-center justify-center h-[250px]">
        <AlwaysEvolvingEffect />
      </div>
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <Sparkles className="h-8 w-8 text-[#4d9fff] icon-glow" />
        <h3 className="heading-section !text-xl">Always Evolving</h3>
        <p className="text-muted-foreground leading-relaxed">New tools every quarter. We ship continuously, guided by ecosystem needs and community input.</p>
      </div>
    </div>
  </RevealSection>
</div>
```

#### B2.2 - Add imports for 3D components
**Add at top of `app/page.tsx`:**
```tsx
import { CuratedEffect } from "@/components/3d-effects/curated-effect"
import { NativeSuiEffect } from "@/components/3d-effects/native-sui-effect"
import { UserCentricEffect } from "@/components/3d-effects/user-centric-effect"
import { AlwaysEvolvingEffect } from "@/components/3d-effects/always-evolving-effect"
```

---

<a id="epic-c"></a>
## EPIC C: Logo System Cleanup

---

### C1: Audit & Fix Logo System

#### C1.1 - Check existing logo files
**Run glob for:** `public/**/*.{png,svg,ico,jpg,jpeg,webp}`
List all image files in public directory.

#### C1.2 - Audit branding.ts
**File:** `lib/branding.ts`
Check `logoPath` value. Currently it may point to a non-existent file.

#### C1.3 - Audit header logo usage
**File:** `components/header.tsx`
Check how the logo is referenced. Is it using `getAtlasLogoUrl()` or a hardcoded path?

#### C1.4 - Fix logo path
If logo file doesn't exist at the path referenced in `branding.ts`, either:
- Generate a proper logo image using GenerateImage tool
- Or update `branding.ts` to point to an existing file
- Ensure both header and footer reference the same logo

#### C1.5 - Clean up remnant images
Delete any old/duplicate logo files in public/ that are not referenced anywhere.

#### C1.6 - Verify favicon
Check `public/favicon.ico` exists. If not, create one.

---

<a id="epic-d"></a>
## EPIC D: Hero 3D Background Enhancement

---

### D1: Enlarge & Reposition Hero 3D Element

**File:** `app/page.tsx` (hero section, lines 60-127)
**Current state:** Small `ThreeDCube` component (w-24 h-24) rendered inline in the hero.

#### D1.1 - Identify current 3D placement
**Find the ThreeDCube or sphere-3d container in the hero section** (around lines 87-126).

#### D1.2 - Reposition as background element
**Replace the current small centered placement with:**
```tsx
<div className="absolute right-[-15%] md:right-[-10%] top-[5%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] z-[1] opacity-15 md:opacity-20 pointer-events-none blur-[0.5px]">
  {/* The 3D wireframe sphere */}
  <div className="w-full h-full relative sphere-3d">
    {[400, 360, 300, 240, 180, 120].map((size, i) => (
      <div key={i} className="absolute top-1/2 left-1/2 rounded-full border border-[#00d4aa]" style={{
        width: size, height: size, transform: `translate(-50%, -50%) rotateX(${i * 30}deg)`,
        boxShadow: '0 0 15px rgba(0,212,170,0.15)'
      }} />
    ))}
  </div>
</div>
```

#### D1.3 - Ensure hero text content has higher z-index
All text/buttons/cards in the hero section must have `relative z-10` or higher to stay above the 3D element.

#### D1.4 - Add subtle shadow
The 3D element already has `opacity-15` and `blur-[0.5px]` which creates the "shaded" look. Adjust values if needed after visual testing.

---

<a id="epic-e"></a>
## EPIC E: Design System Extraction Document

---

### E1: Extract Complete Design System

#### E1.1 - Read globals.css completely
**File:** `app/globals.css` (1301 lines)
Read all 1301 lines in chunks. Extract every CSS custom property, every class definition, every keyframe.

#### E1.2 - Read layout.tsx for fonts
**File:** `app/layout.tsx`
Extract font imports (Inter, Space Grotesk, Outfit via next/font/google).

#### E1.3 - Write extraction document
**New file:** `docs/DESIGN_SYSTEM_EXTRACTION.md`
Must include ALL of:
- CSS custom properties (--background, --foreground, --primary, --card, --border etc) for BOTH light and dark themes
- Background gradient definitions (body, dark mode, sections)
- Glass panel styles (.glass-panel, .glass-card, .bento-item, .card-modern, .card-modern-blue)
- Button styles (.btn-brand-gradient, .btn-gradient, .btn-open-app, .button-primary-modern, .button-secondary-modern)
- Animation keyframes (float, shimmer, pulseGlow, marquee, fade-in-up, sphere-rotate)
- Typography classes (.heading-hero, .heading-section, .text-gradient, .text-subtitle, .text-body)
- Layout classes (.section-hero, .section-default, .section-gradient-blue, .container-modern, .bento-grid)
- Component-specific styles (navbar-modern, footer-modern, glass overrides)
- Font families and how applied (--font-sans: Inter, --font-display: Space Grotesk, --font-mono: Outfit)
- Color palette: Deep Navy #070D1A, Electric Blue #2B7FFF, Teal #00D4AA, all variants
- Scrollbar styles, modal styles, wallet modal styles
- Dark mode radial bloom background
- All !important overrides for glass cards
- mesh-bg class definition
- icon-badge, icon-glow classes
- All transition/animation utility classes

---

<a id="epic-f"></a>
## EPIC F: Wallet & Authentication System

---

### F1: Study Technical Scope
#### F1.1 - Locate scope document
Search for `Atlas_Protocol_Technical_Scope` in the project. If not found, use the requirements from this plan document.

### F2: Wallet Provider Setup
**File:** `lib/sui-provider.tsx`
#### F2.1 - Audit provider configuration
Verify `@mysten/dapp-kit` `SuiClientProvider` and `WalletProvider` wrap the app. Check `app/layout.tsx` or `app/client-layout.tsx` for the provider chain.

#### F2.2 - Ensure packages installed
Check `package.json` for: `@mysten/dapp-kit`, `@mysten/sui`, `@mysten/wallet-standard`. If missing, add them.

#### F2.3 - Configure network
Use `NEXT_PUBLIC_SUI_NETWORK` env var (default: `mainnet`).

#### F2.4 - Verify provider in layout
In `app/client-layout.tsx`, ensure `SuiProvider` (or equivalent) wraps children.

### F3: Custom Wallet Modal
**New file:** `components/wallet-modal.tsx`
#### F3.1-F3.6 - Full wallet modal implementation
See plan section F3 in v0_plans for detailed specifications.

### F4: Header Connect Button
**File:** `components/header.tsx`
#### F4.1-F4.4 - Add connect button with states
See plan section F4 in v0_plans.

### F5-F11: See v0_plans detailed specifications
Each sub-task has exact file paths, function signatures, and code patterns documented in the v0_plans file.

---

<a id="epic-g"></a>
## EPIC G: Airpoints System UI Restoration

### G1-G6: See v0_plans detailed specifications
Each sub-task has exact file paths and implementation details.

---

<a id="execution-order"></a>
## EXECUTION ORDER (Dependency-Aware Phases)

### Phase 1: Critical Bug Fixes (~15 tasks)
**No dependencies. Execute first.**
| Task | Description | Files |
|------|-------------|-------|
| A4.1 | Remove duplicate RevealSection import in bridges | `app/protocols/bridges/page.tsx` |
| A3.1 | Add `pt-24 md:pt-32` to ALL 22 protocol page hero sections | `app/protocols/*/page.tsx` |
| A6.1 | Add `pt-24 md:pt-32` to about page hero | `app/about/page.tsx` |
| A7.1 | Add padding to rfp-deliverables hero | `app/rfp-deliverables/page.tsx` |
| A8.1 | Add padding to subscription hero | `app/subscription/page.tsx` |
| A9.1-A9.3 | Scan+fix duplicate/unused imports across protocol pages | all protocol pages |
| A16.1-A16.3 | Audit remaining pages for spacing | various |

### Phase 2: Design System Fixes (~18 tasks)
**No dependencies.**
| Task | Description | Files |
|------|-------------|-------|
| A1.1-A1.6 | Disclaimer modal redesign | `components/risk-disclaimer-modal.tsx` |
| A2.1-A2.5 | Cookie banner redesign | `components/cookie-banner.tsx` |
| A12.1-A12.3 | Featured Partners carousel redesign | `components/ad-carousel.tsx`, `components/ad-management-modal.tsx` |
| E1.1-E1.3 | Design system extraction doc | `docs/DESIGN_SYSTEM_EXTRACTION.md` |

### Phase 3: Persistence & Admin (~14 tasks)
**Depends on: Phase 1**
| Task | Description | Files |
|------|-------------|-------|
| A15.1-A15.8 | Cookie/disclaimer Supabase persistence | API routes + components |
| A5.1-A5.6 | Admin password/login fix | `lib/admin-auth.ts`, admin pages, API routes |

### Phase 4: Advertising Systems (~16 tasks)
**Depends on: Phase 2, Phase 3**
| Task | Description | Files |
|------|-------------|-------|
| A11.1-A11.5 | Sponsored vs Featured separation | New `components/sponsored-carousel.tsx`, API routes |
| A13.1-A13.5 | Admin sponsored page CRUD | New `app/admin/sponsored/page.tsx` |
| A14.1-A14.3 | Advertising redirect | New `app/advertising/page.tsx` |

### Phase 5: Infra Discovery (~8 tasks)
**Depends on: Phase 2**
| Task | Description | Files |
|------|-------------|-------|
| A10.1-A10.8 | Provider tiers + paywall | `app/infra-discovery/page.tsx` |

### Phase 6: Visual Enhancements (~17 tasks)
**Depends on: Phase 2**
| Task | Description | Files |
|------|-------------|-------|
| B1.1-B1.5 | 3D effect components | New `components/3d-effects/*.tsx` |
| B2.1-B2.2 | About section redesign | `app/page.tsx` |
| D1.1-D1.4 | Hero 3D background | `app/page.tsx` |

### Phase 7: Logo System (~6 tasks)
**Independent. Can run anytime.**
| Task | Description | Files |
|------|-------------|-------|
| C1.1-C1.6 | Logo audit and cleanup | `lib/branding.ts`, `components/header.tsx`, `public/` |

### Phase 8: Wallet & Auth (~40 tasks)
**Depends on: Phase 3**
F1 through F11 sub-tasks.

### Phase 9: Airpoints (~15 tasks)
**Depends on: Phase 8**
G1 through G6 sub-tasks.

---

<a id="key-files-reference"></a>
## KEY FILES REFERENCE

| Area | Key Files |
|------|-----------|
| Layout/Header | `app/client-layout.tsx`, `components/header.tsx`, `app/layout.tsx` |
| Disclaimer | `components/risk-disclaimer-modal.tsx` |
| Cookies | `components/cookie-banner.tsx` |
| Protocol Pages | `app/protocols/*/page.tsx` (22 pages) |
| About | `app/about/page.tsx`, `app/page.tsx` (lines 130-165) |
| Infra Discovery | `app/infra-discovery/page.tsx`, `components/infra-discovery-content.tsx` |
| Ads/Featured | `components/ad-carousel.tsx`, `components/ad-management-modal.tsx`, `components/footer.tsx` |
| Sponsored | `app/admin/advertising/page.tsx`, new `app/admin/sponsored/page.tsx` |
| Admin | `app/admin/partners/page.tsx`, `lib/admin-auth.ts`, `app/api/admin/login/route.ts` |
| Wallet | `lib/wallet-store.ts`, `lib/sui-provider.tsx`, new `components/wallet-modal.tsx` |
| Auth | `app/auth/page.tsx`, `components/zklogin-auth.tsx`, `components/passkey-auth.tsx` |
| Airpoints | `components/airpoints-display.tsx`, `hooks/use-airpoints-earn.ts` |
| Design System | `app/globals.css` (1301 lines), `app/layout.tsx` |
| Logo | `lib/branding.ts`, `public/` assets |
| 3D Effects | `components/three-d-loaders.tsx`, new `components/3d-effects/` |

---

<a id="supabase-tables"></a>
## SUPABASE TABLES REFERENCE

| Table | Used By | Key Columns |
|-------|---------|-------------|
| `cookie_consents` | A15 | `user_identifier`, `analytics_accepted`, `marketing_accepted`, `essential_accepted`, `expires_at` |
| `risk_disclaimers` | A15 | `user_identifier`, `accepted`, `created_at` |
| `ads_slots` | A11, A12 | `id`, `title`, `description`, `image_url`, `link_url`, `active`, `position` |
| `advertising_partners` | A11, A13, A14 | `id`, `name`, `logo_url`, `tagline`, `website`, `chains`, `badge`, `slot_position`, `active` |
| `user_profiles` | F6, F9 | `wallet_address`, `role`, `is_pro`, `created_at`, `last_seen` |
| `wallet_users` | F6, F7 | `wallet_address`, `connected_at`, `last_connected_at` |
| `wallet_sessions` | F7 | `wallet_address`, `session_token`, `expires_at` |
| `subscriptions` | F8 | `user_id`, `tier`, `status`, `created_at` |
| `airpoints_balance` | G1-G6 | `wallet_address`, `balance`, `tier_multiplier` |
| `airpoints_history` | G1-G6 | `wallet_address`, `action`, `points`, `created_at` |
| `provider_listings` | A10 | `id`, `name`, `tier`, `category`, `description`, `website` |
| `providers` | A5, A10 | `id`, `name`, `wallet_address`, `tier`, `verified` |

---

<a id="manual-steps"></a>
## MANUAL STEPS REQUIRED

1. **Environment Variables (set in Vercel dashboard or .env.local):**
   - `ADMIN_PASSWORD` — Admin panel access password
   - `PAYMENT_TREASURY` — Sui wallet address for Pro tier payments
   - `STRIPE_SECRET_KEY` — Stripe API key for provider tiers
   - `STRIPE_PUBLISHABLE_KEY` — Stripe public key
   - `NEXT_PUBLIC_SUI_NETWORK` — `mainnet` or `testnet`
   - `NEXT_PUBLIC_SUPABASE_URL` — Already set
   - `SUPABASE_SERVICE_ROLE_KEY` — Already set

2. **Supabase Configuration:**
   - Enable Email OTP auth provider in Supabase dashboard (for /auth page)
   - Verify RLS policies on all tables that wallet-connected users access

3. **Logo Files:**
   - User may need to provide actual Atlas Protocol logo PNG/SVG if not in repo
   - Favicon may need to be provided

4. **Airpoints API:**
   - Need the endpoint URL for the Airpoints master project edge functions
   - Need the API key/auth token for cross-project communication

5. **Testing after each phase:**
   - Phase 1: All pages load without white screens, no header overlap
   - Phase 2: Modals look professional with glass design
   - Phase 3: Modals persist across refreshes, admin login works
   - Phase 4: Two separate carousel systems, both functional
   - Phase 5: Provider tiers display, Stripe buttons work
   - Phase 6: 3D effects animate, hero looks professional
   - Phase 7: Logo shows correctly everywhere
   - Phase 8: Wallet connects, profile created, auth tabs work
   - Phase 9: Airpoints display, promo card visible
