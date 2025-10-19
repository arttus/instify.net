# Clerk Authentication Setup Guide
**Updated:** 2025-10-16  
**Status:** ✅ Updated to current Clerk App Router approach

---

## Overview

Your Next.js application has been updated to use the **current Clerk authentication** approach with the App Router. This guide explains the setup and how to configure your Clerk keys.

---

## What Was Updated

### 1. **Middleware** (`web/middleware.ts`)
✅ Updated from deprecated `authMiddleware()` to **`clerkMiddleware()`**

**Key Changes:**
- Uses `clerkMiddleware()` from `@clerk/nextjs/server`
- Uses `createRouteMatcher()` for public route definitions
- Implements proper async/await pattern with `auth()`
- Follows current Clerk best practices

### 2. **Providers** (`web/src/components/providers/providers.tsx`)
✅ Added **`<ClerkProvider>`** wrapper

**Key Changes:**
- Wraps the entire app with `<ClerkProvider>`
- Positioned before other providers (ThemeProvider, CopilotProvider)
- Enables Clerk authentication throughout the app

---

## Environment Variables Setup

### Step 1: Get Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **API Keys** page
3. Copy your **Publishable Key** and **Secret Key**

### Step 2: Add to `.env.local`

Create or update `web/.env.local`:

```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

**Important:**
- Replace `YOUR_PUBLISHABLE_KEY` with your actual publishable key
- Replace `YOUR_SECRET_KEY` with your actual secret key
- The `NEXT_PUBLIC_` prefix makes the publishable key available to the browser
- **Never commit `.env.local` to version control** - it's in `.gitignore`

### Step 3: Verify `.gitignore`

Ensure `.env.local` is in your `.gitignore`:

```bash
# web/.gitignore
.env.local
.env*.local
```

---

## Public vs. Protected Routes

### Public Routes (No Authentication Required)

These routes are accessible to everyone:

```
/                          # Home page
/ag-ui-demo               # AG-UI demo
/livekit-demo             # LiveKit demo
/auth-test                # Auth test page
/api/health               # Health check endpoint
/api/metrics              # Metrics endpoint
/api/copilotkit           # CopilotKit API
/api/livekit/token        # LiveKit token endpoint
/api/webhooks/*           # Webhook endpoints
/sign-in/*                # Sign-in page
/sign-up/*                # Sign-up page
```

### Protected Routes (Authentication Required)

These routes require users to be signed in:

```
/admin/*                  # Admin dashboard and all sub-routes
/admin/automation         # Automation settings
/admin/analytics          # Analytics dashboard
/admin/settings           # Admin settings
```

---

## Using Clerk Components

### In Client Components

Use Clerk's React components for authentication UI:

```typescript
'use client'

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export function AuthHeader() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  )
}
```

### In Server Components

Use `auth()` to get user information:

```typescript
import { auth } from '@clerk/nextjs/server'

export async function AdminDashboard() {
  const { userId } = await auth()

  if (!userId) {
    return <div>Not authenticated</div>
  }

  return <div>Welcome, {userId}</div>
}
```

---

## Current Implementation

### Middleware Flow

```
Request → clerkMiddleware()
  ↓
Is route public? (checked via createRouteMatcher)
  ├─ YES → Allow access
  └─ NO → Check authentication
       ├─ User authenticated? → Allow access
       └─ User not authenticated? → Redirect to /sign-in
```

### Provider Hierarchy

```
<ClerkProvider>
  <ThemeProvider>
    <CopilotProvider>
      {children}
    </CopilotProvider>
  </ThemeProvider>
</ClerkProvider>
```

---

## Testing Your Setup

### 1. Start the Development Server

```bash
cd web
npm run dev
```

### 2. Test Public Routes

Visit these URLs - they should load without authentication:
- http://localhost:3001/
- http://localhost:3001/ag-ui-demo
- http://localhost:3001/livekit-demo

### 3. Test Protected Routes

Visit http://localhost:3001/admin - you should be redirected to sign-in

### 4. Sign In

1. Click "Sign In" button
2. Create a test account or sign in with existing credentials
3. You should be redirected to `/admin`

### 5. Verify User Button

After signing in, you should see a user button in the header with options to:
- View profile
- Sign out
- Manage account

---

## Troubleshooting

### Error: "Missing publishableKey"

**Cause:** Environment variables not set  
**Fix:** 
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is in `web/.env.local`
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Error: "Invalid API key"

**Cause:** Wrong or expired keys  
**Fix:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
2. Copy fresh keys
3. Update `web/.env.local`
4. Restart dev server

### Middleware Hanging

**Cause:** Misconfigured matcher pattern  
**Fix:** The matcher is now properly configured to skip Next.js internals

### Sign-in Page Not Loading

**Cause:** ClerkProvider not wrapping app  
**Fix:** Verify `<ClerkProvider>` is in `web/src/components/providers/providers.tsx`

---

## File Changes Summary

| File | Change | Status |
|------|--------|--------|
| `web/middleware.ts` | Updated to `clerkMiddleware()` | ✅ DONE |
| `web/src/components/providers/providers.tsx` | Added `<ClerkProvider>` | ✅ DONE |
| `web/.env.local` | Add Clerk keys | ⏳ TODO |

---

## Next Steps

1. **Get Clerk Keys**
   - Visit https://dashboard.clerk.com/last-active?path=api-keys
   - Copy Publishable Key and Secret Key

2. **Update Environment Variables**
   - Edit `web/.env.local`
   - Add your Clerk keys

3. **Restart Development Server**
   ```bash
   cd web
   npm run dev
   ```

4. **Test Authentication**
   - Visit http://localhost:3001/admin
   - You should be redirected to sign-in
   - Create a test account and verify sign-in works

5. **Customize (Optional)**
   - Update public routes in `web/middleware.ts` if needed
   - Customize Clerk appearance in `web/src/components/providers/clerk-provider.tsx`

---

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference/backend-api)
- [Clerk Components](https://clerk.com/docs/components/overview)

---

## Security Notes

✅ **Best Practices Implemented:**
- Publishable key is public (prefixed with `NEXT_PUBLIC_`)
- Secret key is private (server-side only)
- Environment variables are not committed to git
- Middleware validates authentication on every request
- Protected routes redirect to sign-in automatically

---

**Status:** ✅ Clerk setup updated to current App Router approach  
**Ready to:** Add environment variables and test authentication

