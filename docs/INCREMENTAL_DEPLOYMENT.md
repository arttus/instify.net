# 🚀 Incremental Deployment Guide

This guide explains how to deploy changes to production without breaking everything or requiring full redeployment.

## 🎯 Overview

Instead of running the full `deploy-subdomains.sh` script every time (which breaks everything), we now have:

1. **Incremental update scripts** that only update what changed
2. **Automated CI/CD pipeline** via GitHub Actions
3. **Local deployment tools** for testing and manual deployment
4. **Rollback capabilities** for quick recovery

## 📋 Quick Reference

### Most Common Deployments

```bash
# 1. Code changes only (fastest - ~30 seconds)
./scripts/deploy-to-production.sh --code-only

# 2. n8n workflow/credential changes
./scripts/deploy-to-production.sh --n8n

# 3. Auto-detect what changed and deploy
./scripts/deploy-to-production.sh

# 4. Emergency rollback
./scripts/deploy-to-production.sh --rollback
```

## 🔄 Deployment Types

### 1. Code-Only Deployment (Recommended)
**When to use:** Web application code changes, configuration updates
**Time:** ~30 seconds
**Downtime:** ~5 seconds (rolling restart)

```bash
./scripts/deploy-to-production.sh --code-only
```

**What it does:**
- Pulls latest code from GitHub
- Restarts only the web container
- Preserves all other services

### 2. n8n Configuration Deployment
**When to use:** Workflow or credential changes
**Time:** ~1 minute
**Downtime:** None

```bash
./scripts/deploy-to-production.sh --n8n
```

**What it does:**
- Pulls latest code
- Imports new workflows and credentials
- No service restart needed

### 3. Container Deployment
**When to use:** Docker, package.json, or dependency changes
**Time:** ~5 minutes
**Downtime:** ~30 seconds

```bash
./scripts/deploy-to-production.sh --containers
```

**What it does:**
- Pulls latest code
- Rebuilds affected containers
- Rolling restart of updated services

### 4. Full Rebuild (Rare)
**When to use:** Major infrastructure changes
**Time:** ~10 minutes
**Downtime:** ~2 minutes

```bash
./scripts/deploy-to-production.sh --full
```

## 🤖 Automated Deployment (GitHub Actions)

### Automatic Deployment
Every push to `main` branch automatically triggers deployment:

- **Code changes** → Code-only deployment
- **Docker/package changes** → Container deployment  
- **n8n changes** → n8n-only deployment

### Manual Deployment
Go to GitHub Actions → "Deploy to Production" → "Run workflow"

Choose deployment type:
- `code-only` - Fastest, for code changes
- `containers` - For Docker/dependency changes
- `n8n-only` - For workflow changes
- `full-rebuild` - Complete rebuild

## 🛠️ Local Development Workflow

### 1. Make Changes Locally
```bash
# Make your changes
git add .
git commit -m "Your changes"
```

### 2. Test Before Deploying (Optional)
```bash
# See what would be deployed
./scripts/deploy-to-production.sh --dry-run
```

### 3. Deploy to Production
```bash
# Auto-detect and deploy
./scripts/deploy-to-production.sh

# Or specify deployment type
./scripts/deploy-to-production.sh --code-only
```

### 4. Verify Deployment
The script automatically verifies:
- ✅ Main app health check
- ✅ n8n health check
- ✅ Container status

## 🆘 Emergency Procedures

### Quick Rollback
```bash
./scripts/deploy-to-production.sh --rollback
```

### Manual Server Commands
```bash
# SSH into server
ssh deploy@167.71.86.216

# Quick service restart
cd /home/deploy/instify
docker-compose -f docker-compose.prod.yml restart instify-web

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs --tail=50 instify-web
```

### Service-Specific Restarts
```bash
# On production server
cd /home/deploy/instify
./scripts/update-production.sh --restart instify-web
./scripts/update-production.sh --restart n8n
./scripts/update-production.sh --restart instify-web,n8n,redis
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Main App:** https://instify.net/api/health
- **n8n:** https://n8n.instify.net/healthz

### Log Monitoring
```bash
# On production server
cd /home/deploy/instify

# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f instify-web
docker-compose -f docker-compose.prod.yml logs -f n8n
```

## 🔧 Configuration

### Environment Variables
Production environment variables are in `/home/deploy/instify/.env.production`

**Never edit directly!** Instead:
1. Update `.env.production.example` locally
2. Deploy with `--code-only`
3. SSH to server and update values manually if needed

### GitHub Secrets Required
For automated deployment, ensure these secrets are set in GitHub:

- `DEPLOY_SSH_KEY` - SSH private key for deploy user
- `SERVER_IP` - Production server IP (167.71.86.216)

## 🎯 Best Practices

### 1. Always Test Locally First
```bash
# Run local development server
npm run dev

# Test your changes thoroughly
```

### 2. Use Appropriate Deployment Type
- **Small code changes** → `--code-only`
- **New npm packages** → `--containers`
- **n8n workflows** → `--n8n`

### 3. Monitor After Deployment
- Check health endpoints
- Monitor logs for errors
- Verify functionality

### 4. Keep Deployments Small
- Deploy frequently with small changes
- Easier to debug and rollback
- Less risk of breaking things

## 🚨 Troubleshooting

### Deployment Fails
1. Check the error message
2. SSH to server and check logs
3. Try rolling back: `./scripts/deploy-to-production.sh --rollback`

### Service Won't Start
```bash
# SSH to server
ssh deploy@167.71.86.216
cd /home/deploy/instify

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check specific service logs
docker-compose -f docker-compose.prod.yml logs instify-web

# Restart specific service
docker-compose -f docker-compose.prod.yml restart instify-web
```

### Database Issues
```bash
# Check database connection
docker exec instify-postgres-prod pg_isready -U instify

# Access database
docker exec -it instify-postgres-prod psql -U instify -d instify
```

## 📈 Performance Tips

### Fastest Deployments
1. **Code-only** deployments are fastest (~30 seconds)
2. Use **auto-detection** to deploy only what changed
3. **Batch related changes** in single commits

### Minimize Downtime
1. Code-only deployments have minimal downtime
2. n8n deployments have zero downtime
3. Container deployments use rolling restarts

This incremental deployment system ensures you can push changes quickly and safely without breaking your production environment!
