# Phase 2.1: Authentication & User Management API Guide

## Overview
Complete backend authentication system with JWT tokens, wallet-based login, user profiles, and session management.

## Environment Variables Required
```
SUPABASE_JWT_SECRET=your-super-secret-key (set this in production!)
```

## API Endpoints

### 1. POST /api/auth/register
Register new user with wallet address

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef",
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "token": "eyJhbGc...",
  "walletAddress": "0x1234567890abcdef",
  "tier": "free",
  "createdAt": "2026-01-13T10:00:00Z"
}
```

### 2. POST /api/auth/login
Authenticate wallet user and return JWT token

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef"
  }'
```

**Response:**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "token": "eyJhbGc...",
  "walletAddress": "0x1234567890abcdef",
  "tier": "free",
  "email": "user@example.com"
}
```

### 3. GET /api/auth/user
Get current authenticated user

**Request:**
```bash
curl http://localhost:3000/api/auth/user \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "walletAddress": "0x1234567890abcdef",
  "email": "user@example.com",
  "tier": "free",
  "theme": "light",
  "network": "testnet",
  "createdAt": "2026-01-13T10:00:00Z"
}
```

### 4. PUT /api/auth/user
Update user profile

**Request:**
```bash
curl -X PUT http://localhost:3000/api/auth/user \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "theme": "dark",
    "network": "mainnet",
    "preferredExplorer": "explorer.sui.io"
  }'
```

**Response:**
```json
{
  "success": true,
  "walletAddress": "0x1234567890abcdef",
  "email": "newemail@example.com",
  "theme": "dark",
  "network": "mainnet"
}
```

### 5. POST /api/auth/logout
Logout current user (invalidate session)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 6. GET /api/auth/profile
Get full user profile with statistics

**Request:**
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "walletAddress": "0x1234567890abcdef",
  "email": "user@example.com",
  "isAdmin": false,
  "theme": "light",
  "network": "testnet",
  "apiKeysCount": 2,
  "activeEntitlements": 1,
  "createdAt": "2026-01-13T10:00:00Z"
}
```

### 7. PUT /api/auth/profile
Update profile settings

**Request:**
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "network": "mainnet",
    "analyticsOptOut": true,
    "walletName": "My Main Wallet"
  }'
```

**Response:**
```json
{
  "success": true,
  "theme": "dark",
  "network": "mainnet",
  "analyticsOptOut": true
}
```

## JWT Token Structure

```
Header: { alg: "HS256", typ: "JWT" }
Payload: {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  walletAddress: "0x1234567890abcdef",
  email: "user@example.com",
  tier: "free",
  iat: 1673000000,
  exp: 1673086400
}
```

## Authentication Flow

### New User Registration
1. User submits wallet address → `/api/auth/register`
2. System creates wallet_user and user_profile records
3. JWT token generated and returned
4. Client stores token locally

### Existing User Login
1. User submits wallet address → `/api/auth/login`
2. System verifies wallet exists
3. JWT token generated and returned
4. Client stores token locally

### Protected API Calls
1. Client includes token in Authorization header: `Authorization: Bearer <token>`
2. Server validates JWT signature and expiry
3. Request proceeds or returns 401 Unauthorized

## Error Responses

### 400 Bad Request
```json
{
  "error": "Wallet address required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Wallet not found. Please register first."
}
```

### 409 Conflict
```json
{
  "error": "Wallet already registered"
}
```

### 500 Internal Server Error
```json
{
  "error": "Registration failed"
}
```

## Best Practices

1. **Token Storage**: Store JWT in httpOnly cookie or secure storage (NOT localStorage for sensitive apps)
2. **Token Refresh**: Implement refresh tokens for long-lived sessions
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **HTTPS Only**: Always use HTTPS in production
5. **Secret Management**: Use environment variables for JWT_SECRET
6. **Token Expiry**: Tokens expire after 24 hours (configurable)

## Testing

### Register new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0xtest123", "email": "test@example.com"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0xtest123"}'
```

### Get user with token
```bash
curl http://localhost:3000/api/auth/user \
  -H "Authorization: Bearer <your-token-here>"
```

## Next Steps

1. Implement refresh token mechanism for extended sessions
2. Add OAuth/Social login support
3. Implement email verification
4. Add 2FA/MFA support
5. Implement token blacklist for logout
6. Add API key management endpoints
7. Implement role-based access control (RBAC)
