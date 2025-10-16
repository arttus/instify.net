# ODEUO Local Development Setup - Summary

## ✅ What Has Been Configured

Your ODEUO local development environment is now fully configured with **subdomain support**! Here's what's ready:

### 1. Setup Script (`setup.sh`)

**Enhanced Features:**
- ✅ Interactive subdomain configuration
- ✅ Automatic `/etc/hosts` configuration
- ✅ Secure password and secret generation
- ✅ Environment file creation with subdomain URLs
- ✅ Directory structure creation
- ✅ Automated service startup
- ✅ Database migration and seeding

**Usage:**
```bash
./setup.sh          # Interactive setup with subdomain option
./setup.sh local    # Same as above
```

### 2. Nginx Configuration (`config/nginx/dev.conf`)

**Subdomain Routing:**
- ✅ Main App: `odeuo.local` → `odeuo-web:3000`
- ✅ n8n: `n8n.odeuo.local` → `n8n:5678`
- ✅ Twenty CRM: `crm.odeuo.local` → `twenty-server:3000`
- ✅ LiveKit: `livekit.odeuo.local` → `livekit:7880`
- ✅ pgAdmin: `pgadmin.odeuo.local` → `pgadmin:80`
- ✅ Redis Insight: `redis.odeuo.local` → `redis-insight:5540`

**Features:**
- ✅ WebSocket support for real-time features
- ✅ Hot reload support for Next.js
- ✅ Proper proxy headers
- ✅ 100MB file upload limit
- ✅ Health check endpoints

### 3. Docker Compose (`docker-compose.dev.yml`)

**Already Configured:**
- ✅ All services with proper networking
- ✅ Volume mounts for hot reload
- ✅ Health checks for all services
- ✅ Port mappings for direct access
- ✅ Environment variable support
- ✅ Twenty CRM integration

### 4. Documentation

**Created:**
- ✅ `LOCAL_SETUP_GUIDE.md` - Comprehensive setup guide
- ✅ `LOCAL_DEV_QUICK_REFERENCE.md` - Quick reference card
- ✅ `LOCAL_SETUP_SUMMARY.md` - This summary document

**Already Exists:**
- ✅ `TWENTY_SETUP_GUIDE.md` - Twenty CRM setup
- ✅ `TWENTY_QUICK_REFERENCE.md` - Twenty quick reference
- ✅ `README_TWENTY_CRM.md` - Twenty integration README

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
./setup.sh
```

**The script will:**
1. Check prerequisites
2. Ask if you want subdomains
3. Generate secure secrets
4. Configure `/etc/hosts` (if using subdomains)
5. Create `.env` file
6. Start all services
7. Run migrations

### Option 2: Manual Setup

```bash
# 1. Generate secrets and create .env
cp .env.example .env
# Edit .env with your secrets

# 2. Configure subdomains (optional)
sudo tee -a /etc/hosts << 'EOF'
127.0.0.1 odeuo.local
127.0.0.1 n8n.odeuo.local
127.0.0.1 crm.odeuo.local
127.0.0.1 livekit.odeuo.local
127.0.0.1 pgadmin.odeuo.local
127.0.0.1 redis.odeuo.local
EOF

# 3. Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# 4. Run migrations
docker-compose exec odeuo-web npm run db:migrate
docker-compose exec odeuo-web npm run db:seed
```

## 🌐 Access Your Services

### Subdomain Access (Recommended)

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://odeuo.local | Your main application |
| **n8n** | http://n8n.odeuo.local | Workflow automation |
| **Twenty CRM** | http://crm.odeuo.local | CRM platform |
| **LiveKit** | http://livekit.odeuo.local | Voice AI server |
| **pgAdmin** | http://pgadmin.odeuo.local | Database management |
| **Redis Insight** | http://redis.odeuo.local | Redis management |

### Port Access (Always Works)

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://localhost:3001 | Direct port access |
| **n8n** | http://localhost:5678 | Direct port access |
| **Twenty CRM** | http://localhost:3002 | Direct port access |
| **LiveKit** | http://localhost:7880 | Direct port access |
| **pgAdmin** | http://localhost:5050 | Direct port access |
| **Redis Insight** | http://localhost:5540 | Direct port access |
| **PostgreSQL** | localhost:5432 | Database connection |
| **Redis** | localhost:6379 | Redis connection |

## 🔍 Verification Steps

### 1. Check Service Status

```bash
docker-compose ps
```

All services should show "Up" and "healthy".

### 2. Test Subdomain Access

```bash
# Test main app
curl http://odeuo.local/health

# Test Twenty CRM
curl http://crm.odeuo.local/health

# Test n8n
curl http://n8n.odeuo.local/healthz
```

### 3. Check Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f odeuo-web
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

# Access database
docker-compose exec postgres psql -U odeuo -d odeuo_dev

# Run migrations
docker-compose exec odeuo-web npm run db:migrate

# Rebuild service
docker-compose build [service-name]
docker-compose up -d [service-name]
```

## 🐛 Troubleshooting

### Can't Access Subdomains

```bash
# Check /etc/hosts
cat /etc/hosts | grep odeuo.local

# Add if missing
sudo tee -a /etc/hosts << 'EOF'
127.0.0.1 odeuo.local
127.0.0.1 n8n.odeuo.local
127.0.0.1 crm.odeuo.local
127.0.0.1 livekit.odeuo.local
127.0.0.1 pgadmin.odeuo.local
127.0.0.1 redis.odeuo.local
EOF

# Test DNS
ping odeuo.local
```

### Services Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check resources
docker system df

# Restart Docker
sudo systemctl restart docker  # Linux
# or restart Docker Desktop
```

### Database Connection Errors

```bash
# Check postgres
docker-compose ps postgres
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "SELECT 1;"
```

### Port Conflicts

```bash
# Check what's using the port
lsof -i :80
lsof -i :5432

# Stop conflicting service or change port in docker-compose.dev.yml
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)** | Detailed setup instructions |
| **[LOCAL_DEV_QUICK_REFERENCE.md](LOCAL_DEV_QUICK_REFERENCE.md)** | Quick command reference |
| **[TWENTY_SETUP_GUIDE.md](TWENTY_SETUP_GUIDE.md)** | Twenty CRM setup guide |
| **[TWENTY_QUICK_REFERENCE.md](TWENTY_QUICK_REFERENCE.md)** | Twenty quick reference |
| **[README_TWENTY_CRM.md](README_TWENTY_CRM.md)** | Twenty integration README |

## 🎯 Next Steps

1. **Run Setup Script**
   ```bash
   ./setup.sh
   ```

2. **Access Services**
   - Open http://odeuo.local in your browser
   - Create an account
   - Explore the features

3. **Configure API Keys**
   - Edit `.env` file
   - Add your API keys for:
     - Clerk (authentication)
     - OpenAI (AI features)
     - Twilio (communications)
     - Stripe (payments)

4. **Start Developing**
   - Code changes auto-reload
   - Database changes require migrations
   - Environment changes require restart

5. **Explore Services**
   - Set up n8n workflows
   - Configure Twenty CRM
   - Test LiveKit voice features
   - Use pgAdmin for database management

## 🎉 Benefits of Subdomain Setup

### Development Experience
- ✅ **Clean URLs**: Easy to remember and share
- ✅ **Production-like**: Mimics production environment
- ✅ **Service Isolation**: Each service has its own domain
- ✅ **No Port Confusion**: No need to remember port numbers

### Technical Benefits
- ✅ **Cookie Isolation**: Better security testing
- ✅ **CORS Testing**: Test cross-origin scenarios
- ✅ **Webhook Testing**: Easier webhook configuration
- ✅ **SSL Ready**: Easy to add SSL for local HTTPS

## 🔐 Security Notes

- ✅ All secrets are generated securely
- ✅ `.env` file is gitignored
- ✅ Database credentials are isolated
- ✅ Services communicate via Docker network
- ⚠️ Development mode has relaxed security for convenience

## 🆘 Getting Help

If you need assistance:

1. **Check Documentation**
   - [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)
   - [LOCAL_DEV_QUICK_REFERENCE.md](LOCAL_DEV_QUICK_REFERENCE.md)

2. **Check Logs**
   ```bash
   docker-compose logs -f
   ```

3. **Verify Configuration**
   ```bash
   docker-compose ps
   cat /etc/hosts | grep odeuo.local
   ```

4. **Reset and Retry**
   ```bash
   docker-compose down -v
   ./setup.sh
   ```

---

## ✨ Status: Ready to Use!

Your local development environment is fully configured and ready to use!

**Run this to get started:**
```bash
./setup.sh
```

Then access your app at: **http://odeuo.local** or **http://localhost:3001**

Happy coding! 🚀

