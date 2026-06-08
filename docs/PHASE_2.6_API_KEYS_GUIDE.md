# Phase 2.6: API Key Management APIs

## Overview

Complete API key management system for Atlas Protocol, enabling users to generate, manage, and revoke API keys with granular rate limiting and quota tracking.

## Features

- ✅ Secure API key generation with bcrypt hashing
- ✅ Per-key rate limiting and monthly quotas
- ✅ Usage tracking by endpoint
- ✅ Automatic quota resets
- ✅ Soft-delete (revocation) instead of hard delete
- ✅ User isolation via JWT auth and RLS

## Endpoints

### 1. POST /api/keys/generate
Generate a new API key.

**Request:**
```bash
curl -X POST http://localhost:3000/api/keys/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Production Key",
    "rateLimit": 100,
    "monthlyQuota": 1000000
  }'
```

**Response:**
```json
{
  "keyId": "uuid",
  "secretKey": "atlas_xxxxxxxxxxxxxxxxxxxx",
  "name": "My Production Key",
  "createdAt": "2026-01-13T...",
  "expiresAt": "2027-01-13T...",
  "message": "Save this key somewhere safe. You won't be able to see it again."
}
```

### 2. GET /api/keys
List all API keys for the authenticated user.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/keys?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "keys": [
    {
      "id": "uuid",
      "name": "My Production Key",
      "isActive": true,
      "rateLimit": 100,
      "monthlyQuota": 1000000,
      "createdAt": "2026-01-13T...",
      "lastUsedAt": "2026-01-13T...",
      "expiresAt": "2027-01-13T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "hasMore": false
  }
}
```

### 3. PUT /api/keys/:id
Update rate limit and quota for an API key.

**Request:**
```bash
curl -X PUT http://localhost:3000/api/keys/KEY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rateLimit": 200,
    "monthlyQuota": 5000000
  }'
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My Production Key",
  "rateLimit": 200,
  "monthlyQuota": 5000000,
  "isActive": true
}
```

### 4. DELETE /api/keys/:id
Revoke an API key (soft delete).

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/keys/KEY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "revoked": true
}
```

### 5. GET /api/keys/:id/usage
Get detailed usage statistics for an API key.

**Request:**
```bash
curl -X GET http://localhost:3000/api/keys/KEY_ID/usage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "used": 152340,
  "limit": 1000000,
  "remaining": 847660,
  "percentUsed": 15,
  "resetDate": "2026-02-01T00:00:00Z",
  "endpoints": [
    {
      "name": "GET /api/providers",
      "requests": 95000,
      "avgResponseTime": 145
    },
    {
      "name": "POST /api/entitlements/purchase",
      "requests": 57340,
      "avgResponseTime": 523
    }
  ]
}
```

## Implementation Details

### Security
- API keys are hashed with bcrypt before storage
- Plain keys are returned only once at generation
- Keys use soft-delete (marked as `is_active: false`)
- All access is protected by JWT authentication
- RLS policies enforce user isolation

### Quota Management
- Monthly quotas reset on the 1st of each month
- Status automatically updates: `active` → `warning` (90%+) → `limited` (100%+)
- Requests continue to be tracked even when quota is exceeded
- Rate limits are enforced per key at the gateway level

### Usage Tracking
- Every API request logs usage metrics
- Breakdown available by endpoint and method
- Response times and error rates tracked
- Data retained for full month

## Database Tables Used

- `api_keys` - API key storage with hashed values
- `usage_logs` - Request-level usage logs
- `quota_usage` - Monthly quota tracking

## Next Steps

1. Users generate API keys via POST /api/keys/generate
2. Keys are stored securely in `api_keys` table
3. Frontend displays keys via GET /api/keys
4. Rate-limit middleware validates keys on each request
5. Usage is tracked and quotas managed automatically
6. Users can update limits or revoke keys anytime

## Notes

- No manual database work needed - all tables exist with proper RLS
- All endpoints require valid JWT token in Authorization header
- Error responses include descriptive messages for debugging
