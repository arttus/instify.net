# Clerk Setup Checklist

**Status:** Ready for configuration  
**Estimated Time:** 10-15 minutes

---

## ✅ Phase 1: Code Updates (COMPLETE)

- [x] Updated `web/middleware.ts` to use `clerkMiddleware()`
- [x] Added `<ClerkProvider>` to `web/src/components/providers/providers.tsx`
- [x] Configured public routes
- [x] Configured protected routes
- [x] Verified imports from correct packages
- [x] Implemented async/await pattern

---

## ⏳ Phase 2: Environment Configuration (TODO)

### Step 1: Get Clerk Keys
- [ ] Visit https://dashboard.clerk.com/last-active?path=api-keys
- [ ] Copy Publishable Key (starts with `pk_`)
- [ ] Copy Secret Key (starts with `sk_`)
- [ ] Keep keys safe (don't share or commit)

### Step 2: Create/Update `.env.local`
- [ ] Navigate to `web/` directory
- [ ] Create or open `.env.local` file
- [ ] Add the following:
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
  CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
  ```
- [ ] Replace `YOUR_KEY_HERE` with actual keys
- [ ] Save file
- [ ] Verify `.env.local` is in `.gitignore`

### Step 3: Verify Configuration
- [ ] `.env.local` file exists in `web/` directory
- [ ] Both keys are present
- [ ] Keys are not in any tracked files
- [ ] `.gitignore` includes `.env.local`

---

## ⏳ Phase 3: Development Server (TODO)

### Step 1: Restart Server
- [ ] Stop current dev server (Ctrl+C)
- [ ] Navigate to `web/` directory:
  ```bash
  cd web
  ```
- [ ] Start dev server:
  ```bash
  npm run dev
  ```
- [ ] Wait for "Ready in X.XXs" message
- [ ] No errors in console

### Step 2: Verify Server Started
- [ ] Dev server running on http://localhost:3001
- [ ] No "Missing publishableKey" errors
- [ ] No "Invalid API key" errors
- [ ] Console shows normal startup messages

---

## ⏳ Phase 4: Testing (TODO)

### Test 1: Public Routes
- [ ] Visit http://localhost:3001 - loads without auth
- [ ] Visit http://localhost:3001/ag-ui-demo - loads without auth
- [ ] Visit http://localhost:3001/livekit-demo - loads without auth
- [ ] Visit http://localhost:3001/api/health - returns 200

### Test 2: Protected Routes
- [ ] Visit http://localhost:3001/admin
- [ ] Should redirect to http://localhost:3001/sign-in
- [ ] Sign-in page loads correctly
- [ ] No errors in console

### Test 3: Sign-In Flow
- [ ] Click "Create account" or "Sign in"
- [ ] Fill in email and password
- [ ] Submit form
- [ ] Account created successfully
- [ ] Redirected to http://localhost:3001/admin
- [ ] User button appears in header

### Test 4: User Button
- [ ] Click user button in header
- [ ] Dropdown menu appears
- [ ] Options include: Profile, Settings, Sign out
- [ ] Click "Sign out"
- [ ] Redirected to home page
- [ ] User button disappears

### Test 5: Protected Route After Sign-Out
- [ ] Visit http://localhost:3001/admin
- [ ] Should redirect to sign-in
- [ ] Sign-in page loads
- [ ] Can sign in again

---

## ⏳ Phase 5: Customization (OPTIONAL)

### Customize Clerk Appearance
- [ ] Edit `web/src/components/providers/clerk-provider.tsx`
- [ ] Update colors to match your brand
- [ ] Update fonts if needed
- [ ] Test appearance in dev server

### Add Clerk Components to Pages
- [ ] Add `<UserButton>` to header
- [ ] Add `<SignInButton>` to public pages
- [ ] Add `<SignUpButton>` to public pages
- [ ] Add `<SignedIn>` / `<SignedOut>` wrappers
- [ ] Test components render correctly

### Update Public Routes (if needed)
- [ ] Review `web/middleware.ts` public routes
- [ ] Add any additional public routes
- [ ] Remove any routes that should be protected
- [ ] Test route access

---

## ⏳ Phase 6: Verification (TODO)

### Code Verification
- [ ] `web/middleware.ts` uses `clerkMiddleware()`
- [ ] `web/middleware.ts` uses `createRouteMatcher()`
- [ ] `web/middleware.ts` uses async/await
- [ ] `web/src/components/providers/providers.tsx` has `<ClerkProvider>`
- [ ] `<ClerkProvider>` is outermost provider
- [ ] All imports are from correct packages

### Environment Verification
- [ ] `web/.env.local` exists
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- [ ] `CLERK_SECRET_KEY` is set
- [ ] `.env.local` is in `.gitignore`
- [ ] No keys in tracked files

### Functionality Verification
- [ ] Public routes accessible without auth
- [ ] Protected routes redirect to sign-in
- [ ] Sign-in works correctly
- [ ] User button appears after sign-in
- [ ] Sign-out works correctly
- [ ] No console errors

---

## ⏳ Phase 7: Deployment (TODO)

### Before Deploying
- [ ] All tests passing locally
- [ ] No console errors
- [ ] Environment variables working
- [ ] Authentication flow complete

### Production Setup
- [ ] Get production Clerk keys from dashboard
- [ ] Add production keys to deployment environment
- [ ] Update Clerk dashboard with production URLs
- [ ] Test authentication in production
- [ ] Monitor for errors

---

## Quick Reference

### Commands
```bash
# Navigate to web directory
cd web

# Start dev server
npm run dev

# Stop dev server
Ctrl+C

# View environment variables
cat .env.local
```

### URLs
```
Dev Server:     http://localhost:3001
Sign-In:        http://localhost:3001/sign-in
Admin:          http://localhost:3001/admin
Clerk Dashboard: https://dashboard.clerk.com
API Keys:       https://dashboard.clerk.com/last-active?path=api-keys
```

### Files to Check
```
web/middleware.ts
web/src/components/providers/providers.tsx
web/.env.local
web/.gitignore
```

---

## Troubleshooting

### If you see "Missing publishableKey"
1. Check `web/.env.local` exists
2. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
3. Restart dev server
4. Clear browser cache

### If you see "Invalid API key"
1. Go to https://dashboard.clerk.com/last-active?path=api-keys
2. Get fresh keys
3. Update `web/.env.local`
4. Restart dev server

### If sign-in page is blank
1. Check browser console for errors
2. Verify `<ClerkProvider>` in providers.tsx
3. Verify environment variables are set
4. Restart dev server

### If middleware is hanging
1. This should be fixed - using current `clerkMiddleware()`
2. Check for syntax errors in `web/middleware.ts`
3. Verify imports are correct
4. Restart dev server

---

## Support Resources

- **Clerk Docs:** https://clerk.com/docs
- **Next.js Integration:** https://clerk.com/docs/quickstarts/nextjs
- **Components:** https://clerk.com/docs/components/overview
- **API Reference:** https://clerk.com/docs/reference/backend-api
- **Dashboard:** https://dashboard.clerk.com

---

## Summary

**Phase 1 (Code):** ✅ COMPLETE  
**Phase 2 (Environment):** ⏳ TODO - Add keys to `.env.local`  
**Phase 3 (Server):** ⏳ TODO - Restart dev server  
**Phase 4 (Testing):** ⏳ TODO - Test authentication  
**Phase 5 (Customization):** ⏳ OPTIONAL  
**Phase 6 (Verification):** ⏳ TODO - Verify everything works  
**Phase 7 (Deployment):** ⏳ TODO - Deploy to production

---

**Next Action:** Add environment variables to `web/.env.local` and restart dev server

