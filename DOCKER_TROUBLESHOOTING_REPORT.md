# Docker Compose Troubleshooting Report
**Generated:** 2025-10-16  
**Status:** Multiple issues identified and documented

---

## Executive Summary

The Docker Compose setup has **3 critical issues** and **4 secondary issues** preventing full service health:

| Service | Status | Issue | Severity |
|---------|--------|-------|----------|
| odeuo-web | ❌ Unhealthy | Health check port mismatch | **CRITICAL** |
| odeuo-twenty-worker | ⚠️ Starting | Invalid npm script command | **CRITICAL** |
| odeuo-n8n | ⚠️ Unhealthy | Health check failing (likely auth) | **HIGH** |
| odeuo-file-watcher | ⚠️ Created | Not started | **MEDIUM** |
| odeuo-livekit-agents | ⚠️ Created | Not started | **MEDIUM** |
| odeuo-redis | ✅ Healthy | Eviction policy warning | **LOW** |

---

## Critical Issues

### 1. **Twenty Worker - Missing npm Script** ⚠️ CRITICAL
**Location:** `docker-compose.dev.yml` line 238  
**Error:** `npm error Missing script: "worker"`

**Root Cause:**
```
command: npm run worker:prod
```
The script `worker:prod` doesn't exist in the Twenty CRM package.json.

**Fix:**
Change the command to use the correct script:
```yaml
command: npm run worker
```

**Impact:** Worker process fails to start, preventing background job processing.

---

### 2. **Web App Health Check - Port Mismatch** ❌ CRITICAL
**Location:** `docker-compose.yml` line 126  
**Error:** Health check fails because it checks port 3000, but app runs on 3001

**Root Cause:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
```
In development mode (docker-compose.dev.yml), the app runs on port 3001, not 3000.

**Fix:**
Update the health check in docker-compose.dev.yml to use port 3001:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
```

**Impact:** Container marked as unhealthy despite running correctly.

---

### 3. **N8N Health Check - Authentication Issue** ⚠️ HIGH
**Location:** `docker-compose.yml` line 196  
**Status:** Unhealthy but logs show normal operation

**Root Cause:**
N8N requires basic auth credentials. The health check endpoint may require authentication.

**Logs Show:**
- N8N is running and processing workflows normally
- Continuous debug logs indicate healthy operation
- Health check endpoint `/healthz` may require auth

**Fix:**
Update the health check to include credentials or use a different endpoint:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "-u", "${N8N_USER:-admin}:${N8N_PASSWORD}", "http://localhost:5678/healthz"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Impact:** Container marked unhealthy but services work correctly.

---

## Secondary Issues

### 4. **File Watcher Not Starting** ⚠️ MEDIUM
**Status:** Container in "Created" state, not running  
**Likely Cause:** Depends on n8n being healthy (which is failing)

**Fix:** Once n8n health check is fixed, file-watcher should start automatically.

---

### 5. **LiveKit Agents Not Starting** ⚠️ MEDIUM
**Status:** Container in "Created" state, not running  
**Likely Cause:** Depends on livekit service (which exited)

**Fix:** Check livekit configuration and ensure it starts properly.

---

### 6. **Redis Eviction Policy Warning** ⚠️ LOW
**Location:** Twenty worker logs  
**Warning:** `IMPORTANT! Eviction policy is allkeys-lru. It should be "noeviction"`

**Root Cause:**
Redis is configured with `allkeys-lru` policy in docker-compose.yml line 70.

**Fix:**
Update Redis command to use `noeviction` policy:
```yaml
command: redis-server --maxmemory 256mb --maxmemory-policy noeviction --requirepass ${REDIS_PASSWORD}
```

**Impact:** Data loss risk if Redis reaches memory limit.

---

### 7. **Missing Environment Variables** ⚠️ LOW
**Warnings:**
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- META_APP_ID
- META_APP_SECRET
- N8N_PASSWORD

**Fix:** Add these to your `.env` file or set them as needed for your use case.

---

## Recommended Fix Order

1. **First:** Fix Twenty worker npm script (docker-compose.dev.yml line 238)
2. **Second:** Fix web app health check port (docker-compose.dev.yml)
3. **Third:** Fix N8N health check with auth (docker-compose.yml line 196)
4. **Fourth:** Fix Redis eviction policy (docker-compose.yml line 70)
5. **Fifth:** Verify file-watcher and livekit-agents start after fixes

---

## Testing After Fixes

```bash
# Restart all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Check status
docker-compose ps

# Monitor logs
docker-compose logs -f
```

---

## Current Container Status

```
✅ HEALTHY:
- odeuo-postgres (healthy)
- odeuo-redis (healthy)
- odeuo-nginx (healthy)
- odeuo-twenty-server (healthy)
- odeuo-pgadmin (running)
- odeuo-postgres-backup (healthy)
- odeuo-redis-insight (running)

⚠️ UNHEALTHY/ISSUES:
- odeuo-web (unhealthy - port mismatch)
- odeuo-n8n (unhealthy - auth issue)
- odeuo-twenty-worker (starting - script error)
- odeuo-file-watcher (created - not started)
- odeuo-livekit-agents (created - not started)
```

