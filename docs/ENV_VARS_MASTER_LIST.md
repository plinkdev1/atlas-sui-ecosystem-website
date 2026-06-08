# Atlas Protocol - Complete Environment Variables Reference

## Currently Configured (Already Set)

| Variable | Status | Used By |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | SET | Supabase client/server everywhere |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | SET | Supabase browser client |
| `SUPABASE_SERVICE_ROLE_KEY` | SET | Server-side Supabase (admin ops) |
| `SUPABASE_JWT_SECRET` | SET | JWT token verification |
| `POSTGRES_URL` | SET | Direct Postgres connection |
| `POSTGRES_URL_NON_POOLING` | SET | Migrations/scripts |
| `POSTGRES_PRISMA_URL` | SET | Prisma (unused currently) |
| `POSTGRES_USER` | SET | DB credentials |
| `POSTGRES_PASSWORD` | SET | DB credentials |
| `POSTGRES_DATABASE` | SET | DB credentials |
| `POSTGRES_HOST` | SET | DB credentials |
| `BLOB_READ_WRITE_TOKEN` | SET | Vercel Blob storage |
| `BLOCKBERRY_API_KEY` | SET | Explorer - Blockberry indexer |
| `NEXT_PUBLIC_BLOCKBERRY_API_KEY` | SET | Client-side Blockberry |
| `BLOCKVISION_API_KEY` | SET | Explorer - BlockVision indexer |
| `NEXT_PUBLIC_BLOCKVISION_API_KEY` | SET | Client-side BlockVision |
| `LOGO_DEV_API_KEY` | SET | Token/project logo fetching |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | SET | WalletConnect (disabled, kept for future) |
| `AUTHORIZED_ADMIN_WALLETS` | SET | Admin wallet addresses CSV |
| `PAYMENT_TREASURY` | SET | SUI payment receiving address |
| `SUI_TESTNET_RPC` | SET | Sui testnet RPC endpoint |
| `NEXT_PUBLIC_SUI_NETWORK` | SET | Network selection (testnet/mainnet) |
| `ADMIN_PASSWORD` | SET | Admin dashboard login |
| `ADMIN_USERNAME` | SET | Admin dashboard login |

## Needs to Be Set (Required for Full Functionality)

### Priority 1 - Core Features

| Variable | Required For | How to Get |
|---|---|---|
| `JWT_SECRET` | Auth session signing (passkey, zkLogin) | Generate: `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | Auth callbacks, passkey origin | Your deployed URL e.g. `https://atlas-protocol.vercel.app` |
| `NEXT_PUBLIC_RP_ID` | Passkey Relying Party ID | Your domain e.g. `atlas-protocol.vercel.app` |

### Priority 2 - AI Features (Phase 5)

| Variable | Required For | How to Get |
|---|---|---|
| `OPENAI_API_KEY` | AI Transaction Explainer | https://platform.openai.com/api-keys |

### Priority 3 - Social Auth / zkLogin (Phase 2)

| Variable | Required For | How to Get |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Google zkLogin | https://console.cloud.google.com/apis/credentials |
| `FACEBOOK_CLIENT_ID` | Facebook zkLogin | https://developers.facebook.com/apps |
| `TWITCH_CLIENT_ID` | Twitch zkLogin | https://dev.twitch.tv/console/apps |

### Priority 4 - Payments (Phase 3)

| Variable | Required For | How to Get |
|---|---|---|
| `NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID` | LemonSqueezy checkout | https://app.lemonsqueezy.com |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID` | Pro subscription variant | LemonSqueezy product dashboard |
| `NEXT_PUBLIC_LEMONSQUEEZY_PROPLUS_VARIANT_ID` | Pro+ subscription variant | LemonSqueezy product dashboard |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook verification | LemonSqueezy webhook settings |
| `NEXT_PUBLIC_PAYMENT_TREASURY` | Client-side treasury display | Your SUI wallet address |

### Priority 5 - Swap Aggregator (Phase 5)

| Variable | Required For | How to Get |
|---|---|---|
| `CETUS_PARTNER_ID` | Cetus DEX partner fee share | https://app.cetus.zone/partners |

### Priority 6 - Bridge Hub (Phase 6)

| Variable | Required For | How to Get |
|---|---|---|
| `SQUID_API_KEY` | Squid/Axelar bridge routes | https://docs.squidrouter.com |

### Priority 7 - NFT Marketplace (Phase 7)

| Variable | Required For | How to Get |
|---|---|---|
| `TRADEPORT_API_KEY` | TradePort NFT aggregation | https://tradeport.xyz/developers |

### Priority 8 - Airpoints Edge Function

| Variable | Required For | How to Get |
|---|---|---|
| `NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL` | Airpoints sync | Your Supabase Edge Function URL |

## Optional / Future

| Variable | Required For | How to Get |
|---|---|---|
| `PYTH_API_KEY` | Higher rate limits on Pyth oracle | https://pyth.network |
| `SWITCHBOARD_API_KEY` | Switchboard oracle backup | https://switchboard.xyz |
| `WORMHOLE_RPC_URL` | Wormhole bridge provider | https://docs.wormhole.com |
| `ACROSS_API_KEY` | Across bridge provider | https://across.to |
| `BLUEMOVE_API_KEY` | BlueMove NFT marketplace | https://bluemove.net |
| `SENTRY_DSN` | Error tracking | https://sentry.io |
| `POSTHOG_KEY` | Analytics | Already using posthog-js |

## Quick Setup Commands

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Example .env.local for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_RP_ID=localhost
JWT_SECRET=<generated-hex>
OPENAI_API_KEY=sk-...
```
