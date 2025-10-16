# ODEUO Local Development - Fix Instructions

**Date**: 2025-10-16  
**Status**: Services Not Accessible - Root Causes Identified

---

## 🔍 Issues Identified

### 1. ✅ FIXED: LiveKit Configuration Error
**Status**: FIXED - LiveKit disabled temporarily  
**Issue**: LiveKit config file incompatible with current version  
**Impact**: Caused nginx to fail startup  
**Fix Applied**: Commented out LiveKit upstream and server block in nginx config

### 2. ✅ FIXED: Nginx Port Misconfiguration  
**Status**: FIXED  
**Issue**: Nginx was trying to connect to `odeuo-web:3000` but app runs on port `3001`  
**Fix Applied**: Updated nginx config to use `odeuo-web:3001`

### 3. ❌ CRITICAL: Next.js App Not Responding
**Status**: NOT FIXED - REQUIRES INVESTIGATION  
**Issue**: Next.js app accepts connections but times out on all requests  
**Symptoms**:
- App says "Ready in 8.2s"
- Listening on port 3001
- Accepts TCP connections
- But times out waiting for HTTP response
- No errors in logs

**Likely Causes**:
1. **Middleware stuck** - Auth middleware waiting for Clerk/database
2. **Missing environment variables** - App waiting for required config
3. **Database connection issue** - App trying to connect to database on startup
4. **Infinite loop in middleware** - Code issue causing hang

---

## 🛠️ Fixes Applied

### Fix 1: Disabled LiveKit in Nginx

**File**: `config/nginx/dev.conf`

**Changes**:
```nginx
# Line 17-20: Commented out LiveKit upstream
# Temporarily disabled - LiveKit config needs update
# upstream livekit_backend {
#     server livekit:7880;
# }

# Line 313-331: Commented out LiveKit server block
# LiveKit Server - Temporarily disabled until config is fixed
# server {
#     listen 80;
#     server_name livekit.odeuo.local;
#     ...
# }
```

**Command Run**:
```bash
docker-compose stop livekit
docker-compose restart nginx
```

**Result**: ✅ Nginx now starts successfully and passes config test

### Fix 2: Corrected odeuo-web Port

**File**: `config/nginx/dev.conf`

**Changes**:
```nginx
# Line 9-11: Changed port from 3000 to 3001
upstream odeuo_web {
    server odeuo-web:3001;  # Changed from 3000
}
```

**Command Run**:
```bash
docker-compose restart nginx
```

**Result**: ✅ Nginx can now resolve odeuo-web correctly

---

## 🚨 Remaining Issue: Next.js App Timeout

### Problem Description

The Next.js application (`odeuo-web`) is running but not responding to HTTP requests:

**Evidence**:
```bash
# App is listening
$ docker-compose exec odeuo-web netstat -tlnp | grep 3001
tcp        0      0 0.0.0.0:3001            0.0.0.0:*               LISTEN      43/next-server

# App says it's ready
$ docker-compose logs odeuo-web | grep Ready
 ✓ Ready in 8.2s

# But connections timeout
$ curl -v -m 10 http://localhost:3001/
* Connected to localhost (::1) port 3001
> GET / HTTP/1.1
* Operation timed out after 10005 milliseconds with 0 bytes received
```

### Diagnostic Steps to Investigate

#### Step 1: Check Environment Variables

```bash
# View all environment variables in the container
docker-compose exec odeuo-web env | sort

# Check for missing required variables
docker-compose exec odeuo-web env | grep -E "(DATABASE_URL|CLERK|NEXTAUTH)"
```

**Look for**:
- Missing `DATABASE_URL`
- Missing `NEXTAUTH_URL` or `NEXTAUTH_SECRET`
- Missing `CLERK_` variables
- Any undefined variables that middleware might need

#### Step 2: Check Database Connectivity

```bash
# Test if app can connect to database
docker-compose exec odeuo-web ping -c 3 postgres

# Check if database is accepting connections
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "SELECT 1;"
```

#### Step 3: Check Middleware Code

```bash
# View middleware file
cat web/src/middleware.ts

# Look for:
# - Database queries on every request
# - External API calls (Clerk, etc.)
# - Infinite loops or recursion
# - Missing try-catch blocks
```

#### Step 4: Check for Compilation Issues

```bash
# Watch logs in real-time
docker-compose logs -f odeuo-web

# Look for:
# - Stuck compilation
# - Module resolution errors
# - TypeScript errors
```

#### Step 5: Test with Minimal Setup

```bash
# Temporarily disable middleware
# Edit web/src/middleware.ts and comment out all logic
# Or rename it to middleware.ts.bak

# Restart the container
docker-compose restart odeuo-web

# Test again
curl -v http://localhost:3001/
```

---

## 🎯 Recommended Next Steps

### Immediate Actions

1. **Check .env File**
   ```bash
   # Verify .env exists and has required variables
   cat .env | grep -E "(DATABASE_URL|NEXTAUTH|CLERK)"
   ```

2. **Check Middleware**
   ```bash
   # View middleware to identify blocking code
   cat web/src/middleware.ts
   ```

3. **Check Database Connection**
   ```bash
   # Ensure database is accessible
   docker-compose exec odeuo-web ping postgres
   ```

4. **Review Environment Variables in Container**
   ```bash
   # See what the app actually has access to
   docker-compose exec odeuo-web env | grep -v "PATH\|HOME\|USER"
   ```

### Temporary Workaround

If you need to get the app working immediately:

1. **Disable Middleware Temporarily**
   ```bash
   # Rename middleware file
   mv web/src/middleware.ts web/src/middleware.ts.bak
   
   # Restart container
   docker-compose restart odeuo-web
   
   # Test
   curl http://localhost:3001/
   ```

2. **Or Use Minimal Middleware**
   Create a minimal `web/src/middleware.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   
   export function middleware(request: NextRequest) {
     // Minimal middleware - just pass through
     return NextResponse.next()
   }
   
   export const config = {
     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
   }
   ```

---

## 📊 Current Service Status

```
✅ postgres          - Up, healthy, accessible
✅ redis             - Up, healthy, accessible
✅ twenty-server     - Up, healthy, accessible at http://localhost:3002
✅ twenty-worker     - Up, healthy
✅ n8n               - Up, accessible at http://localhost:5678
✅ pgadmin           - Up, accessible at http://localhost:8080
✅ redis-insight     - Up, accessible
✅ nginx             - Up, config valid, listening on port 80

⚠️  odeuo-web        - Up, listening, but NOT responding to requests
❌ livekit           - Stopped (config issue - fix later)
```

---

## 🔧 Quick Commands for Debugging

```bash
# Check all service status
docker-compose ps

# View odeuo-web logs
docker-compose logs -f odeuo-web

# Check environment variables
docker-compose exec odeuo-web env

# Test database connection
docker-compose exec odeuo-web ping postgres

# Test direct connection to app
curl -v -m 10 http://localhost:3001/

# Restart odeuo-web
docker-compose restart odeuo-web

# Rebuild odeuo-web
docker-compose build odeuo-web
docker-compose up -d odeuo-web

# Access shell in container
docker-compose exec odeuo-web sh
```

---

## 📝 Files Modified

1. **config/nginx/dev.conf**
   - Line 9-11: Changed `odeuo-web:3000` to `odeuo-web:3001`
   - Line 17-20: Commented out LiveKit upstream
   - Line 313-331: Commented out LiveKit server block

2. **Services Stopped**
   - `livekit` - Stopped to prevent crash loop

---

## 🆘 If You Need Help

The main issue is that the Next.js app is not responding to HTTP requests despite being "ready". This is typically caused by:

1. **Middleware blocking** - Check `web/src/middleware.ts`
2. **Missing environment variables** - Check `.env` file
3. **Database connection issues** - Test connectivity
4. **Code issues** - Check for infinite loops or blocking operations

**Next Step**: Please run the diagnostic commands in "Step 1: Check Environment Variables" and share the output so we can identify the exact cause.

---

**Report Generated**: 2025-10-16  
**Fixes Applied**: 2  
**Remaining Issues**: 1 (Critical)  
**Status**: Requires further investigation of Next.js app timeout issue

