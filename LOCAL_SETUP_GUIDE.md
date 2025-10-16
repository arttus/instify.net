# ODEUO Local Development Setup Guide

This guide will help you set up ODEUO for local development with optional subdomain support.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
./setup.sh
```

The script will:
1. ✅ Check prerequisites (Docker, Docker Compose, OpenSSL)
2. ✅ Generate secure passwords and secrets
3. ✅ Ask if you want to use subdomains
4. ✅ Configure `/etc/hosts` (if using subdomains)
5. ✅ Create `.env` file with all configuration
6. ✅ Create necessary directories
7. ✅ Start all Docker services
8. ✅ Run database migrations
9. ✅ Seed development data

### Option 2: Manual Setup

If you prefer manual setup, follow the [Manual Setup](#manual-setup) section below.

## 🌐 Subdomain vs Port-Based Access

You can choose between two access methods:

### Subdomain-Based (Recommended)

**Advantages:**
- ✅ Clean URLs (e.g., `http://crm.odeuo.local`)
- ✅ Mimics production environment
- ✅ Better service isolation
- ✅ Easier to remember

**Access URLs:**
- Main App: `http://odeuo.local`
- n8n: `http://n8n.odeuo.local`
- Twenty CRM: `http://crm.odeuo.local`
- LiveKit: `http://livekit.odeuo.local`
- pgAdmin: `http://pgadmin.odeuo.local`
- Redis Insight: `http://redis.odeuo.local`

**Requirements:**
- Entries in `/etc/hosts` file (automated by setup script)

### Port-Based (Simpler)

**Advantages:**
- ✅ No `/etc/hosts` configuration needed
- ✅ Works immediately
- ✅ Simpler setup

**Access URLs:**
- Main App: `http://localhost:3001`
- n8n: `http://localhost:5678`
- Twenty CRM: `http://localhost:3002`
- LiveKit: `http://localhost:7880`
- pgAdmin: `http://localhost:5050`
- Redis Insight: `http://localhost:5540`

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **OpenSSL** (for generating secrets)
- **Git** (for cloning the repository)
- At least **4GB of available RAM**
- At least **10GB of available disk space**

### Check Prerequisites

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check OpenSSL
openssl version

# Check available resources
docker system df
```

## 🛠️ Manual Setup

If you prefer to set up manually:

### 1. Generate Secrets

```bash
# Generate database password
openssl rand -base64 32 | tr -d "=+/" | cut -c1-25

# Generate Redis password
openssl rand -base64 32 | tr -d "=+/" | cut -c1-25

# Generate app secrets
openssl rand -base64 64 | tr -d "=+/" | cut -c1-50
```

### 2. Create .env File

```bash
cp .env.example .env
nano .env
```

Update the following variables with your generated secrets:
- `DB_PASSWORD`
- `REDIS_PASSWORD`
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `TWENTY_DB_PASSWORD`
- `TWENTY_APP_SECRET`
- `N8N_ENCRYPTION_KEY`
- `LIVEKIT_API_SECRET`

### 3. Configure Subdomains (Optional)

If you want to use subdomains, add these entries to `/etc/hosts`:

```bash
sudo tee -a /etc/hosts << 'EOF'
# ODEUO Local Development
127.0.0.1 odeuo.local
127.0.0.1 n8n.odeuo.local
127.0.0.1 crm.odeuo.local
127.0.0.1 livekit.odeuo.local
127.0.0.1 pgadmin.odeuo.local
127.0.0.1 redis.odeuo.local
EOF
```

Update your `.env` file to use subdomain URLs:
```ini
DOMAIN=odeuo.local
NEXT_PUBLIC_APP_URL=http://odeuo.local
TWENTY_SERVER_URL=http://crm.odeuo.local
TWENTY_FRONT_BASE_URL=http://crm.odeuo.local
N8N_WEBHOOK_URL=http://n8n.odeuo.local
LIVEKIT_WS_URL=ws://livekit.odeuo.local:7880
```

### 4. Create Directories

```bash
mkdir -p logs/{nginx,postgres,web,n8n,twenty,twenty-worker} backups
```

### 5. Start Services

```bash
# Build and start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Watch logs
docker-compose logs -f
```

### 6. Run Migrations

```bash
# Wait for services to be ready (about 30 seconds)
sleep 30

# Run database migrations
docker-compose exec odeuo-web npm run db:migrate

# Seed development data
docker-compose exec odeuo-web npm run db:seed
```

## 🔍 Verify Installation

### Check Service Status

```bash
# View all services
docker-compose ps

# Check specific service
docker-compose ps odeuo-web
```

All services should show "Up" and "healthy" status.

### Test Access

**If using subdomains:**
```bash
# Test main app
curl http://odeuo.local/health

# Test Twenty CRM
curl http://crm.odeuo.local/health

# Test n8n
curl http://n8n.odeuo.local/healthz
```

**If using ports:**
```bash
# Test main app
curl http://localhost:3001/health

# Test Twenty CRM
curl http://localhost:3002/health

# Test n8n
curl http://localhost:5678/healthz
```

### Check Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f odeuo-web
docker-compose logs -f twenty-server
docker-compose logs -f n8n
```

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check Docker resources
docker system df

# Clean up unused resources
docker system prune -a

# Restart Docker daemon
sudo systemctl restart docker  # Linux
# or restart Docker Desktop on Mac/Windows
```

### Can't Access Subdomains

```bash
# Verify /etc/hosts entries
cat /etc/hosts | grep odeuo.local

# Test DNS resolution
ping odeuo.local

# Check nginx is running
docker-compose ps nginx
docker-compose logs nginx
```

### Database Connection Errors

```bash
# Check postgres is running
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "SELECT 1;"
```

### Port Conflicts

If you get port conflict errors:

```bash
# Check what's using the port
lsof -i :80    # nginx
lsof -i :5432  # postgres
lsof -i :6379  # redis

# Stop conflicting services or change ports in docker-compose.dev.yml
```

### Reset Everything

If you need to start fresh:

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
./setup.sh
```

## 🔧 Common Commands

```bash
# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Execute command in container
docker-compose exec odeuo-web npm run [command]

# Access database
docker-compose exec postgres psql -U odeuo -d odeuo_dev

# Access Redis CLI
docker-compose exec redis redis-cli

# Rebuild specific service
docker-compose build [service-name]

# Remove and rebuild
docker-compose up -d --build --force-recreate [service-name]
```

## 📚 Next Steps

1. **Configure API Keys**: Add your API keys to `.env` for:
   - Clerk (authentication)
   - OpenAI (AI features)
   - Twilio (communications)
   - Stripe (payments)

2. **Explore Services**:
   - Access the main app and create an account
   - Set up n8n workflows
   - Configure Twenty CRM
   - Test LiveKit voice features

3. **Development Workflow**:
   - Code changes in `web/` directory auto-reload
   - Database changes require migrations
   - Environment changes require service restart

4. **Read Documentation**:
   - [Twenty CRM Setup](TWENTY_SETUP_GUIDE.md)
   - [Twenty Quick Reference](TWENTY_QUICK_REFERENCE.md)
   - [Production Deployment](deploy-subdomains.sh)

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Review this guide's troubleshooting section
3. Check service-specific documentation
4. Verify your `.env` configuration
5. Ensure all prerequisites are met

## 🎉 Success!

Once everything is running, you should be able to access all services and start developing!

**Subdomain Access:**
- Main App: http://odeuo.local
- n8n: http://n8n.odeuo.local
- Twenty CRM: http://crm.odeuo.local

**Port Access:**
- Main App: http://localhost:3001
- n8n: http://localhost:5678
- Twenty CRM: http://localhost:3002

Happy coding! 🚀

