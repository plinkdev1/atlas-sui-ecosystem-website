# Usage Tracking Module Documentation

## Overview

The Usage Tracking Module is an infrastructure dashboard feature that provides real-time monitoring of API request quotas, usage patterns, and enforcement mechanisms for Atlas Protocol services. It's designed for infrastructure providers and users to track consumption across different service tiers and manage rate limiting.

**Access Point:** Infra Discovery Portal → "Usage" Tab

**Availability:** Sui networks only (Mainnet, Testnet, Devnet)

**Status:** MVP fully functional with mock data and enterprise-grade configuration examples

---

## Features & Functions

### 1. **Per-Client Quota Dashboard**

The module displays comprehensive usage metrics for each connected client with:

#### Client Information Card
- **Client Name:** Display identifier (e.g., "Production App", "Mobile Client")
- **Client ID:** Unique hex identifier (e.g., `0x1a2b3c...`)
- **Status Badge:** Active, Warning, or Limited status
- **Plan Type:** Service tier (Starter, Growth, Pro, Enterprise)

#### Usage Metrics
- **Usage Percentage:** Visual indicator (0-100%)
- **Requests Used/Limit:** Current requests vs. plan limit (formatted with commas)
- **Color-Coded Progress Bar:**
  - Green: 0-74% (Healthy)
  - Yellow: 75-89% (Warning)
  - Red: 90-100% (Critical)

#### Service Associations
- **Services Used:** List of services consuming quota (RPC, Indexing, Gateway)
- **Last Reset:** Timestamp of last quota period start
- **Next Reset:** When quota resets (typically 30 days)
- **Daily Average:** Estimated daily usage based on current rate

### 2. **Status Indicators**

Three status levels with visual representation:

| Status | Color | Meaning | Action |
|--------|-------|---------|--------|
| **Active** | Green | Under 75% quota | Normal operation, no action needed |
| **Warning** | Yellow | 75-89% quota | Monitor closely; consider upgrading plan |
| **Limited** | Red | 90-100% quota | Rate limiting active; requests may be throttled |

Features:
- CheckCircle2 icon for active status
- AlertCircle icon for warning/limited
- Real-time status updates (mock data)
- Clear visual hierarchy with large text

### 3. **Quota Enforcement Mechanism**

#### NGINX Configuration Example

```nginx
# Rate limiting based on client API key
http {
  limit_req_zone $http_x_api_key zone=client_quota:10m rate=100r/s;
  
  server {
    listen 80;
    
    location /api/ {
      limit_req zone=client_quota burst=500 nodelay;
      proxy_pass http://backend;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    error_page 429 /rate-limit-exceeded.html;
  }
}
```

**How it works:**
1. Client includes API key in request header (`X-API-Key`)
2. NGINX zones group requests per key
3. Rate limit enforced (e.g., 100 requests/sec with 500 request burst)
4. Excess requests receive HTTP 429 (Too Many Requests)
5. Client-side retry logic recommended

#### Envoy Proxy Configuration Example

```yaml
# Envoy rate limiting with local rate limiter
admin:
  access_log_path: /tmp/admin_access.log
  address:
    socket_address:
      address: 0.0.0.0
      port_number: 9901

static_resources:
  listeners:
  - name: listener_0
    address:
      socket_address:
        address: 0.0.0.0
        port_number: 10000
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: ingress_http
          
          # Local rate limiting per API key
          local_reply_config:
            mappers:
            - filter:
                status_code_filter:
                  comparison:
                    op: GE
                    value:
                      default_value: 429
              body_format_override: "Rate limit exceeded. Upgrade your plan."
          
          http_filters:
          - name: envoy.filters.http.local_ratelimit
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.local_ratelimit.v3.LocalRateLimit
              stat_prefix: http_local_rate_limiter
              token_bucket:
                max_tokens: 100000
                tokens_per_fill: 100000
                fill_interval: 1s
              filter_enabled:
                runtime_key: local_rate_limit_enabled
                default_value:
                  numerator: 100
                  denominator: HUNDRED
              filter_enforced:
                runtime_key: local_rate_limit_enforced
                default_value:
                  numerator: 100
                  denominator: HUNDRED
              request_headers_to_add_when_not_enforced:
              - append: false
                header:
                  key: X-Rate-Limited
                  value: "false"
          
          route_config:
            name: local_route
            virtual_hosts:
            - name: backend
              domains: ["*"]
              routes:
              - match:
                  prefix: "/"
                route:
                  cluster: backend_service
```

**Benefits:**
- Load balancer enforces limits
- Client-side enforcement possible
- Protocol-independent (HTTP/gRPC)
- Production-tested in enterprise deployments
- Graceful HTTP 429 handling

### 4. **Mock Client Quotas**

Default mock data includes realistic scenarios:

#### Client 1: Production App
```
Name: Production App
Plan: Pro
Usage: 75% (approaching warning)
Requests: 7.5M / 10M per month
Services: RPC, Indexing, Gateway
Daily Average: 250K requests/day
Last Reset: Nov 27, 2025
Next Reset: Dec 27, 2025
Status: Active
```

#### Client 2: Mobile Client
```
Name: Mobile Client
Plan: Growth
Usage: 45% (healthy)
Requests: 2.25M / 5M per month
Services: RPC, Gateway
Daily Average: 75K requests/day
Last Reset: Nov 27, 2025
Next Reset: Dec 27, 2025
Status: Active
```

#### Client 3: Analytics Service
```
Name: Analytics Service
Plan: Starter
Usage: 95% (critical - limited)
Requests: 950K / 1M per month
Services: Indexing
Daily Average: 32K requests/day
Last Reset: Nov 27, 2025
Next Reset: Dec 27, 2025
Status: Limited (Rate limiting active)
```

#### Client 4: Development/Testing
```
Name: Dev Environment
Plan: Starter (Free tier)
Usage: 25%
Requests: 250K / 1M per month
Services: RPC
Daily Average: 8K requests/day
Last Reset: Nov 27, 2025
Next Reset: Dec 27, 2025
Status: Active
```

### 5. **Sidecar/Proxy Compatibility Notes**

#### Recommended Architectures

**1. Reverse Proxy (NGINX/Envoy) — Most Common**
```
Client → NGINX/Envoy (rate limit + auth) → Atlas Backend → Services
```
- Centralized quota enforcement
- Single point of configuration
- Load balancing included
- Recommended for production

**2. API Gateway (Kong/Tyk) — Feature-Rich**
```
Client → Kong (quota + auth + plugins) → Atlas Backend → Services
```
- Plugin-based rate limiting
- Built-in quota management
- Admin dashboard included
- Great for multi-tenant scenarios

**3. Service Mesh (Istio) — Kubernetes Native**
```
Client → Envoy sidecar (quota) → Atlas Backend → Services
```
- Per-service rate limiting
- Traffic visualization (Kiali)
- Advanced routing and retries
- Zero-trust security

#### Compatibility Matrix

| System | Rate Limiting | Quota Tracking | Admin UI | Ease | Production Ready |
|--------|---------------|----------------|----------|------|-----------------|
| NGINX | ✓ | Manual | No | Easy | ✓ |
| Envoy | ✓ | ✓ | Konga | Medium | ✓ |
| Kong | ✓ | ✓ | Built-in | Medium | ✓ |
| Tyk | ✓ | ✓ | Built-in | Medium | ✓ |
| Istio | ✓ | ✓ | Kiali | Hard | ✓ |

### 6. **Sui-Only Scope Enforcement**

When non-Sui chains are selected:
- Usage tab shows overlay message: "Full functionality on Sui"
- Dashboard content becomes disabled/greyed (opacity reduced)
- Message directs user to switch to Sui mainnet/testnet
- Prevents confusion with multichain selector
- Tooltip explains why feature limited to Sui

---

## Data Structure

### ClientQuota Interface

```typescript
interface ClientQuota {
  clientId: string                  // Unique hex identifier
  clientName: string                // Display name
  plan: "Starter" | "Growth" | "Pro" | "Enterprise"
  status: "active" | "warning" | "limited"
  requestsLimit: number             // Max requests per period
  requestsUsed: number              // Current usage
  usagePercent: number              // Percentage (0-100)
  usagePercent: number              // Percentage (0-100)
  services: string[]                // Services using quota (RPC, Indexing, etc.)
  lastReset: string                 // Last reset date (formatted)
  nextReset: string                 // Next reset date (formatted)
  dailyAverage?: number             // Estimated daily usage
}
```

### Plan Limits

```typescript
const planLimits = {
  Starter: 1_000_000,      // 1M requests/month
  Growth: 5_000_000,       // 5M requests/month
  Pro: 10_000_000,         // 10M requests/month
  Enterprise: "custom"     // Contact sales for custom limits
}
```

### Status Calculation

```typescript
const calculateStatus = (usagePercent: number) => {
  if (usagePercent >= 90) return "limited"
  if (usagePercent >= 75) return "warning"
  return "active"
}

const getProgressColor = (usagePercent: number) => {
  if (usagePercent >= 90) return "bg-red-500"
  if (usagePercent >= 75) return "bg-yellow-500"
  return "bg-green-500"
}
```

---

## How to Use

### **1. Access Usage Dashboard**

1. Navigate to **Infra Discovery Portal** from main menu
2. Look for **"Usage"** tab in the tab bar (full text, not abbreviated)
3. Ensure you're on a **Sui network** (Mainnet/Testnet/Devnet)
4. Dashboard loads with mock client quota cards

### **2. Monitor Client Quotas**

**View All Clients:**
- Dashboard displays grid of client quota cards
- Each card shows usage percentage with color-coded bar
- Status badge indicates health level
- Sorted by plan tier (Pro → Growth → Starter)

**Check Specific Client:**
1. Locate client card in grid (e.g., "Production App")
2. View colored progress bar and percentage
3. Check "Requests Used / Limit" numbers (e.g., "7.5M / 10M")
4. Review associated services (RPC, Indexing, Gateway)
5. Check next reset date

### **3. Understand Status Levels**

- **Green (Active):** Usage 0-74% — Normal operation, no action needed
- **Yellow (Warning):** Usage 75-89% — Monitor closely; upgrade plan soon
- **Red (Limited):** Usage 90-100% — Rate limiting active; requests throttled to burst limits

### **4. Plan Upgrade (Future Feature)**

When approaching quota limits:
1. Check warning status on card
2. Click "Upgrade Plan" button (Future Phase 2)
3. Select higher-tier plan (Growth → Pro)
4. Confirm upgrade
5. New limits apply immediately

### **5. Reset Schedule**

- **Billing Period:** Typically 30 days from first request
- **Last Reset:** Shows when current period started
- **Next Reset:** Shows when quota resets to zero
- **Daily Average:** Estimates your usage rate
- **Overage Handling:** Requests after limit receive HTTP 429 (Too Many Requests)

### **6. Configure Rate Limiting Proxy**

**For NGINX deployments:**

```bash
# 1. Extract API key from client
API_KEY="client_production_key_abc123"

# 2. Add to NGINX config
echo "limit_req_zone \$http_x_api_key zone=quota:10m rate=100r/s;" \
  >> /etc/nginx/nginx.conf

# 3. Add to location block
echo "limit_req zone=quota burst=500 nodelay;" \
  >> /etc/nginx/sites-available/default

# 4. Reload NGINX
sudo nginx -s reload

# 5. Test with ab tool
ab -n 2000 -c 10 -H "X-API-Key: $API_KEY" http://localhost/api/v1/
```

**For Envoy deployments:**

```bash
# 1. Apply Envoy configuration
kubectl apply -f envoy-rate-limit.yaml

# 2. Verify deployment
kubectl get pods -l app=envoy

# 3. Monitor via Kiali dashboard
# Navigate to: http://localhost:20001/kiali

# 4. Check rate limit metrics
kubectl exec -it <envoy-pod> -- curl localhost:9901/stats | grep rate_limit
```

### **7. Handle Rate Limiting**

When client hits rate limit:
- Receives HTTP 429 response
- Response includes `Retry-After` header
- Client should implement exponential backoff
- Upgrade plan to increase limits

---

## Integration Points

### **1. Infra Discovery Services**

Usage data ties to service purchases:

```typescript
// When client purchases RPC service:
- Requests to RPC endpoint count toward RPC quota
- Shown in "Services" column of quota card
- Usage percentage updates in real-time (future)
- Detailed breakdown available in modal (future)
```

### **2. Wallet Connection**

Currently displays mock data. Future integration:

```typescript
// If wallet connected:
const walletAddress = useCurrentWallet()
// Fetch quotas for connected wallet's clients
// Display personal usage dashboard
// Enable in-app quota management
```

### **3. Chain Selection**

Respects multichain selector:

```typescript
const selectedChain = useChainStore((state) => state.selectedChain)
// If non-Sui: show "Full functionality on Sui" message
// If Sui: enable full dashboard with all features
// Filter clients by chain affinity (future)
```

### **4. Admin Notifications (Future)**

```typescript
// Send alerts to users/admins when:
- Usage reaches 75% (warning email)
- Usage reaches 90% (critical alert)
- Usage hits 100% (limited notification)
- Quota resets (confirmation email)
```

---

## Mock Data Reference

### Quota Data Initialization

```typescript
useEffect(() => {
  const mockQuotas: ClientQuota[] = [
    {
      clientId: "0x1a2b3c4d5e6f...",
      clientName: "Production App",
      plan: "Pro",
      status: "active",
      requestsLimit: 10_000_000,
      requestsUsed: 7_500_000,
      usagePercent: 75,
      services: ["RPC", "Indexing", "Gateway"],
      lastReset: "Nov 27, 2025",
      nextReset: "Dec 27, 2025",
      dailyAverage: 250000
    },
    {
      clientId: "0x2b3c4d5e6f7g...",
      clientName: "Mobile Client",
      plan: "Growth",
      status: "active",
      requestsLimit: 5_000_000,
      requestsUsed: 2_250_000,
      usagePercent: 45,
      services: ["RPC", "Gateway"],
      lastReset: "Nov 27, 2025",
      nextReset: "Dec 27, 2025",
      dailyAverage: 75000
    },
    // ... more clients
  ]
  setClientQuotas(mockQuotas)
}, [])
```

### Progress Bar Colors

```typescript
const getProgressColor = (usagePercent: number) => {
  if (usagePercent >= 90) return "bg-red-500"
  if (usagePercent >= 75) return "bg-yellow-500"
  return "bg-green-500"
}
```

---

## Features Roadmap

### Phase 1: Current (MVP) ✓
- [x] Display per-client quotas
- [x] Visual usage bars with color coding
- [x] Status indicators (Active/Warning/Limited)
- [x] NGINX/Envoy documentation and examples
- [x] Mock data initialization
- [x] Sui-only scope enforcement
- [x] Service associations display

### Phase 2: Enhanced (Q1 2026)
- [ ] Real quota data from backend API
- [ ] Upgrade plan functionality with UI
- [ ] Usage alerts (email/SMS/in-app)
- [ ] Historical usage graphs (7/30/90 days)
- [ ] Detailed service breakdown charts
- [ ] Estimated next-period projections
- [ ] API rate limit headers in responses

### Phase 3: Advanced (Q2 2026)
- [ ] Predictive quota warnings (AI-based)
- [ ] Auto-upgrade recommendations
- [ ] Custom rate limit profiles per client
- [ ] Burst allowance controls
- [ ] Geographic rate limiting
- [ ] Time-based quotas (peak vs. off-peak)
- [ ] Webhook notifications

### Phase 4: Enterprise (Q3 2026)
- [ ] Multi-tenant quota pools
- [ ] Shared quotas across teams
- [ ] Granular permission controls
- [ ] Usage-based billing integration
- [ ] Custom SLA management
- [ ] White-label quota dashboard
- [ ] Enterprise analytics

---

## Troubleshooting

### **"Full functionality on Sui" Message Showing**

**Problem:** Can't see quota dashboard
**Solutions:**
1. Switch to a Sui network (Mainnet/Testnet/Devnet)
2. Check chain selector in header (top-left)
3. Verify Sui network connection is active
4. Refresh page (F5 or Cmd+R)
5. Check browser console for network errors

### **Usage Percentages Not Updating**

**Problem:** Mock data looks stale
**Solutions:**
1. This is MVP with mock data — it updates on page refresh
2. Real-time updates coming in Phase 2
3. Check `/docs/USAGE_TRACKING_MODULE.md` for roadmap
4. Mock data resets on component mount

### **Can't Click "Upgrade Plan" Button**

**Problem:** Button is greyed out or non-functional
**Solutions:**
1. This is a future feature (Phase 2)
2. Currently disabled in MVP for planning
3. Will enable after backend integration
4. Check roadmap above for timing

### **NGINX Rate Limiting Not Working**

**Problem:** Limits not enforced; client exceeds quota
**Solutions:**
1. Verify `limit_req_zone` directive in nginx.conf
2. Check `location` block has `limit_req` enabled
3. Reload config: `sudo nginx -s reload`
4. Monitor logs: `tail -f /var/log/nginx/error.log`
5. Test with: `ab -n 1000 -c 10 -H "X-API-Key: key123" http://localhost/api/`
6. Verify client sends correct API key header

### **Envoy Rate Limiting Returns 500 Error**

**Problem:** Rate limiter crashes or returns errors
**Solutions:**
1. Check Envoy config syntax: `envoy -c config.yaml --mode validate`
2. View Envoy logs: `kubectl logs <envoy-pod>`
3. Verify Kiona dashboard accessible: `kubectl port-forward svc/kiali 20001:20001`
4. Check token bucket configuration values
5. Ensure filter is enabled in runtime

---

## Developer Notes

### **File Locations**

```
components/infra-discovery-content.tsx  → Usage tab & dashboard
lib/chain-store.tsx                     → Chain selection context
lib/network-context.tsx                 → Network provider config
```

### **Key Components**

```typescript
// Usage status badge
<Badge className={getStatusColor(quota.status)}>
  {quota.status}
</Badge>

// Progress bar with dynamic color
<div
  className={`h-2 rounded-full ${getProgressColor(quota.usagePercent)}`}
  style={{ width: `${Math.min(quota.usagePercent, 100)}%` }}
/>

// Proxy compatibility code block with syntax highlighting
<pre className="text-xs bg-black rounded p-3 overflow-x-auto font-mono">
  {NGINX_CONFIG_EXAMPLE}
</pre>

// Sui-only overlay
{!isSuiNetwork && (
  <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
    <p className="text-white text-center">Full functionality on Sui</p>
  </div>
)}
```

### **State Management**

```typescript
const [clientQuotas, setClientQuotas] = useState<ClientQuota[]>([])
const { selectedChain } = useChainStore()

useEffect(() => {
  if (selectedChain === "sui") {
    // Initialize mock data
    const mockQuotas = [...]
    setClientQuotas(mockQuotas)
  }
}, [selectedChain])
```

### **Styling Classes**

- `.glass-card` - Glassmorphic container
- `text-muted-foreground` - Secondary text (opacity)
- `bg-green-500/20` - Semi-transparent background colors
- `border-l-4` - Left accent border for hierarchy
- Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

---

## API Reference

### **Functions**

#### `calculateStatus(usagePercent: number): string`
Returns status based on usage percentage

#### `getProgressColor(usagePercent: number): string`
Returns Tailwind color class for progress bar

#### `formatRequestCount(count: number): string`
Formats large numbers with commas (e.g., 7,500,000)

#### `estimateDailyAverage(used: number, resetDate: string): number`
Estimates daily usage based on current consumption

---

## Support & Questions

For issues or questions:
1. Check troubleshooting section above
2. Review proxy configuration examples (NGINX/Envoy)
3. Inspect browser console for errors
4. Check roadmap for planned features and timing
5. Contact development team for backend integration support

---

## References

- [NGINX Rate Limiting Module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [Envoy Rate Limiting Documentation](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/local_ratelimit/v3/local_ratelimit.proto)
- [Kong Rate Limiting Plugin](https://docs.konghq.com/hub/kong-inc/rate-limiting/)
- [Istio Rate Limiting & Quotas](https://istio.io/latest/docs/tasks/policy-enforcement/rate-limit/)
- [HTTP 429 Status Code (Too Many Requests)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- [Sui Testnet Information](https://docs.sui.io/guides/developer/getting-started/connect-to-sui-network)
