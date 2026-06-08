# Admin Partners System Documentation

## Overview

The Admin Partners System is a development-mode accessible dashboard for managing ecosystem partners and advertising placements in the Atlas Protocol. It's designed as a stub for future CMS integration while providing immediate utilities for managing partner data.

**Access Point:** `/admin/partners` (Development mode only)

**Status:** MVP fully functional with 8+ real partners integrated

---

## Features & Functions

### 1. **Admin Access Control**

The page implements development-mode authentication:

```typescript
const checkAdmin = () => {
  if (process.env.NODE_ENV === "development") {
    setIsAdmin(true)
  }
}
```

- Only accessible when `NODE_ENV === "development"`
- Production deployments will show "Admin Access Required" message
- Future enhancement: Add real authentication (session/token-based)

### 2. **JSON Export & Copy Utilities**

#### Copy JSON to Clipboard
- **Function:** `handleCopyJSON()`
- **Action:** Copies formatted partner data to clipboard as JSON
- **Use Case:** Quick sharing of partner data with developers or backend teams
- **Output Format:** Prettified JSON with 2-space indentation

#### Export JSON File
- **Function:** `handleExportJSON()`
- **Action:** Triggers download of `partners-data.json` file
- **Use Case:** Backup, version control, or migration to backend systems
- **Benefits:** Machine-readable format for database imports

### 3. **Partners Data Table**

Displays all partners in a comprehensive table with columns:

| Column | Content | Purpose |
|--------|---------|---------|
| **Partner** | Name + Tagline | Identity & quick description |
| **Website** | Clickable URL | Direct link to partner |
| **Chains** | Chain badges | Supported networks (Sui, Aptos, etc.) |
| **Badge** | Verification status | Verified Partner, Sui Foundation Grantee, Official Infra |
| **Actions** | Delete button | Future: Edit/delete functionality |

Features:
- Hover effects for better UX
- Color-coded chain badges (purple/blue theme)
- Responsive layout on mobile
- Pre-filtered based on development data

### 4. **JSON Data Preview**

- **View:** Read-only scrollable JSON preview
- **Max Height:** 400px with overflow scrolling
- **Format:** Syntax-highlighted monospace font
- **Purpose:** Quick verification of data structure before export

### 5. **Quick Action Buttons**

Three primary action buttons with contextual styling:

| Button | Icon | Color | Function |
|--------|------|-------|----------|
| Copy JSON | Copy | Purple | `handleCopyJSON()` |
| Export JSON | Download | Blue | `handleExportJSON()` |
| Add Partner | Plus | Green | Placeholder (Future) |

---

## Data Structure

### Partner Interface

```typescript
interface Partner {
  id: string                          // Unique identifier
  name: string                        // Display name
  tagline: string                     // One-line description
  logo: string                        // URL to logo image
  website: string                     // Partner website URL
  badge?: "Verified Partner" | "Sui Foundation Grantee" | "Official Infra"
  chains: ("Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad")[]
  featured?: boolean                  // Featured in ecosystem display
  adType: "leaderboard" | "rectangle" | "hero"  // Ad placement type
}
```

### Current Partners (MVP - 8 Featured)

```
1. Blockberry - Verified Partner - Sui, Aptos
   Provider: SuiScan backend, comprehensive metadata API
   
2. Blockvision - Official Infra - Sui
   Provider: SuiVision backend, indexing API for NFTs/coins
   
3. Shinami - Verified Partner - Sui
   Provider: Node service, Gas Station, Wallet Services
   
4. Mysten Labs - Official Infra - Sui
   Provider: Official Sui infrastructure, general-purpose indexer
   
5. OKX Wallet - Sui, Aptos, Ethereum, Mina
   Provider: Multi-chain wallet, secure asset management
   
6. Nightly Wallet - Sui, Aptos, Ethereum
   Provider: Community wallet, developer-friendly SDKs
   
7. Aptos Labs - Aptos
   Provider: Aptos ecosystem lead, multichain relevance
   
8. Suiet - Verified Partner - Sui
   Provider: Sui-native wallet, community-focused
```

---

## How to Use

### **1. Access the Admin Panel**

```bash
# In development environment
npm run dev
# Navigate to: http://localhost:3000/admin/partners
```

### **2. View Current Partners**

- The page loads all partners from `lib/partners-data.ts`
- Displayed in both table and JSON preview formats
- No configuration needed—data is pre-loaded
- All partners shown with verification badges and chain support

### **3. Export Partner Data**

**Option A: Copy to Clipboard**
1. Click "Copy JSON" button
2. Paste into any text editor or database tool
3. Useful for quick sharing with backend teams

**Option B: Download File**
1. Click "Export JSON" button
2. Browser downloads `partners-data.json`
3. Save to version control or import to backend

### **4. Add New Partners (Manual Process)**

Current workflow (MVP):
1. Edit `lib/partners-data.ts`
2. Add new entry to `PARTNERS` array
3. Follow the Partner interface structure
4. Redeploy or hot-reload

**Future workflow (with CMS):**
- Use "Add Partner" form on this page
- Data persists to database
- Real-time updates without code changes
- Automatic invalidation of partner caches

### **5. Edit Partner Data**

**For MVP:** Edit directly in `lib/partners-data.ts`

**Future CMS integration:**
- Click edit icon in table
- Modify fields in modal
- Save changes (auto-persisted to database)
- Automatic sync to all display locations

---

## Integration Points

### **1. Home Page Ecosystem Partners Section**

The admin data feeds into the public `EcosystemPartnersSection` component:

```typescript
import { PARTNERS } from "@/lib/partners-data"

// In components/ecosystem-partners-section.tsx
const featured = getFeaturedPartners()
```

**Changes here affect:**
- Home page partner cards (featured row)
- Hero banner with top picks
- 'Become a Partner' CTA card
- All public-facing partner displays

### **2. Infra Discovery Module Display**

Partners appearing in "Services" tab with multiple category badges:

```typescript
// Shows in All Services tab with category badges
// Example: Shinami appears as both "RPC Node" and "Gateway"
```

### **3. Multichain Filtering**

Uses helper function:

```typescript
const getPartnersByChain = (chain: string) => {
  return PARTNERS.filter((p) => p.chains.includes(chain as any))
}
```

**Use:** Filter partners based on selected chain in UI

### **4. Featured Partner Logic**

```typescript
const getFeaturedPartners = () => {
  return PARTNERS.filter((p) => p.featured)
}
```

**Use:** Display priority partners in hero section and top picks

---

## Recent Enhancements (as of Dec 2025)

### Ecosystem Partners Section
- Premium, non-intrusive advertising system
- Phantom Wallet-inspired design with glassmorphic cards
- Purple/cyan glow borders and subtle animations
- Hero section with featured partners
- Grid layout (responsive: 2-4 columns desktop, 1 mobile)
- "Become a Partner" CTA card for future integrations

### Infra Service Discovery Integration
- Partners appear in "All Services" unified directory
- Display with category badges (Validator, RPC Node, Gateway, Indexing)
- Search and filter across all services
- 50+ total infrastructure providers curated

### Multichain Support
- Each partner tagged with supported chains
- "Verified by Sui Foundation" badges for top providers
- Graceful non-Sui messaging on multichain selector

---

## Future Enhancements

### Phase 2: Backend Integration
- [ ] Replace hardcoded data with database queries
- [ ] Add authentication layer (role-based access)
- [ ] Implement partner approval workflow
- [ ] Add audit trail for changes
- [ ] Real-time partner form with validation

### Phase 3: Advanced Admin Features
- [ ] Logo upload/CDN integration
- [ ] A/B testing for ad placements
- [ ] Performance metrics (clicks, impressions, CTR)
- [ ] Partner analytics dashboard
- [ ] Bulk import/export tools
- [ ] Partner tier management (Gold, Silver, Bronze)

### Phase 4: CMS Integration
- [ ] Headless CMS (Sanity, Contentful, or Strapi)
- [ ] Webhook triggers for deployments
- [ ] Visual partner card editor
- [ ] Multi-language support
- [ ] Version history & rollback
- [ ] Draft/publish workflow

---

## Troubleshooting

### **"Admin Access Required" Message**

**Problem:** Page shows admin access message
**Solutions:**
1. Ensure `NODE_ENV` is set to `"development"`
2. Check `.env` file configuration
3. Restart dev server: `npm run dev`
4. Verify not in production build

### **JSON Export Not Working**

**Problem:** Export button doesn't download file
**Solutions:**
1. Check browser console for errors
2. Ensure pop-ups aren't blocked
3. Verify file permissions in browser settings
4. Try "Copy JSON" instead
5. Check browser download settings

### **Partners Not Appearing in Public Site**

**Problem:** Added partners to admin but don't see them on home page
**Solutions:**
1. Verify `featured: true` in partner data
2. Check chain filtering logic
3. Clear browser cache (Ctrl+Shift+Delete)
4. Redeploy application
5. Check infra-discovery component for service tab inclusion

---

## Developer Notes

### **File Locations**

```
lib/partners-data.ts                      → Partner data definitions
app/admin/partners/page.tsx               → Admin dashboard
components/ecosystem-partners-section.tsx → Home page display
components/infra-discovery-content.tsx    → Services tab integration
```

### **Key Dependencies**

```typescript
import { Copy, Plus, Trash2 } from "lucide-react"  // Icons
import { PARTNERS } from "@/lib/partners-data"     // Data
import { useChainStore } from "@/lib/chain-store"  // Multichain context
```

### **State Management**

Currently uses React `useState()`. Future: Replace with Zustand or Context API for complex scenarios.

### **Styling**

Uses Tailwind CSS with custom utilities:
- `.glass-card` - Glassmorphic effect
- `.text-muted-foreground` - Secondary text color
- `bg-purple-600/40` - Semi-transparent colors
- Responsive prefixes: `sm:`, `md:`, `lg:`

---

## API Reference

### **Functions**

#### `handleCopyJSON()`
Copies partners array as formatted JSON to clipboard

#### `handleExportJSON()`
Downloads partners data as JSON file

#### `getPartnersByChain(chain: string): Partner[]`
Returns partners supporting specified chain

#### `getFeaturedPartners(): Partner[]`
Returns all partners marked as featured

#### `getPartnersByCategory(category: string): Partner[]`
Returns partners in specified category (RPC, Indexing, etc.)

---

## Support & Questions

For issues or questions:
1. Check troubleshooting section above
2. Review `/docs/ADMIN_PARTNERS_SYSTEM.md`
3. Inspect browser console for errors
4. Contact development team for backend integration queries
