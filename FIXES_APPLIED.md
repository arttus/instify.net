# Docker Compose Fixes Applied
**Date:** 2025-10-16  
**Status:** ✅ All critical fixes applied

---

## Summary of Changes

Four critical configuration issues have been identified and fixed in your Docker Compose setup:

---

## Fix #1: Twenty Worker npm Script ✅
**File:** `docker-compose.dev.yml` (line 238)  
**Severity:** CRITICAL

### Before:
```yaml
command: npm run worker:prod
```

### After:
```yaml
command: npm run worker
```

### Why:
The Twenty CRM package.json doesn't have a `worker:prod` script. The correct script is `worker`.

### Impact:
- ✅ Twenty worker will now start correctly
- ✅ Background jobs will process properly
- ✅ Container will transition from "starting" to "healthy"

---

## Fix #2: Web App Health Check Port ✅
**File:** `docker-compose.dev.yml` (lines 9-29)  
**Severity:** CRITICAL

### Before:
No health check override in dev config (inherited from main config using port 3000)

### After:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

### Why:
In development mode, the web app runs on port 3001, not 3000. The health check was failing because it was checking the wrong port.

### Impact:
- ✅ Web app health check will pass
- ✅ Container will show as "healthy" instead of "unhealthy"
- ✅ Dependent services can start properly

---

## Fix #3: Redis Eviction Policy ✅
**Files:** 
- `docker-compose.yml` (line 70)
- `docker-compose.dev.yml` (line 47)

**Severity:** MEDIUM

### Before:
```yaml
command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

### After:
```yaml
command: redis-server --maxmemory 256mb --maxmemory-policy noeviction
```

### Why:
Twenty CRM requires `noeviction` policy to prevent data loss. The `allkeys-lru` policy evicts keys when memory is full, which can cause data corruption.

### Impact:
- ✅ Eliminates "IMPORTANT! Eviction policy is allkeys-lru" warning
- ✅ Prevents potential data loss
- ✅ Ensures Twenty CRM stability

---

## Fix #4: N8N Health Check Authentication ✅
**File:** `docker-compose.yml` (line 196)  
**Severity:** HIGH

### Before:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5678/healthz"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### After:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "-u", "${N8N_USER:-admin}:${N8N_PASSWORD}", "http://localhost:5678/healthz"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

### Why:
N8N has basic authentication enabled. The health check endpoint requires credentials to respond successfully.

### Impact:
- ✅ N8N health check will pass
- ✅ Container will show as "healthy"
- ✅ File-watcher can start (depends on n8n being healthy)

---

## Next Steps

### 1. Restart Docker Compose
```bash
# Stop all containers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Start all containers with the fixes
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### 2. Verify Services Are Healthy
```bash
# Check container status
docker-compose ps

# Expected output:
# ✅ odeuo-web should be "healthy"
# ✅ odeuo-n8n should be "healthy"
# ✅ odeuo-twenty-worker should be "healthy"
# ✅ odeuo-file-watcher should be "up"
# ✅ odeuo-livekit-agents should be "up"
```

### 3. Monitor Logs
```bash
# Watch all logs
docker-compose logs -f

# Or specific service
docker-compose logs -f odeuo-twenty-worker
docker-compose logs -f odeuo-web
docker-compose logs -f n8n
```

### 4. Test Endpoints
```bash
# Web app
curl http://localhost:3001/api/health

# Twenty CRM
curl http://localhost:3002/health

# N8N (requires auth)
curl -u admin:${N8N_PASSWORD} http://localhost:5678/healthz

# PostgreSQL
psql -h localhost -U odeuo -d odeuo -c "SELECT 1"

# Redis
redis-cli -p 6379 ping
```

---

## Expected Results After Fixes

### Container Status
```
NAME                    STATUS              PORTS
odeuo-postgres          Up (healthy)        5432
odeuo-redis             Up (healthy)        6379
odeuo-nginx             Up (healthy)        80, 443
odeuo-twenty-server     Up (healthy)        3002
odeuo-twenty-worker     Up (healthy)        -
odeuo-web               Up (healthy)        3001, 3005, 9229
odeuo-n8n               Up (healthy)        5678
odeuo-file-watcher      Up                  8082
odeuo-pgadmin           Up                  8080
odeuo-redis-insight     Up                  -
odeuo-postgres-backup   Up (healthy)        -
```

### Service Availability
- ✅ Web App: http://localhost:3005 (or 3001 internally)
- ✅ Twenty CRM: http://localhost:3002
- ✅ N8N: http://localhost:5678
- ✅ PgAdmin: http://localhost:8080
- ✅ PostgreSQL: localhost:5432
- ✅ Redis: localhost:6379

---

## Troubleshooting

If services still don't start after applying fixes:

### Check logs for specific service:
```bash
docker-compose logs odeuo-twenty-worker --tail=50
docker-compose logs odeuo-web --tail=50
docker-compose logs n8n --tail=50
```

### Rebuild containers:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Check environment variables:
```bash
# Verify .env file exists and has required variables
cat .env | grep -E "DB_PASSWORD|REDIS_PASSWORD|N8N_PASSWORD|TWENTY_"
```

---

## Files Modified

1. ✅ `docker-compose.yml` - Fixed Redis policy and N8N health check
2. ✅ `docker-compose.dev.yml` - Fixed web app health check, Twenty worker script, and Redis policy

**No breaking changes** - All modifications are backward compatible.

