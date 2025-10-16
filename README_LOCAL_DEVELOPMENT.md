# ODEUO Local Development Environment

<div align="center">

**Complete local development setup with subdomain support**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📖 Overview

ODEUO local development environment provides a complete, production-like setup on your local machine with:

- ✅ **Subdomain Support** - Clean URLs like `http://crm.odeuo.local`
- ✅ **Hot Reload** - Instant code changes without rebuilds
- ✅ **Full Stack** - All services running locally
- ✅ **Easy Setup** - Automated configuration script
- ✅ **Docker-Based** - Consistent across all platforms

## 🚀 Quick Start

### One-Command Setup

```bash
./setup.sh
```

That's it! The script will:
1. ✅ Check prerequisites
2. ✅ Ask if you want subdomains
3. ✅ Generate secure secrets
4. ✅ Configure `/etc/hosts` (if using subdomains)
5. ✅ Create `.env` file
6. ✅ Start all services
7. ✅ Run database migrations
8. ✅ Seed development data

### Access Your Services

**With Subdomains:**
- Main App: http://odeuo.local
- n8n: http://n8n.odeuo.local
- Twenty CRM: http://crm.odeuo.local
- LiveKit: http://livekit.odeuo.local
- pgAdmin: http://pgadmin.odeuo.local
- Redis Insight: http://redis.odeuo.local

**Without Subdomains:**
- Main App: http://localhost:3001
- n8n: http://localhost:5678
- Twenty CRM: http://localhost:3002
- LiveKit: http://localhost:7880
- pgAdmin: http://localhost:5050
- Redis Insight: http://localhost:5540

## ✨ Features

### Development Experience
- 🔥 **Hot Reload** - Code changes reflect instantly
- 🌐 **Subdomain Routing** - Production-like URLs
- 🐳 **Docker Compose** - Consistent environment
- 📝 **Auto-Generated Secrets** - Secure by default
- 🔍 **Health Checks** - Monitor service status
- 📊 **Admin Tools** - pgAdmin, Redis Insight included

### Services Included
- **ODEUO Web** - Main Next.js application
- **n8n** - Workflow automation platform
- **Twenty CRM** - Open-source CRM
- **LiveKit** - Voice AI server
- **PostgreSQL** - Primary database
- **Redis** - Cache and queue
- **pgAdmin** - Database management
- **Redis Insight** - Redis management
- **Nginx** - Reverse proxy with subdomain routing

## 📋 Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **OpenSSL** (for generating secrets)
- **4GB RAM** minimum
- **10GB Disk Space** minimum

### Check Prerequisites

```bash
docker --version
docker-compose --version
openssl version
```

## 🛠️ Setup Options

### Option 1: Automated Setup (Recommended)

```bash
./setup.sh
```

### Option 2: Manual Setup

See [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for detailed manual setup instructions.

## 🌐 Subdomain vs Port Access

### Subdomain Access (Recommended)

**Advantages:**
- ✅ Clean, memorable URLs
- ✅ Production-like environment
- ✅ Better service isolation
- ✅ Easier webhook configuration

**Requirements:**
- Entries in `/etc/hosts` (automated by setup script)

### Port Access (Simpler)

**Advantages:**
- ✅ No `/etc/hosts` configuration
- ✅ Works immediately
- ✅ Simpler setup

**Access:**
- Direct port access always works alongside subdomains

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Developer Machine                     │
│                  /etc/hosts → 127.0.0.1                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Nginx (Port 80)                            │
│              Subdomain Router                           │
└──┬──────┬──────┬──────┬──────┬──────┬──────────────────┘
   │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼
┌────┐ ┌───┐ ┌─────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Web │ │n8n│ │Twenty│ │LiveKit│ │pgAdmin│ │Redis │
└─┬──┘ └─┬─┘ └──┬──┘ └───┬──┘ └───┬──┘ └───┬──┘
  │      │      │        │        │        │
  └──────┴──────┴────────┴────────┴────────┘
                 │
         ┌───────┴────────┐
         ▼                ▼
    ┌─────────┐      ┌────────┐
    │PostgreSQL│      │ Redis  │
    └─────────┘      └────────┘
```

## 🔧 Common Commands

```bash
# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop services
docker-compose stop

# View logs
docker-compose logs -f

# Restart service
docker-compose restart [service-name]

# Access database
docker-compose exec postgres psql -U odeuo -d odeuo_dev

# Run migrations
docker-compose exec odeuo-web npm run db:migrate

# Rebuild service
docker-compose build [service-name]
docker-compose up -d [service-name]
```

For more commands, see [LOCAL_DEV_QUICK_REFERENCE.md](LOCAL_DEV_QUICK_REFERENCE.md)

## 🐛 Troubleshooting

### Can't Access Subdomains

```bash
# Check /etc/hosts
cat /etc/hosts | grep odeuo.local

# Add entries if missing
sudo tee -a /etc/hosts << 'EOF'
127.0.0.1 odeuo.local
127.0.0.1 n8n.odeuo.local
127.0.0.1 crm.odeuo.local
127.0.0.1 livekit.odeuo.local
127.0.0.1 pgadmin.odeuo.local
127.0.0.1 redis.odeuo.local
EOF
```

### Services Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check resources
docker system df

# Clean up
docker system prune -a
```

### Database Connection Errors

```bash
# Check postgres
docker-compose ps postgres
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "SELECT 1;"
```

For more troubleshooting, see [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md#troubleshooting)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[LOCAL_SETUP_SUMMARY.md](LOCAL_SETUP_SUMMARY.md)** | Setup summary and quick verification |
| **[LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)** | Comprehensive setup guide |
| **[LOCAL_DEV_QUICK_REFERENCE.md](LOCAL_DEV_QUICK_REFERENCE.md)** | Quick command reference |
| **[TWENTY_SETUP_GUIDE.md](TWENTY_SETUP_GUIDE.md)** | Twenty CRM setup guide |
| **[TWENTY_QUICK_REFERENCE.md](TWENTY_QUICK_REFERENCE.md)** | Twenty quick reference |
| **[README_TWENTY_CRM.md](README_TWENTY_CRM.md)** | Twenty integration README |

## 🎯 Development Workflow

### 1. Start Development

```bash
# Start all services
./setup.sh

# Or manually
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### 2. Make Changes

- Edit code in `web/` directory
- Changes auto-reload in browser
- No rebuild needed for code changes

### 3. Database Changes

```bash
# Create migration
docker-compose exec odeuo-web npm run db:migrate:create

# Run migrations
docker-compose exec odeuo-web npm run db:migrate
```

### 4. Environment Changes

```bash
# Edit .env file
nano .env

# Restart services
docker-compose restart
```

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f odeuo-web
```

## 🔐 Security

- ✅ Auto-generated secure passwords
- ✅ `.env` file gitignored
- ✅ Isolated database credentials
- ✅ Docker network isolation
- ⚠️ Development mode has relaxed security for convenience

## 🚢 Production Deployment

For production deployment with subdomains:

```bash
./deploy-subdomains.sh --domain your-domain.com --email your@email.com
```

See [deploy-subdomains.sh](deploy-subdomains.sh) for details.

## 🆘 Getting Help

1. **Check Documentation**
   - Start with [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)
   - Use [LOCAL_DEV_QUICK_REFERENCE.md](LOCAL_DEV_QUICK_REFERENCE.md) for commands

2. **Check Logs**
   ```bash
   docker-compose logs -f
   ```

3. **Verify Setup**
   ```bash
   docker-compose ps
   cat /etc/hosts | grep odeuo.local
   ```

4. **Reset Everything**
   ```bash
   docker-compose down -v
   ./setup.sh
   ```

## 🎉 What's Next?

1. **Configure API Keys**
   - Edit `.env` file
   - Add Clerk, OpenAI, Twilio, Stripe keys

2. **Explore Services**
   - Access main app at http://odeuo.local
   - Set up n8n workflows
   - Configure Twenty CRM
   - Test LiveKit voice features

3. **Start Building**
   - Create new features
   - Test integrations
   - Build workflows
   - Manage data

## 📊 Service Status

Check service health:

```bash
# All services
docker-compose ps

# Health checks
curl http://odeuo.local/health
curl http://crm.odeuo.local/health
curl http://n8n.odeuo.local/healthz
```

## 🔄 Updates

```bash
# Pull latest code
git pull

# Rebuild services
docker-compose build

# Restart with new code
docker-compose up -d
```

---

<div align="center">

**Ready to start developing?**

Run `./setup.sh` and access your app at **http://odeuo.local**

[Setup Guide](LOCAL_SETUP_GUIDE.md) • [Quick Reference](LOCAL_DEV_QUICK_REFERENCE.md) • [Troubleshooting](LOCAL_SETUP_GUIDE.md#troubleshooting)

</div>

