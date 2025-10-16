# Twenty CRM Integration for ODEUO

<div align="center">

![Twenty CRM](https://twenty.com/images/core/logo.svg)

**Open-source CRM platform integrated into ODEUO**

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Troubleshooting](#-troubleshooting) • [Support](#-support)

</div>

---

## 📖 Overview

Twenty CRM is now fully integrated into your ODEUO development environment. This integration provides:

- ✅ **Contact Management** - Manage contacts and companies
- ✅ **Deal Tracking** - Track sales pipeline and opportunities
- ✅ **Task Management** - Organize tasks and activities
- ✅ **API Access** - REST and GraphQL APIs
- ✅ **Automation Ready** - Integrate with n8n workflows
- ✅ **Self-Hosted** - Full control over your data

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script to configure everything automatically:

```bash
./scripts/setup-twenty.sh
```

This will:
1. ✅ Check/create your `.env` file
2. ✅ Generate secure secrets
3. ✅ Configure local DNS (optional)
4. ✅ Build PostgreSQL container
5. ✅ Start all services
6. ✅ Wait for Twenty to be ready

### Option 2: Manual Setup

If you prefer manual setup:

```bash
# 1. Configure environment variables
cp .env.example .env
nano .env  # Add Twenty configuration

# 2. Generate secrets
openssl rand -base64 32  # For TWENTY_DB_PASSWORD
openssl rand -base64 32  # For TWENTY_APP_SECRET

# 3. Add to /etc/hosts (optional)
echo "127.0.0.1 crm.odeuo.local" | sudo tee -a /etc/hosts

# 4. Build and start
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build postgres
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 5. Watch logs
docker-compose logs -f twenty-server
```

## 🌐 Access Twenty CRM

Once running, access Twenty CRM at:

| Method | URL | Notes |
|--------|-----|-------|
| **Subdomain** | http://crm.odeuo.local | Requires `/etc/hosts` configuration |
| **Direct Port** | http://localhost:3002 | Always works |
| **REST API** | http://crm.odeuo.local/rest | API endpoint |
| **GraphQL** | http://crm.odeuo.local/graphql | GraphQL Playground |

## 📋 Required Configuration

Add these to your `.env` file:

```ini
# Twenty CRM Configuration
TWENTY_DB_USER=twenty
TWENTY_DB_PASSWORD=<your-secure-password>
TWENTY_DB_NAME=twenty
TWENTY_APP_SECRET=<your-secure-secret>
TWENTY_SERVER_URL=http://crm.odeuo.local
TWENTY_FRONT_BASE_URL=http://crm.odeuo.local
TWENTY_LOG_LEVEL=debug
```

**Generate secure values:**
```bash
openssl rand -base64 32
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[TWENTY_CRM_SETUP_SUMMARY.md](TWENTY_CRM_SETUP_SUMMARY.md)** | Complete setup summary and verification |
| **[TWENTY_SETUP_GUIDE.md](TWENTY_SETUP_GUIDE.md)** | Detailed setup instructions |
| **[TWENTY_QUICK_REFERENCE.md](TWENTY_QUICK_REFERENCE.md)** | Quick reference card |
| **[TWENTY_INTEGRATION.md](TWENTY_INTEGRATION.md)** | Integration with other services |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Web Browser                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Nginx (crm.odeuo.local)                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│           Twenty Server (Port 3002)                     │
│           - REST & GraphQL API                          │
│           - Web UI                                      │
└──────┬──────────────────────────────────┬───────────────┘
       │                                  │
       ▼                                  ▼
┌──────────────┐                  ┌──────────────────────┐
│ PostgreSQL   │                  │      Redis           │
│ DB: twenty   │                  │  Cache & Queues      │
└──────┬───────┘                  └──────┬───────────────┘
       │                                  │
       └──────────────┬───────────────────┘
                      │
                      ▼
           ┌──────────────────────┐
           │   Twenty Worker      │
           │   Background Jobs    │
           └──────────────────────┘
```

## 🔧 Common Commands

### Service Management
```bash
# Start Twenty
docker-compose up -d twenty-server twenty-worker

# Stop Twenty
docker-compose stop twenty-server twenty-worker

# Restart Twenty
docker-compose restart twenty-server twenty-worker

# View status
docker-compose ps twenty-server twenty-worker
```

### Logs
```bash
# View server logs
docker-compose logs -f twenty-server

# View worker logs
docker-compose logs -f twenty-worker
```

### Database
```bash
# Access database
docker-compose exec postgres psql -U twenty -d twenty

# Run migrations
docker-compose exec twenty-server npm run database:migrate
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Check logs
docker-compose logs twenty-server --tail=100

# Verify database
docker-compose exec postgres psql -U twenty -d twenty -c "SELECT 1;"
```

### Can't access via subdomain
```bash
# Check /etc/hosts
cat /etc/hosts | grep crm.odeuo.local

# Add if missing
echo "127.0.0.1 crm.odeuo.local" | sudo tee -a /etc/hosts
```

### Database errors
```bash
# Rebuild postgres
docker-compose build postgres

# Restart services
docker-compose down
docker-compose up -d
```

**For more troubleshooting**, see [TWENTY_SETUP_GUIDE.md](TWENTY_SETUP_GUIDE.md#troubleshooting)

## 🔗 Integration Examples

### With n8n Automation

Create automated workflows in n8n:

1. Access n8n: http://n8n.odeuo.local
2. Add Twenty credentials
3. Create workflows to:
   - Auto-create contacts from forms
   - Sync with external systems
   - Send notifications
   - Update deal stages

### API Usage

**REST API Example:**
```bash
curl http://crm.odeuo.local/rest/contacts
```

**GraphQL Example:**
```bash
curl -X POST http://crm.odeuo.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ people { edges { node { id firstName lastName } } } }"}'
```

## 📊 Features

- **Contacts** - Manage people and their information
- **Companies** - Track organizations and relationships
- **Deals** - Manage sales pipeline and opportunities
- **Tasks** - Organize activities and to-dos
- **Notes** - Add context and documentation
- **Custom Fields** - Extend with your own data
- **Views** - Create custom table and kanban views
- **API** - REST and GraphQL access
- **Webhooks** - Real-time event notifications
- **Integrations** - Connect with other tools

## 🔐 Security

- ✅ Isolated database credentials
- ✅ JWT token authentication
- ✅ Secure secrets from environment
- ✅ No hardcoded passwords
- ⚠️ For production: Use HTTPS and stronger security

## 🆘 Support

Need help?

1. **Check Documentation**
   - [Setup Guide](TWENTY_SETUP_GUIDE.md)
   - [Quick Reference](TWENTY_QUICK_REFERENCE.md)
   - [Setup Summary](TWENTY_CRM_SETUP_SUMMARY.md)

2. **Official Resources**
   - [Twenty Documentation](https://twenty.com/developers)
   - [Twenty GitHub](https://github.com/twentyhq/twenty)
   - [Twenty Discord](https://discord.gg/cx5n4Jzs57)

3. **Run Diagnostics**
   ```bash
   # Check service status
   docker-compose ps | grep twenty
   
   # Check health
   curl http://localhost:3002/health
   
   # View logs
   docker-compose logs twenty-server --tail=50
   ```

## 🎯 Next Steps

1. ✅ **Complete Setup** - Run `./scripts/setup-twenty.sh`
2. 🌐 **Access Twenty** - Open http://crm.odeuo.local
3. 👤 **Create Account** - Set up your workspace
4. 📇 **Add Contacts** - Start managing your CRM data
5. 🔄 **Integrate** - Connect with n8n and other services
6. 🎨 **Customize** - Configure fields and views

## 📝 What's Included

This integration includes:

- ✅ Twenty Server (API + Web UI)
- ✅ Twenty Worker (Background jobs)
- ✅ PostgreSQL database setup
- ✅ Redis cache configuration
- ✅ Nginx reverse proxy
- ✅ Automated setup script
- ✅ Comprehensive documentation
- ✅ Health checks and monitoring
- ✅ Log management
- ✅ Data persistence

## 🎉 Ready to Use!

Your Twenty CRM is ready to go. Run the setup script to get started:

```bash
./scripts/setup-twenty.sh
```

Then access Twenty at: **http://crm.odeuo.local** or **http://localhost:3002**

---

<div align="center">

**Made with ❤️ for ODEUO**

[Documentation](TWENTY_SETUP_GUIDE.md) • [Quick Reference](TWENTY_QUICK_REFERENCE.md) • [Twenty.com](https://twenty.com)

</div>

