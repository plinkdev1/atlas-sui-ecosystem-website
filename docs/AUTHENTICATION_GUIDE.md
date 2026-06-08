# Atlas Protocol - Authentication & Authorization Guide

## Overview

Atlas Protocol implements a **dual authentication system** designed to serve two distinct user types:
- **Normal Users** (End users accessing tools)
- **Providers/Partners/Admin** (Infrastructure providers and administrators)

## Authentication Methods

### For Normal Users (Role: `user`)

Normal users have **4 authentication options**, accessible from the main wallet connection modal:

#### 1. Wallet Connection (Native)
- **What**: Direct connection using browser wallet extensions
- **Supported Wallets**: Sui Wallet, OKX, Ethos, Suiet, Phantom, and 100+ via WalletConnect
- **Access**: Click "Connect" button in header → Select wallet
- **Role**: Automatically assigned `user` role
- **Use Case**: Primary method for blockchain-native users

#### 2. ZKLogin (Zero-Knowledge Authentication)
- **What**: OAuth-based authentication creating ephemeral Sui wallets
- **Providers**: Google (more providers coming soon)
- **Access**: Click "Connect" → "ZKLogin" tab → Choose provider
- **Role**: Automatically assigned `user` role
- **Use Case**: Mobile-friendly, no wallet extension needed

#### 3. Passkey (Biometric/PIN)
- **What**: WebAuthn-based authentication using device biometrics or PIN
- **Security**: Face ID, Touch ID, Windows Hello, or PIN
- **Access**: Click "Connect" → "Passkey" tab → Register/Login
- **Role**: Automatically assigned `user` role
- **Use Case**: Most secure, mobile-friendly, passwordless

#### 4. Email Magic Link (Supabase Auth)
- **What**: Email-based passwordless authentication
- **Access**: Navigate to `/auth` → Enter email → Check inbox for magic link
- **Role**: Can be `user`, `admin`, or `partner` (admin-controlled)
- **Use Case**: Traditional users, can be linked to wallet later

---

### For Providers/Partners/Admin (Roles: `partner`, `admin`)

Providers and administrators use **email-only authentication** to access management dashboards:

#### Email Authentication (Required)
- **What**: Email/password or magic link authentication via Supabase
- **Access**: Navigate to `/auth` → Email tab
- **Roles**: 
  - `admin` - Full system access (user management, moderation, revenue tracking)
  - `partner` - Provider access (manage infrastructure listings, advertising, analytics)
- **Dashboard Access**:
  - Admin: `/admin/dashboard`
  - Partner/Provider: `/provider-dashboard`

---

## Role-Based Access Control

| Role | Auth Methods | Access |
|------|--------------|--------|
| **user** | Wallet, ZKLogin, Passkey, Email | Normal tools (Wallet Cleanup, Transaction Explainer, Infra Discovery) |
| **partner** | Email only | Provider Dashboard (manage listings, ads, analytics) |
| **admin** | Email only | Admin Dashboard (user management, moderation, system oversight, revenue tracking) |

---

## Multi-Chain Network Selection

All authenticated users can switch between multiple blockchain networks:

### Supported Networks

#### Sui Network
- **Mainnet** (Production)
- **Testnet** (Testing)
- **Devnet** (Development)

#### Aptos Network
- **Mainnet** (Production)
- **Testnet** (Testing)

#### EVM Networks
- **Ethereum Mainnet**
- **Sepolia Testnet**

#### Custom RPC
- Add any custom RPC URL for supported chains
- Validates URL format before adding

### How to Switch Networks
1. Click the **network selector** button in the header (shows current network)
2. Choose from preset networks (Sui, Aptos, EVM tabs)
3. Or use **Custom RPC** tab to add your own RPC endpoint

---

## Wallet Linking

Users who authenticate via **Email, ZKLogin, or Passkey** can link a wallet address for enhanced functionality:

1. **Sign in** with non-wallet method
2. Click **"Link Wallet"** in settings or user menu
3. Connect wallet via modal
4. Wallet address is now associated with your account

**Benefits of Linking:**
- Unified identity across methods
- Access wallet-specific features
- Persistent preferences and data

---

## Security Best Practices

### For Normal Users
- **Wallet**: Use hardware wallets for large amounts
- **ZKLogin**: Keep OAuth account secure (2FA recommended)
- **Passkey**: Use device lock (PIN/biometrics) for added security
- **Email**: Enable 2FA on email account

### For Providers/Admin
- **Email Auth**: Must use strong passwords + 2FA
- **Admin Accounts**: Never share credentials
- **API Keys**: Rotate regularly, use environment variables
- **Dashboard Access**: Always log out on shared devices

---

## Common Scenarios

### Scenario 1: Mobile User Without Wallet
**Solution**: Use **ZKLogin** (OAuth) or **Passkey** (biometric)
- Open Atlas on mobile browser
- Click "Connect"
- Choose "ZKLogin" or "Passkey" tab
- Authenticate and start using tools

### Scenario 2: Infrastructure Provider Joining
**Solution**: Contact admin for **partner role** assignment
1. Register via email at `/auth`
2. Contact Atlas admin to upgrade role to `partner`
3. Access Provider Dashboard at `/provider-dashboard`
4. Manage infrastructure listings and advertising

### Scenario 3: User Wants to Switch Chains
**Solution**: Use **Multi-Chain Network Selector**
1. Click network button in header
2. Choose Sui, Aptos, or EVM tab
3. Select specific network (mainnet/testnet/devnet)
4. App automatically switches RPC endpoint

### Scenario 4: Admin Needs System Access
**Solution**: Email authentication with `admin` role
1. Sign in at `/auth` with admin-assigned email
2. Navigate to `/admin/dashboard`
3. Access user management, moderation logs, revenue tracking

---

## Technical Implementation

### Database Schema

#### `user_profiles` Table
```sql
- id (uuid, primary key)
- wallet_address (text, nullable)
- email (text, nullable)
- role (enum: 'user' | 'partner' | 'admin') -- NEW
- auth_method (enum: 'email' | 'wallet' | 'zklogin' | 'passkey') -- NEW
- display_name (text)
- avatar_url (text)
- is_admin (boolean) -- DEPRECATED, migrated to role
```

#### `passkey_credentials` Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → user_profiles)
- credential_id (text, unique)
- public_key (text)
- counter (integer)
- transports (text array)
```

#### `zklogin_sessions` Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → user_profiles)
- provider (text) -- 'google', 'facebook', etc.
- ephemeral_address (text)
- jwt_token (text)
- max_epoch (bigint)
- expires_at (timestamp)
```

---

## API Routes

### Normal User Auth
- `POST /api/auth/zklogin/initiate` - Start ZKLogin OAuth flow
- `GET /api/auth/zklogin/callback` - Handle OAuth callback
- `POST /api/auth/passkey/register/options` - Get WebAuthn registration options
- `POST /api/auth/passkey/register/verify` - Verify passkey registration
- `POST /api/auth/passkey/login/options` - Get WebAuthn login options
- `POST /api/auth/passkey/login/verify` - Verify passkey login

### Email Auth (All Roles)
- `POST /api/auth/login` - Email magic link login
- `POST /api/auth/logout` - Sign out

### Admin/Provider Auth
- `POST /api/admin/login` - Admin-specific login (enforces role)

---

## Frontend Components

### User-Facing
- `WalletConnectionModal` - Main modal with Wallet/ZKLogin/Passkey tabs
- `ZKLoginAuth` - OAuth flow component
- `PasskeyAuth` - WebAuthn registration/login
- `MultichainNetworkSelector` - Network switching UI

### Provider/Admin
- `ProviderDashboardBanner` - Homepage banner directing providers to dashboard
- `AdminDashboard` - Admin management interface
- `ProviderDashboard` - Infrastructure provider management

---

## Environment Variables

Required for authentication system:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# JWT Secret
JWT_SECRET=<your-secret-key>

# OAuth (for ZKLogin)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# WebAuthn (for Passkey)
WEBAUTHN_RP_NAME="Atlas Protocol"
WEBAUTHN_RP_ID="your-domain.com"
WEBAUTHN_ORIGIN="https://your-domain.com"
```

---

## FAQ

**Q: Can I use multiple auth methods on the same account?**
A: Yes! Link your wallet to an email/zklogin/passkey account for unified access.

**Q: Which auth method is most secure?**
A: Passkey (WebAuthn) offers the highest security with device-level biometric verification.

**Q: Can normal users become providers?**
A: Contact the admin team to upgrade your account role from `user` to `partner`.

**Q: Do I need a wallet extension for all features?**
A: No. ZKLogin and Passkey provide full functionality without wallet extensions.

**Q: What happens if I lose access to my passkey device?**
A: You can authenticate via another method (email/wallet) and re-register a new passkey.

**Q: Can I use Atlas on mobile?**
A: Yes! ZKLogin and Passkey are fully mobile-compatible.

---

## Support

For authentication issues:
- **Users**: Contact support at support@atlasprotocol.io
- **Providers**: Email partners@atlasprotocol.io
- **Admin**: Internal escalation via admin dashboard

---

*Last updated: February 2026*
