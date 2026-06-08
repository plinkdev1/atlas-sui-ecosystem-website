# Atlas Protocol - Dashboards & Admin Interfaces

This document describes all admin interfaces, private dashboards, and management tools in Atlas Protocol.

## Overview

Atlas Protocol includes several admin and developer interfaces for managing the platform, moderating providers, and editing listings. These are designed for internal use and controlled access.

## 1. Admin Moderation Panel (`/admin`)

**Access:** Direct URL only (no public link in UI)
**Status:** Complete with authentication

### Purpose
Central hub for moderating infrastructure service providers. Approve/reject submissions, manage featured providers, and maintain registry quality.

### Features

#### Provider Management Table
- **Name** - Service provider name
- **Category** - RPC, Gateway, Indexing, Validator, etc.
- **Status Badge** - Pending, Approved, Rejected, or Featured
- **Verified Badge** - Visual indicator for verified providers

#### Action Buttons (Per Provider)
- **Approve** - Move provider to approved status
- **Reject** - Decline provider with optional reason
- **Feature** - Mark as featured service (highlighted in discovery)
- **Remove** - Delete provider from registry

#### Dashboard Stats
- Total Providers count
- Pending submissions
- Approved providers
- Rejected submissions
- Featured services

#### Filtering System
- **Status Filter** - View by: All, Pending, Approved, Rejected, Featured
- **Search** - Full-text search across provider names and descriptions
- **Real-time Updates** - Changes persist to localStorage

### Data Persistence
All moderation changes stored in localStorage under key: `infra-moderation-state`

```json
{
  "provider-id": {
    "status": "approved",
    "featured": true,
    "rejectedReason": null,
    "modifiedAt": "2026-01-11T12:00:00Z"
  }
}
```

### Theme Support
- Full dark/light mode support
- Responsive table layout for mobile
- Accessible UI with proper keyboard navigation

---

## 2. Provider Dashboard (`/provider-dashboard`)

**Access:** Direct URL with mock login
**Status:** Complete with authentication layer

### Purpose
Allows infrastructure providers to manage and update their service listings on Atlas Protocol.

### Authentication
Mock login system with localStorage persistence:
- **Username/Password:** Any credentials accepted (MVP mode)
- **Session Storage:** `provider-dashboard-session` key
- **Logout:** Clears session and returns to login screen

### Provider Editing Form

#### Form Fields
1. **Provider Name** (text field, required)
   - Auto-filled with current provider data
   - Max 100 characters

2. **Description** (textarea, required)
   - Detailed service description
   - Max 500 characters
   - Supports markdown-lite formatting

3. **Pricing** (text field, optional)
   - Pricing tier or subscription model
   - Examples: "Free", "$99/month", "Pay-as-you-go"

4. **Features** (multi-select tags)
   - Pre-defined feature list
   - Supports custom tags
   - Examples: "Low Latency", "WebSocket Support", "Archive Data", "Indexing"

5. **Website URL** (URL field, optional)
   - Must be valid HTTPS URL
   - Auto-validated

6. **Logo URL** (URL field, optional)
   - CDN-hosted image URL
   - Supports PNG, SVG, WebP
   - Live preview in form

### Form Actions

#### Save Changes
- **Button:** "Update Listing"
- **Action:** Validates form data
- **Storage:** Saves to localStorage under `provider-edits`
- **Toast:** Shows "Listing updated successfully" confirmation
- **Data Format:**
```json
{
  "provider-name": {
    "name": "New Name",
    "description": "Updated description",
    "pricing": "Free tier available",
    "features": ["Feature1", "Feature2"],
    "website": "https://example.com",
    "logoUrl": "https://cdn.example.com/logo.png",
    "lastUpdated": "2026-01-11T12:00:00Z"
  }
}
```

#### Logout
- Clears authentication state
- Removes localStorage session
- Redirects to login screen

### Form Validation
- Required fields checked before submit
- URL fields validated for HTTPS
- Toast warnings for validation errors
- Real-time field validation

### Responsive Design
- Mobile-friendly form layout
- Stacked fields on small screens
- Touch-optimized buttons
- Readable typography

---

## 3. Partners Admin (`/admin/partners`)

**Access:** Direct URL with authentication
**Status:** Complete with production auth layer

### Purpose
Manage ecosystem partners, sponsors, and featured integrations on the Atlas Protocol homepage.

### Authentication

#### Login System
- **Username:** Configured via `ADMIN_USERNAME` environment variable (server-side only, secure)
- **Password:** Configured via `ADMIN_PASSWORD` environment variable (server-side only, secure)
- **Mode Detection:**
  - Development: Auto-authenticated (skip login)
  - Production: Login form required
- **Security:** Credentials are validated server-side via API route, never exposed to client

**To set credentials:**
1. Go to Project Settings → Vars (in v0 interface)
2. Add:
   ```
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = your_secure_password
   ```
3. Refresh page and login

### Partner Management

#### Partner Listing
- Name & company
- Website URL
- Logo/badge
- Category (Exchange, Wallet, Tool, Validator, etc.)
- Status (Active, Inactive, Featured)

#### Actions
- **Edit** - Update partner details
- **Feature** - Highlight on homepage
- **Deactivate** - Hide from platform
- **Remove** - Delete partner

#### Homepage Integration
Featured partners display on:
- Homepage hero section
- Ecosystem partners card carousel
- Infra Discovery "Powered By" section

---

## Data Architecture

### localStorage Keys Used

```javascript
// Moderation state for providers
"infra-moderation-state" → {
  "provider-id": { status, featured, timestamp }
}

// Provider edits
"provider-edits" → {
  "provider-name": { name, description, pricing, features, website, logo }
}

// Admin session
"provider-dashboard-session" → {
  "isLoggedIn": true,
  "username": "string",
  "timestamp": "ISO-string"
}

// Partners admin session
"admin-partners-session" → {
  "isAuthenticated": true,
  "timestamp": "ISO-string"
}
```

---

## Environment Variables

Required for production deployment:

```env
# Admin Partners Login (SERVER-SIDE ONLY - secure, not exposed to client)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password

# Blockchain APIs (Server-side only - do NOT use NEXT_PUBLIC_ prefix for sensitive APIs)
BLOCKBERRY_API_KEY=optional
BLOCKVISION_API_KEY=optional
```

---

## Security Notes

**Current Status:** Mock/MVP implementation for demonstration

### For Production Use:
1. Replace mock login with proper authentication (Supabase Auth, Auth.js, etc.)
2. Move credentials to backend/secure session storage
3. Implement proper authorization checks
4. Add audit logging for all admin actions
5. Use database instead of localStorage for persistence
6. Add rate limiting and IP restrictions
7. Implement CSRF tokens
8. Regular security audits

---

## Testing & Workflows

### Testing Admin Panel
1. Navigate to `/admin`
2. View the provider moderation table
3. Test status filters
4. Click action buttons (changes save to localStorage)
5. Verify changes persist after page reload

### Testing Provider Dashboard
1. Navigate to `/provider-dashboard`
2. Enter any credentials (e.g., "test" / "test")
3. Click "Login"
4. Fill out provider form
5. Click "Update Listing"
6. Verify success toast
7. Log out and login again to verify data persistence

### Testing Partners Admin
1. Navigate to `/admin/partners`
2. Enter configured credentials
3. Manage partner listings
4. Features display on homepage when marked as "Featured"

---

## Troubleshooting

### Can't access admin page?
- Check you're entering correct credentials
- Verify environment variables are set (if production)
- In development, check NODE_ENV

### Data not persisting?
- Check browser localStorage is enabled
- Verify correct localStorage keys used
- Clear cache and try again

### Forms not validating?
- Check console for validation error messages
- Ensure all required fields are filled
- Try with sample data to isolate issue

---

## Future Enhancements

- [ ] Real database backend (Supabase, Firebase)
- [ ] Proper user authentication (Supabase Auth, Auth.js)
- [ ] Audit logs for all admin actions
- [ ] Batch operations (approve multiple providers)
- [ ] Provider verification workflow
- [ ] Email notifications for approvals
- [ ] Analytics dashboard
- [ ] Advanced filtering and sorting
- [ ] CSV import/export

---

For questions or issues, see the main [README.md](../README.md) or [Architecture Guide](./ARCHITECTURE.md).
