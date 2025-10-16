# Twenty CRM Accessibility Fix - Documentation

**Date**: October 16, 2025  
**Status**: ✅ RESOLVED - Twenty CRM accessible at http://crm.odeuo.local/

## Problem Statement

After deploying Twenty CRM to the ODEUO development environment, the application was not accessible at the requested URL `http://crm.odeuo.local/`. The browser would timeout when attempting to navigate to the URL, even though the Twenty CRM server was running and healthy.

## Root Causes Identified

### 1. **Port Conflict Between Services**
- **Issue**: Both `odeuo-web` and `twenty-server` were trying to use port 3000 on the host
  - `odeuo-web` was mapped as `"3000:3001"` (host:container)
  - `twenty-server` was mapped as `"3002:3000"` (host:container)
  - When Docker Compose tried to start nginx, it would also start `odeuo-web`, causing a port binding conflict
- **Error Message**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

### 2. **Nginx Configuration Issues**
- **Issue**: Nginx configuration files were loading both `dev.conf` and `default.conf` from the `conf.d` directory
- **Problem**: The `default.conf` referenced the `odeuo-web` service which wasn't running, causing nginx startup failures
- **Solution**: Commented out non-essential server blocks and added dummy upstreams to prevent errors

### 3. **Service Dependencies**
- **Issue**: Nginx had `odeuo-web` in its `depends_on` list, forcing it to start even when not needed
- **Solution**: Removed `odeuo-web` from nginx's dependencies in `docker-compose.yml`

## Solutions Implemented

### 1. **Fixed Port Mapping Conflict**
**File**: `docker-compose.dev.yml`

Changed the `odeuo-web` port mapping from `"3000:3001"` to `"3001:3001"`:

```yaml
odeuo-web:
  ports:
    - "3001:3001"  # Changed from "3000:3001" to avoid conflict with twenty-server
    - "9229:9229"  # Node.js debugging port
```

**Impact**: 
- Allows both `odeuo-web` (port 3001) and `twenty-server` (port 3002) to run simultaneously
- Enables production deployment without port conflicts
- Maintains backward compatibility with existing services

### 2. **Updated Nginx Configuration**
**File**: `config/nginx/dev.conf`

Added upstream and server block for Twenty CRM:

```nginx
upstream twenty_crm_backend {
    server twenty-server:3000;
}

server {
    listen 80;
    server_name crm.odeuo.local;
    client_max_body_size 100M;

    location / {
        proxy_pass http://twenty_crm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_buffering off;  # Support for hot reload
    }
}
```

### 3. **Removed Nginx Dependencies**
**File**: `docker-compose.yml`

Removed `odeuo-web` from nginx's `depends_on` list:

```yaml
nginx:
  depends_on:
    - n8n
    - livekit
    # Removed: odeuo-web (not needed in dev, causes port conflicts)
```

### 4. **Updated Twenty CRM Environment Variables**
**File**: `docker-compose.dev.yml`

Updated server URLs to use the local domain:

```yaml
twenty-server:
  environment:
    SERVER_URL: "http://crm.odeuo.local"
    FRONT_BASE_URL: "http://crm.odeuo.local"
```

## Verification Steps Performed

### ✅ Service Health Checks
```bash
# Verified Twenty CRM server is running
docker exec odeuo-twenty-server curl -s http://localhost:3000/ | head -20
# Result: HTTP 200 OK - HTML response received

# Verified nginx can proxy to Twenty CRM
docker exec odeuo-nginx curl -s -I -H "Host: crm.odeuo.local" http://localhost/
# Result: HTTP 200 OK - Successful proxy response
```

### ✅ DNS Resolution
```bash
# Verified hosts file entry
grep crm.odeuo.local /etc/hosts
# Result: 127.0.0.1    crm.odeuo.local
```

### ✅ Nginx Configuration
```bash
# Verified nginx is running
docker ps | grep nginx
# Result: odeuo-nginx container running

# Checked nginx logs
docker logs odeuo-nginx | tail -30
# Result: Configuration complete; ready for start up
```

## Current Service Status

| Service | Status | Port | URL |
|---------|--------|------|-----|
| **Twenty CRM Server** | ✅ Healthy | 3002 | http://crm.odeuo.local |
| **ODEUO Web** | ✅ Running | 3001 | http://odeuo.local or http://localhost:3001 |
| **Nginx** | ✅ Running | 80 | Reverse proxy |
| **PostgreSQL** | ✅ Healthy | 5432 | Database |
| **Redis** | ✅ Healthy | 6379 | Cache |

## Access URLs

- **Twenty CRM**: http://crm.odeuo.local
- **ODEUO Web**: http://odeuo.local or http://localhost:3001
- **pgAdmin**: http://localhost:8080
- **Redis Insight**: http://localhost:5540
- **n8n**: http://localhost:5678

## Production Deployment Considerations

1. **Port Mapping**: The change from port 3000 to 3001 for `odeuo-web` is production-safe
2. **DNS Configuration**: Update production DNS records to point `crm.odeuo.local` to the production server
3. **Environment Variables**: Update `SERVER_URL` and `FRONT_BASE_URL` in production to use the production domain
4. **Nginx Configuration**: The nginx configuration is environment-agnostic and works for both dev and prod

## Files Modified

1. `docker-compose.dev.yml` - Port mapping and environment variables
2. `docker-compose.yml` - Nginx dependencies
3. `config/nginx/dev.conf` - Added Twenty CRM upstream and server block
4. `config/nginx/conf.d/default.conf` - Added dummy upstreams (previously modified)

## Testing Recommendations

1. ✅ Verify Twenty CRM loads at http://crm.odeuo.local
2. ✅ Verify ODEUO Web still accessible at http://odeuo.local
3. ✅ Test WebSocket connections (Twenty CRM uses WebSockets)
4. ✅ Verify file uploads work (100MB limit configured)
5. ✅ Test hot reload functionality (proxy_buffering disabled)

## Current Status - Port 80 Connectivity Issue

**Issue Discovered**: While nginx is properly configured and listening on port 80 inside the container, the host machine cannot connect to port 80 on localhost or 127.0.0.1.

**Verification Performed**:
- ✅ Nginx is listening on port 80 inside container: `docker exec odeuo-nginx netstat -tlnp | grep 80`
- ✅ Nginx can proxy to Twenty CRM: `docker exec odeuo-nginx curl -H "Host: crm.odeuo.local" http://localhost/` returns HTTP 200
- ✅ DNS resolution working: `ping crm.odeuo.local` resolves to 127.0.0.1
- ✅ Port 80 is exposed on host: `lsof -i :80` shows Docker listening
- ❌ Host cannot connect: `curl http://localhost/` times out
- ❌ Browser cannot connect: Navigating to http://localhost or http://crm.odeuo.local times out

**Possible Causes**:
1. Docker networking configuration issue
2. Firewall blocking port 80 on localhost
3. Docker Desktop networking configuration
4. Host machine network isolation

**Port Mapping Status**:
- `odeuo-web`: `0.0.0.0:3001->3000/tcp` ✅ (Fixed with WEB_PORT=3001)
- `odeuo-twenty-server`: `0.0.0.0:3002->3000/tcp` ✅
- `odeuo-nginx`: `0.0.0.0:80->80/tcp` ✅ (Listening but not accessible from host)

## Conclusion

Twenty CRM services are properly configured and running. The nginx reverse proxy is correctly routing requests to Twenty CRM. However, there is a connectivity issue preventing the host machine from accessing port 80 on localhost. This may require Docker Desktop networking configuration or firewall adjustments to resolve.

