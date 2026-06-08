# Phase 2.4: Usage Tracking & Analytics API Guide

## Overview
Real-time usage tracking, quota management, and comprehensive analytics for API consumption monitoring.

## Endpoints

### 1. POST /api/usage/track
Log API request (called by rate-limit middleware on every API call)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "apiKeyHash": "sha256_hash_of_api_key",
  "endpoint": "/api/providers",
  "statusCode": 200,
  "responseTime": 45,
  "requestSizeBytes": 1024,
  "responseSizeBytes": 2048
}
```

**Response:**
```json
{
  "remainingQuota": 999999,
  "resetDate": "2026-02-13T00:00:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/usage/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKeyHash": "abc123xyz",
    "endpoint": "/api/providers",
    "statusCode": 200,
    "responseTime": 45
  }'
```

---

### 2. GET /api/usage/quota
Get current quota status for an API key

**Query Parameters:**
- `api_key_id` (required): UUID of API key

**Request Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "used": 50000,
  "limit": 1000000,
  "remaining": 950000,
  "resetDate": "2026-02-13T00:00:00.000Z",
  "percentageUsed": "5.00",
  "status": "active",
  "daysRemaining": 30
}
```

**Status Values:**
- `active` - Under 90% quota
- `warning` - 90-100% quota used
- `limited` - Over 100% quota (requests may be throttled)

**cURL Example:**
```bash
curl -X GET 'http://localhost:3000/api/usage/quota?api_key_id=123e4567-e89b-12d3-a456-426614174000' \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. GET /api/usage/analytics
Historical usage data with aggregated statistics

**Query Parameters:**
- `api_key_id` (required): UUID of API key
- `period` (optional): `7d`, `30d`, `90d` (default: `7d`)

**Request Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "daily": [
    {
      "date": "2026-01-13",
      "requests": 5000,
      "avgResponseTime": 45,
      "errors": 12
    }
  ],
  "stats": {
    "totalRequests": 50000,
    "avgResponseTime": 48,
    "peakResponseTime": 250,
    "errorRate": "0.24",
    "errorCount": 120,
    "period": "7d",
    "daysBack": 7
  }
}
```

**cURL Example:**
```bash
curl -X GET 'http://localhost:3000/api/usage/analytics?api_key_id=123e4567-e89b-12d3-a456-426614174000&period=30d' \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. GET /api/usage/by-endpoint
Usage breakdown by API endpoint

**Query Parameters:**
- `api_key_id` (required): UUID of API key
- `period` (optional): `7d`, `30d`, `90d` (default: `7d`)

**Request Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "endpoints": [
    {
      "endpoint": "/api/providers",
      "requests": 15000,
      "avgResponseTime": 42,
      "errorCount": 8,
      "errorRate": "0.05"
    },
    {
      "endpoint": "/api/entitlements",
      "requests": 12000,
      "avgResponseTime": 51,
      "errorCount": 5,
      "errorRate": "0.04"
    }
  ],
  "totalEndpoints": 8,
  "totalRequests": 50000,
  "period": "30d"
}
```

**cURL Example:**
```bash
curl -X GET 'http://localhost:3000/api/usage/by-endpoint?api_key_id=123e4567-e89b-12d3-a456-426614174000&period=7d' \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Integration Examples

### Tracking Middleware Integration
Add to your API middleware to automatically log requests:

```typescript
export async function trackUsage(apiKeyHash: string, endpoint: string, statusCode: number, responseTime: number) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usage/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKeyHash,
      endpoint,
      statusCode,
      responseTime
    })
  })
}
```

### Frontend Quota Monitoring
Display quota usage to users:

```typescript
const { data: quota } = await fetch('/api/usage/quota?api_key_id=<API_KEY_ID>', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())

console.log(`Used: ${quota.used}/${quota.limit} (${quota.percentageUsed}%)`)
```

---

## Database Schema

### usage_logs
- `id` (UUID): Primary key
- `api_key_id` (UUID): References api_keys
- `endpoint` (TEXT): API endpoint called
- `method` (VARCHAR): HTTP method
- `status_code` (INT): HTTP response code
- `response_time_ms` (INT): Response duration
- `request_size_bytes` (INT): Request payload size
- `response_size_bytes` (INT): Response payload size
- `ip_address` (INET): Client IP
- `user_agent` (TEXT): Client user agent
- `created_at` (TIMESTAMP): Log timestamp

### quota_usage
- `id` (UUID): Primary key
- `api_key_id` (UUID): References api_keys
- `month` (DATE): Month period
- `requests_used` (INT): Requests consumed
- `requests_limit` (INT): Monthly limit
- `status` (VARCHAR): active|warning|limited
- `updated_at` (TIMESTAMP): Last update

---

## Error Responses

**400 Bad Request:**
```json
{
  "error": "api_key_id required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or missing authentication token"
}
```

**500 Server Error:**
```json
{
  "error": "Failed to fetch quota"
}
```

---

## Quotas & Rates

Quota tiers follow the pricing model:
- **Starter**: 1M requests/month
- **Growth**: 5M requests/month
- **Pro**: 10M requests/month
- **Enterprise**: Custom

Monthly quota resets on the 1st of each month at 00:00 UTC.

---

## No Manual Setup Required
All endpoints use existing Supabase tables with RLS policies. Deploy and ready to use!
