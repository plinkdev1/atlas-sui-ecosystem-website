# Pro Status System Integration Guide

## Quick Start

The Pro status system is now globally available throughout Atlas Protocol. Here's how to use it:

### 1. Add Pro Gating to Features

#### Option A: Simple Lock Icon on Buttons
```tsx
import { useProStatus } from "@/lib/pro-status-context"
import { ProLock } from "@/components/pro-lock"

export function MyButton() {
  const { status } = useProStatus()
  
  return (
    <button>
      Auto-Rules
      {!status.isPro && <ProLock size="sm" tooltip="Auto-Rules requires Pro" />}
    </button>
  )
}
```

#### Option B: Disabled Pro Feature
```tsx
import { ProGate } from "@/components/pro-gate"

export function AdvancedScans() {
  return (
    <ProGate feature="Advanced Scans">
      <YourAdvancedScanComponent />
    </ProGate>
  )
}
```

#### Option C: Pro-Only Content
```tsx
import { ProFeature } from "@/components/pro-gate"
import { useProStatus } from "@/lib/pro-status-context"

export function SpecialStakingRates() {
  const { upgradeToPro } = useProStatus()
  
  return (
    <ProFeature
      tier="pro+"
      message="Unlock Special Staking Rates"
      onUnlock={() => {
        // Open upgrade modal
      }}
    >
      <StakingRatesComponent />
    </ProFeature>
  )
}
```

### 2. Upgrade Button
```tsx
import { ProUpgradeModal } from "@/components/pro-upgrade-modal"
import { Button } from "@/components/ui/button"

export function UpgradeButton() {
  return (
    <ProUpgradeModal
      trigger={<Button>Upgrade to Pro</Button>}
    />
  )
}
```

### 3. Check Pro Status
```tsx
import { useProStatus } from "@/lib/pro-status-context"

export function MyComponent() {
  const { status, upgradeToPro, downgradeToFree } = useProStatus()
  
  if (status.isPro) {
    // Show Pro features
  } else {
    // Show Free features
  }
}
```

## Integration Points

### Wallet Cleanup
- Gate "Auto-Rules" button with ProLock
- Gate "Smart Alerts" with ProGate
- Gate unlimited API calls with ProFeature

### Transaction Explainer  
- Full access for Free tier
- Advanced analysis (Pro)
- Custom rules (Pro+)

### Infra Discovery
- Basic RPC listing (Free)
- Advanced metrics (Pro)
- Custom monitoring (Pro+)

### My Hub
- Add ProSettings component to dashboard
- Show ProBanner for active users
- Add upgrade CTA in appropriate places

## Test Mode

For development/testing:
```tsx
import { useProStatus } from "@/lib/pro-status-context"

export function TestProFeatures() {
  const { upgradeToPro, downgradeToFree } = useProStatus()
  
  return (
    <>
      <button onClick={() => upgradeToPro("pro", 30)}>
        Test Pro (30 days)
      </button>
      <button onClick={() => upgradeToPro("pro+", 30)}>
        Test Pro+ (30 days)
      </button>
      <button onClick={() => downgradeToFree()}>
        Reset to Free
      </button>
    </>
  )
}
```

Pro status is stored in localStorage under "proStatus" key.

## Styling

- **Light mode**: Blue gradient locks and badges
- **Dark mode**: Purple/pink gradient locks
- **Colors**: Blue (#3b82f6) for Pro, Purple (#a855f7) for Pro+
- **Responsive**: All components scale properly

## Files Created

- `/lib/pro-status-context.tsx` - Core context and hook
- `/components/pro-lock.tsx` - Lock icons and badges
- `/components/pro-gate.tsx` - Gating components (ProGate, ProFeature, ProButton, ProBanner)
- `/components/pro-upgrade-modal.tsx` - Upgrade modal with pricing
- `/components/pro-settings.tsx` - Settings component for My Hub
- `/app/layout.tsx` - Updated with ProProvider wrapper

## Next Steps

1. ✅ Pro status system is active
2. Apply ProGate/ProLock to key features in:
   - Wallet Cleanup (auto-rules, alerts)
   - Transaction Explainer (advanced features)
   - Infra Discovery (advanced metrics)
   - My Hub (add ProSettings)
3. Integrate upgrade flow into CTAs
4. Test with `upgradeToPro()` in localStorage
