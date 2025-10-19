# Clerk Quick Reference Card

---

## 🚀 Quick Start (5 Minutes)

### 1. Get Keys
```
https://dashboard.clerk.com/last-active?path=api-keys
```

### 2. Add to `web/.env.local`
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Restart Dev Server
```bash
cd web && npm run dev
```

### 4. Test
- Visit: http://localhost:3001/admin
- Should redirect to sign-in
- Create account and verify

---

## 📁 Files Updated

```
web/
├── middleware.ts                          ✅ Updated to clerkMiddleware()
└── src/components/providers/
    └── providers.tsx                      ✅ Added <ClerkProvider>
```

---

## 🔐 Public Routes (No Auth Required)

```
/                    /ag-ui-demo          /livekit-demo
/auth-test          /api/health           /api/metrics
/api/copilotkit     /api/livekit/token    /api/webhooks/*
/sign-in/*          /sign-up/*
```

---

## 🛡️ Protected Routes (Auth Required)

```
/admin/*             /admin/automation     /admin/analytics
/admin/settings
```

---

## 💻 Using Clerk in Components

### Client Component
```typescript
'use client'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export function Header() {
  return (
    <>
      <SignedOut><SignInButton /></SignedOut>
      <SignedIn><UserButton /></SignedIn>
    </>
  )
}
```

### Server Component
```typescript
import { auth } from '@clerk/nextjs/server'

export async function Dashboard() {
  const { userId } = await auth()
  if (!userId) return <div>Not authenticated</div>
  return <div>Welcome!</div>
}
```

---

## ⚙️ Middleware Pattern

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/public(.*)', '/sign-in(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
```

---

## 🎨 Customize Clerk UI

Edit `web/src/components/providers/clerk-provider.tsx`:

```typescript
<ClerkProvider
  appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: '#007AFF',
    },
  }}
>
  {children}
</ClerkProvider>
```

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "Missing publishableKey" | Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local` |
| "Invalid API key" | Get fresh keys from Clerk Dashboard |
| Sign-in page blank | Verify `<ClerkProvider>` in providers.tsx |
| Middleware hanging | Already fixed - using current `clerkMiddleware()` |

---

## 📚 Resources

- **Clerk Docs:** https://clerk.com/docs
- **Next.js Integration:** https://clerk.com/docs/quickstarts/nextjs
- **Components:** https://clerk.com/docs/components/overview
- **API Reference:** https://clerk.com/docs/reference/backend-api

---

## ✅ Verification Checklist

- [ ] Clerk keys added to `web/.env.local`
- [ ] Dev server restarted
- [ ] Public routes load without auth
- [ ] `/admin` redirects to sign-in
- [ ] Can create account and sign in
- [ ] User button appears after sign-in
- [ ] Sign-out works correctly

---

## 🔄 Current Implementation

```
Request
  ↓
clerkMiddleware()
  ↓
Is public route?
  ├─ YES → Allow
  └─ NO → Check auth()
       ├─ Authenticated → Allow
       └─ Not authenticated → Redirect to /sign-in
```

---

**Status:** ✅ Ready to use  
**Next:** Add environment variables and test

