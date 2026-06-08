# Phase 2.2: Provider Management APIs

Complete guide for provider discovery, dashboard, and management endpoints.

## Authentication

All provider dashboard endpoints require a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Provider Discovery

#### GET /api/providers/search
Search and filter provider listings

**Query Parameters:**
- `category` (string, optional) - Filter by category (RPC, Indexing, Validator, Gateway, Service)
- `search` (string, optional) - Search by name or description
- `featured` (boolean, optional) - Show only featured providers
- `verified` (boolean, optional) - Show only verified providers
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 20) - Results per page

**Response:**
```json
{
  "providers": [
    {
      "id": "uuid",
      "provider_id": "uuid",
      "name": "Provider Name",
      "description": "Description",
      "category": "RPC",
      "pricing_tier": "Premium",
      "website_url": "https://example.com",
      "logo_url": "https://...",
      "features": ["Feature1", "Feature2"],
      "status": "approved",
      "featured": false,
      "verified_at": "2024-01-12T10:00:00Z",
      "created_at": "2024-01-12T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

**Example:**
```bash
curl "http://localhost:3000/api/providers/search?category=RPC&featured=true&page=1&limit=20"
```

---

#### GET /api/providers/[id]/details
Get provider details with uptime, response time, and ratings

**Response:**
```json
{
  "provider": {
    "id": "uuid",
    "name": "Provider Name",
    "description": "Description",
    "logo_url": "https://...",
    "website_url": "https://...",
    "features": ["Feature1", "Feature2"]
  },
  "stats": {
    "uptime": 99.95,
    "responseTime": 145,
    "totalRatings": 42,
    "legitimacyScore": 95.2
  }
}
```

**Example:**
```bash
curl "http://localhost:3000/api/providers/provider-id-123/details"
```

---

#### GET /api/providers/[id]/ratings
Get provider ratings and reviews

**Response:**
```json
{
  "provider": { ... },
  "ratings": [
    {
      "id": "uuid",
      "user_wallet": "0x123...",
      "rating": 1,
      "comment": "Great service!",
      "created_at": "2024-01-12T10:00:00Z"
    }
  ],
  "stats": {
    "totalRatings": 42,
    "legit": 40,
    "scam": 2,
    "legitimacyScore": 95.2
  }
}
```

**Example:**
```bash
curl "http://localhost:3000/api/providers/provider-id-123/ratings"
```

---

#### POST /api/providers/[id]/ratings
Submit a rating for a provider

**Authentication Required:** ✅ Bearer token

**Request Body:**
```json
{
  "asset_address": "provider-id-123",
  "rating": 1,
  "comment": "Excellent uptime and support"
}
```

**Response:**
```json
{
  "id": "uuid",
  "asset_address": "provider-id-123",
  "user_wallet": "0x123...",
  "rating": 1,
  "comment": "Excellent uptime and support",
  "created_at": "2024-01-12T10:00:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/providers/provider-id-123/ratings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_address": "provider-id-123",
    "rating": 1,
    "comment": "Great provider!"
  }'
```

---

### Provider Dashboard

#### GET /api/providers
Get authenticated provider's base information

**Authentication Required:** ✅ Bearer token

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "My Provider",
    "description": "Description",
    "category": "RPC",
    "pricing": "Premium",
    "features": ["Feature1"],
    "website": "https://example.com",
    "logo": "https://...",
    "status": "active",
    "featured": false,
    "created_at": "2024-01-12T10:00:00Z"
  }
]
```

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/providers
```

---

#### POST /api/providers
Create a new provider listing

**Authentication Required:** ✅ Bearer token

**Request Body:**
```json
{
  "name": "My Provider",
  "description": "Full description of services",
  "category": "RPC",
  "pricing_tier": "Premium",
  "website_url": "https://myprovider.com",
  "features": ["High Speed", "99.9% Uptime", "24/7 Support"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "My Provider",
  "description": "Full description",
  "category": "RPC",
  "status": "pending",
  "created_at": "2024-01-12T10:00:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/providers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Provider",
    "description": "Fast RPC provider with 99.9% uptime",
    "category": "RPC",
    "pricing_tier": "Premium",
    "website_url": "https://myprovider.com",
    "features": ["High Speed", "Low Latency"]
  }'
```

---

#### GET /api/providers/my-listings
Get all listings for authenticated provider

**Authentication Required:** ✅ Bearer token

**Response:**
```json
{
  "listings": [
    {
      "id": "uuid",
      "provider_id": "uuid",
      "name": "My RPC Service",
      "description": "Description",
      "category": "RPC",
      "status": "approved",
      "featured": false,
      "verified_at": "2024-01-12T10:00:00Z",
      "created_at": "2024-01-12T10:00:00Z"
    }
  ]
}
```

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/providers/my-listings
```

---

#### GET /api/providers/[id]
Get specific provider details (auth required for own provider)

**Authentication Required:** ✅ Bearer token (for own provider only)

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "My Provider",
  "description": "Description",
  ... other fields
}
```

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/providers/provider-id-123
```

---

#### PATCH /api/providers/[id]
Update provider details

**Authentication Required:** ✅ Bearer token (must be provider owner)

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "pricing": "Enterprise",
  "features": ["Updated Feature 1", "Feature 2"],
  "website": "https://updated-website.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "updated_at": "2024-01-12T11:00:00Z"
  ... updated fields
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/providers/provider-id-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Provider Name",
    "description": "New description with more details"
  }'
```

---

#### DELETE /api/providers/[id]
Delete a provider listing

**Authentication Required:** ✅ Bearer token (must be provider owner)

**Response:**
```json
{
  "success": true
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/providers/provider-id-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### POST /api/providers/[id]/upload-logo
Upload provider logo image

**Authentication Required:** ✅ Bearer token (must be provider owner)

**Request:** Form data with file
- `file` (File) - Image file (PNG, JPG, WebP, etc.)

**Response:**
```json
{
  "logoUrl": "https://blob.vercel-storage.com/provider-logos/...",
  "listing": {
    "id": "uuid",
    "logo_url": "https://blob.vercel-storage.com/...",
    ... other fields
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/providers/provider-id-123/upload-logo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@logo.png"
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not found
- `500` - Server error

---

## Implementation Notes

### Token Refresh

Tokens expire after 24 hours. Users need to re-authenticate via `/api/auth/login` to get a new token.

### Rate Limiting

Provider search endpoints are not rate-limited to allow public discovery. Dashboard endpoints (POST, PATCH, DELETE) are rate-limited to prevent abuse.

### RLS Policies

- **Public can view:** Only `approved` provider listings
- **Providers can manage:** Only their own listings
- **Admins can manage:** All listings and can approve/reject

### Logo Upload

Logos are stored in Vercel Blob storage. Maximum file size: 5MB. Supported formats: PNG, JPG, WebP, GIF.

---

## Testing Checklist

- [ ] Search providers with various filters
- [ ] View provider details and ratings
- [ ] Submit a provider rating
- [ ] Create a new provider listing
- [ ] Update provider information
- [ ] Upload a provider logo
- [ ] Delete a provider listing
- [ ] Verify RLS policies (see own only, public sees approved)
- [ ] Test with expired token (should return 401)
- [ ] Test with wrong provider ID (should return 404)

---

*Last Updated: January 2026*
