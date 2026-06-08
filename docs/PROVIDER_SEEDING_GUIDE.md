# Provider Seeding Guide for Atlas Protocol

## Overview

This guide explains how to seed provider listings into Atlas Protocol's Infra Discovery marketplace. Providers are infrastructure services (RPC nodes, gateways, indexers, validators, services) that users can discover, subscribe to, and manage through Atlas.

## Provider Types & Categories

### 1. RPC Nodes (`category: 'RPC'`)
JSON-RPC/gRPC endpoints for blockchain node access.

**Required Data:**
- Name (e.g., "Shinami", "QuickNode", "Dwellir")
- Description (enterprise-grade RPC, features, SLA)
- Website URL
- Logo URL (optional but recommended)
- Features array: ["gRPC Support", "Gas Station", "99.9% Uptime"]
- Pricing tier: "Free" | "Freemium" | "Premium" | "Custom"
- Verified status (requires admin approval)

**Key Features to Include:**
- gRPC support
- Geographic regions (APAC, US, EU)
- Archive data availability
- Gas station integration
- WebSocket support
- Rate limits

### 2. Gateways (`category: 'Gateway'`)
API gateways that abstract infrastructure complexity.

**Required Data:**
- Name (e.g., "Shinami Gateway", "Blast API", "BlockPI")
- Description (gateway features, developer tools)
- Website URL
- Features: ["Invisible Wallets", "Sponsored Transactions", "Multi-Region"]
- Pricing tier
- SLA guarantees

**Key Features:**
- Wallet services (invisible wallets, sponsored txs)
- Load balancing
- Request routing
- Advanced analytics
- Webhook support

### 3. Indexing Services (`category: 'Indexing'`)
Data indexing and query APIs for blockchain data.

**Required Data:**
- Name (e.g., "Blockberry", "BlockVision", "SubQuery")
- Description (indexing capabilities, data types)
- Website URL
- Features: ["Full Archive", "Real-time Indexing", "GraphQL API"]
- API documentation URL

**Key Features:**
- Archive data depth
- Query types (GraphQL, REST, WebSocket)
- Real-time indexing
- Custom indexing
- Historical data access

### 4. Validators (`category: 'Validator'`)
Network validators for staking operations.

**Required Data:**
- Name (e.g., "Mysten Labs", "Imperator")
- Validator address
- Commission rate (e.g., "2%")
- Uptime percentage
- Staked amount
- APY (Annual Percentage Yield)
- Voting power percentage
- Status: "active" | "inactive" | "jailing"

**Additional Fields:**
- Website
- Social links
- Security practices
- Hardware specifications
- Team information

### 5. Services (`category: 'Service'`)
Additional blockchain services and tools.

**Required Data:**
- Name (service name)
- Description (what the service provides)
- Website URL
- Features array
- Pricing tier

**Examples:**
- Oracle services
- Bridge services
- Analytics platforms
- Developer tools
- Monitoring services

## Database Schema

### providers Table
```sql
CREATE TABLE public.providers (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  company_name text NOT NULL,
  contact_email text,
  wallet_address text,
  pricing_tiers jsonb,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);
```

### provider_listings Table
```sql
CREATE TABLE public.provider_listings (
  id uuid PRIMARY KEY,
  provider_id uuid REFERENCES providers(id),
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('RPC', 'Indexing', 'Validator', 'Gateway', 'Service')),
  pricing_tier text CHECK (pricing_tier IN ('Free', 'Freemium', 'Premium', 'Custom')),
  website_url text,
  logo_url text,
  features jsonb DEFAULT '[]'::jsonb,
  verified_at timestamp with time zone,
  status text DEFAULT 'pending',
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
```

## Seeding Process

### Step 1: Create Provider Account
First, create a provider account in the `providers` table:

```sql
INSERT INTO public.providers (id, company_name, contact_email, wallet_address, status)
VALUES (
  gen_random_uuid(),
  'Shinami',
  'contact@shinami.io',
  '0x...',  -- Optional: Provider's wallet address for payments
  'approved'
);
```

### Step 2: Create Provider Listing
Then create the listing that users will see:

```sql
INSERT INTO public.provider_listings (
  provider_id,
  name,
  description,
  category,
  pricing_tier,
  website_url,
  logo_url,
  features,
  status,
  featured,
  verified_at
)
VALUES (
  (SELECT id FROM public.providers WHERE company_name = 'Shinami'),
  'Shinami RPC',
  'Enterprise-grade JSON-RPC/gRPC with Gas Station integration and 99.9% uptime SLA',
  'RPC',
  'Freemium',
  'https://shinami.io',
  'https://shinami.io/logo.png',
  '["gRPC Support", "Gas Station", "Low Latency", "99.9% Uptime"]'::jsonb,
  'approved',
  true,  -- Featured provider
  now()  -- Verified timestamp
);
```

### Step 3: Set Pricing Tiers (Optional)
Update the provider with pricing tier information:

```sql
UPDATE public.providers
SET pricing_tiers = '{
  "free": {
    "name": "Free",
    "price": 0,
    "requests": 100000,
    "features": ["Basic RPC", "Community Support"]
  },
  "pro": {
    "name": "Pro",
    "price": 49,
    "requests": 10000000,
    "features": ["gRPC", "Priority Support", "99.9% SLA"]
  },
  "enterprise": {
    "name": "Enterprise",
    "price": "Custom",
    "requests": "Unlimited",
    "features": ["Dedicated Nodes", "24/7 Support", "99.99% SLA"]
  }
}'::jsonb
WHERE company_name = 'Shinami';
```

## Partnership Models

### 1. Direct Partners
**Definition:** Infrastructure providers directly integrated with Atlas Protocol.

**Setup:**
- Provider creates account via Provider Dashboard
- Submits listing for approval
- Admin reviews and approves
- Provider marked as `verified_at: now()`
- Can offer exclusive Atlas user discounts

**Revenue Model:**
- Commission-based (10-20% on paid tiers)
- Referral tracking via Atlas
- Monthly payouts to provider wallet

### 2. Commissioned Partners
**Definition:** Providers where Atlas earns commission on referrals.

**Setup:**
- Add provider listing (admin-created)
- Set `status: 'approved'`
- Include affiliate/referral links in website_url
- Track clicks via Atlas analytics

**Revenue Model:**
- Affiliate commission from provider
- No direct billing through Atlas
- Users redirected to provider's site

### 3. Referral Fee Partners
**Definition:** Providers paying flat referral fees for Atlas-sourced users.

**Setup:**
- Standard listing creation
- Custom referral tracking parameter added to URLs
- Monthly reconciliation of signups

**Revenue Model:**
- Flat fee per signup (e.g., $50/user)
- Tracked via UTM parameters
- Billed monthly

### 4. Featured Partners
**Definition:** Premium placement in Infra Discovery marketplace.

**Setup:**
- Set `featured: true` in listing
- Appears at top of category results
- Highlighted with badge

**Revenue Model:**
- Monthly featured placement fee ($500-2000)
- Additional visibility in homepage
- Priority support

## Bulk Seeding Script

Create a script to seed multiple providers at once:

```typescript
// scripts/seed-providers.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

const providers = [
  {
    company: 'Shinami',
    email: 'contact@shinami.io',
    listings: [
      {
        name: 'Shinami RPC',
        description: 'Enterprise-grade JSON-RPC/gRPC with Gas Station',
        category: 'RPC',
        pricing: 'Freemium',
        website: 'https://shinami.io',
        features: ['gRPC Support', 'Gas Station', 'Low Latency', '99.9% Uptime'],
        featured: true,
      },
      {
        name: 'Shinami Gateway',
        description: 'Full node service with invisible wallets and sponsored transactions',
        category: 'Gateway',
        pricing: 'Freemium',
        website: 'https://shinami.io',
        features: ['Invisible Wallets', 'Sponsored Txs', 'Gas Station'],
        featured: true,
      }
    ]
  },
  // ... more providers
]

async function seedProviders() {
  for (const provider of providers) {
    // Create provider
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .insert({
        company_name: provider.company,
        contact_email: provider.email,
        status: 'approved',
      })
      .select()
      .single()

    if (providerError) {
      console.error(`Error creating provider ${provider.company}:`, providerError)
      continue
    }

    // Create listings
    for (const listing of provider.listings) {
      const { error: listingError } = await supabase
        .from('provider_listings')
        .insert({
          provider_id: providerData.id,
          name: listing.name,
          description: listing.description,
          category: listing.category,
          pricing_tier: listing.pricing,
          website_url: listing.website,
          features: listing.features,
          status: 'approved',
          featured: listing.featured,
          verified_at: new Date().toISOString(),
        })

      if (listingError) {
        console.error(`Error creating listing ${listing.name}:`, listingError)
      } else {
        console.log(`✓ Created listing: ${listing.name}`)
      }
    }
  }
}

seedProviders()
```

## Manual Seeding Tasks

### Required Actions:
1. **Gather 50+ Real Providers:**
   - Research RPC providers (15+ providers)
   - Research Gateway providers (10+ providers)
   - Research Indexing providers (10+ providers)
   - Research Validators (10+ providers)
   - Research Services (5+ providers)

2. **Contact Providers:**
   - Reach out to establish partnerships
   - Negotiate commission/referral terms
   - Get official logos and branding
   - Obtain API documentation links

3. **Verify Information:**
   - Test RPC endpoints
   - Verify pricing information
   - Confirm SLA guarantees
   - Check uptime statistics

4. **Create Listings:**
   - Use bulk seeding script OR
   - Manually insert via SQL OR
   - Use Provider Dashboard (when available)

5. **Set Up Tracking:**
   - Add UTM parameters for referral tracking
   - Configure webhook notifications
   - Set up revenue reconciliation

## Provider Verification Checklist

Before marking a provider as verified (`verified_at: now()`):

- [ ] Company information verified
- [ ] Website URL is live and functional
- [ ] Service is actually operational (test endpoints)
- [ ] Pricing information is accurate
- [ ] Contact email is valid
- [ ] SLA commitments are documented
- [ ] Logo/branding provided
- [ ] Terms of partnership agreed upon
- [ ] Referral tracking configured (if applicable)
- [ ] Commission structure documented

## Testing

After seeding providers, test the system:

1. **Marketplace Display:**
   - Visit `/infra-discovery`
   - Verify all 6 tabs show correct data
   - Test search functionality
   - Test filtering by pricing/verification

2. **Provider Details:**
   - Click on provider cards
   - Verify details modal shows correct info
   - Test external links

3. **Export Functionality:**
   - Export registry JSON
   - Verify Airpoints awarded (5 pts)
   - Check JSON structure

4. **Usage Tracking:**
   - Connect wallet
   - View Usage tab
   - Verify personal usage metrics appear

## Next Steps

1. Review the 50+ real providers listed in this guide
2. Prioritize top-tier partners (Shinami, QuickNode, etc.)
3. Reach out to establish partnerships
4. Begin bulk seeding with approved providers
5. Monitor marketplace usage and analytics
6. Iterate on partnership models based on revenue data

## Support

For questions about provider seeding:
- Review the provider dashboard documentation
- Check the API routes: `/api/providers/listings` and `/api/providers/usage`
- Examine the Supabase schema: `provider_listings` and `provider_usage` tables
