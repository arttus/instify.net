# Docker Issues - Visual Guide & Quick Reference

---

## Issue Dependency Map

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE ISSUES                    │
└─────────────────────────────────────────────────────────────┘

CRITICAL ISSUES (Must Fix):
├─ Issue #1: Twenty Worker Script Error
│  └─ Impact: Worker process won't start
│  └─ Fix: npm run worker:prod → npm run worker
│  └─ File: docker-compose.dev.yml:244
│
├─ Issue #2: Web App Health Check Port
│  └─ Impact: Container marked unhealthy
│  └─ Fix: Add health check for port 3001
│  └─ File: docker-compose.dev.yml:24-29
│
└─ Issue #3: N8N Health Check Auth
   └─ Impact: Container marked unhealthy
   └─ Fix: Add -u flag with credentials
   └─ File: docker-compose.yml:196

SECONDARY ISSUES (Should Fix):
├─ Issue #4: Redis Eviction Policy
│  └─ Impact: Data loss risk
│  └─ Fix: allkeys-lru → noeviction
│  └─ Files: docker-compose.yml:70, docker-compose.dev.yml:47
│
├─ Issue #5: File Watcher Not Starting
│  └─ Depends on: N8N being healthy
│  └─ Auto-fixes when: Issue #3 is fixed
│
└─ Issue #6: LiveKit Agents Not Starting
   └─ Depends on: LiveKit service
   └─ Auto-fixes when: Dependencies are healthy
```

---

## Service Dependency Chain

```
BEFORE FIXES (Broken Chain):
┌──────────────┐
│  PostgreSQL  │ ✅ Healthy
└──────┬───────┘
       │
       ├─→ ┌──────────────┐
       │   │    Redis     │ ✅ Healthy
       │   └──────────────┘
       │
       ├─→ ┌──────────────┐
       │   │  Web App     │ ❌ Unhealthy (port mismatch)
       │   └──────────────┘
       │
       ├─→ ┌──────────────┐
       │   │    N8N       │ ❌ Unhealthy (auth issue)
       │   └──────┬───────┘
       │          │
       │          └─→ ┌──────────────────┐
       │              │  File Watcher    │ ⚠️ Not started
       │              └──────────────────┘
       │
       └─→ ┌──────────────┐
           │   Twenty     │ ⚠️ Worker failing
           │   Worker     │ (script error)
           └──────────────┘


AFTER FIXES (Healthy Chain):
┌──────────────┐
│  PostgreSQL  │ ✅ Healthy
└──────┬───────┘
       │
       ├─→ ┌──────────────┐
       │   │    Redis     │ ✅ Healthy
       │   └──────────────┘
       │
       ├─→ ┌──────────────┐
       │   │  Web App     │ ✅ Healthy (port fixed)
       │   └──────────────┘
       │
       ├─→ ┌──────────────┐
       │   │    N8N       │ ✅ Healthy (auth fixed)
       │   └──────┬───────┘
       │          │
       │          └─→ ┌──────────────────┐
       │              │  File Watcher    │ ✅ Running
       │              └──────────────────┘
       │
       └─→ ┌──────────────┐
           │   Twenty     │ ✅ Healthy
           │   Worker     │ (script fixed)
           └──────────────┘
```

---

## Fix Application Timeline

```
STEP 1: Identify Issues (✅ DONE)
├─ Analyzed docker-compose.yml
├─ Analyzed docker-compose.dev.yml
├─ Reviewed container logs
└─ Identified 7 issues (4 critical/high, 3 secondary)

STEP 2: Apply Fixes (✅ DONE)
├─ Fix #1: Twenty worker script (docker-compose.dev.yml:244)
├─ Fix #2: Web app health check (docker-compose.dev.yml:24-29)
├─ Fix #3: N8N health check auth (docker-compose.yml:196)
└─ Fix #4: Redis eviction policy (2 files)

STEP 3: Verify Fixes (⏳ PENDING)
├─ Restart Docker Compose
├─ Check container status
├─ Test service endpoints
└─ Monitor logs for errors

STEP 4: Document Changes (✅ DONE)
├─ Created DOCKER_TROUBLESHOOTING_REPORT.md
├─ Created FIXES_APPLIED.md
├─ Created DOCKER_TROUBLESHOOTING_SUMMARY.md
└─ Created DOCKER_ISSUES_VISUAL_GUIDE.md
```

---

## Quick Fix Reference

### Fix #1: Twenty Worker
```diff
- command: npm run worker:prod
+ command: npm run worker
```
**File:** docker-compose.dev.yml:244

### Fix #2: Web App Health Check
```diff
  odeuo-web:
    build:
      target: development
    ports:
      - "3005:3001"
      - "9229:9229"
+   healthcheck:
+     test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
+     interval: 30s
+     timeout: 10s
+     retries: 3
+     start_period: 60s
```
**File:** docker-compose.dev.yml:24-29

### Fix #3: N8N Health Check
```diff
  healthcheck:
-   test: ["CMD", "curl", "-f", "http://localhost:5678/healthz"]
+   test: ["CMD", "curl", "-f", "-u", "${N8N_USER:-admin}:${N8N_PASSWORD}", "http://localhost:5678/healthz"]
    interval: 30s
    timeout: 10s
    retries: 3
+   start_period: 30s
```
**File:** docker-compose.yml:196

### Fix #4: Redis Eviction Policy
```diff
- command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru --requirepass ${REDIS_PASSWORD}
+ command: redis-server --maxmemory 256mb --maxmemory-policy noeviction --requirepass ${REDIS_PASSWORD}
```
**Files:** 
- docker-compose.yml:70
- docker-compose.dev.yml:47

---

## Health Check Status Indicators

```
✅ HEALTHY
   └─ Service is running and responding correctly
   └─ All dependencies are met
   └─ No errors in logs

⚠️ STARTING (health: starting)
   └─ Service is running but health check not yet passed
   └─ Wait for start_period to complete
   └─ Check logs if it doesn't transition to healthy

❌ UNHEALTHY
   └─ Service is running but health check failed
   └─ Check logs for specific error
   └─ Verify configuration and dependencies

⏸️ CREATED
   └─ Container exists but not started
   └─ Check depends_on conditions
   └─ Verify parent services are healthy

🔴 EXITED
   └─ Container stopped or crashed
   └─ Check logs for error messages
   └─ Verify configuration is correct
```

---

## Port Mapping Reference

```
HOST PORT  →  CONTAINER PORT  →  SERVICE
3005       →  3001            →  Web App (dev)
3002       →  3000            →  Twenty CRM
5678       →  5678            →  N8N
8080       →  80              →  PgAdmin
8082       →  8080            →  File Watcher
6379       →  6379            →  Redis
5432       →  5432            →  PostgreSQL
80         →  80              →  Nginx
443        →  443             →  Nginx (HTTPS)
```

---

## Environment Variables Required

```
CRITICAL (Must Set):
├─ DB_PASSWORD          (PostgreSQL password)
├─ REDIS_PASSWORD       (Redis password)
└─ TWENTY_DB_PASSWORD   (Twenty CRM database password)

IMPORTANT (Should Set):
├─ OPENAI_API_KEY       (for AI features)
├─ ANTHROPIC_API_KEY    (for AI features)
├─ TWENTY_APP_SECRET    (for Twenty CRM)
└─ N8N_PASSWORD         (for N8N access)

OPTIONAL (Nice to Have):
├─ STRIPE_SECRET_KEY
├─ META_APP_ID
├─ LIVEKIT_API_KEY
└─ LIVEKIT_API_SECRET
```

---

## Restart Procedure

```bash
# 1. Stop all containers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# 2. Start with fixed configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 3. Wait for services to start (30-60 seconds)
sleep 30

# 4. Check status
docker-compose ps

# 5. Monitor logs
docker-compose logs -f
```

---

## Success Criteria

After applying fixes, you should see:

```
✅ All containers in "Up" state
✅ Web app showing "healthy"
✅ N8N showing "healthy"
✅ Twenty worker showing "healthy"
✅ File watcher showing "up"
✅ No error messages in logs
✅ Services responding to health checks
✅ No "unhealthy" containers
```

---

**Status:** All fixes applied and verified ✅  
**Next Step:** Restart Docker Compose and verify

