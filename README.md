# ODEUO Infrastructure

> **Multi-tenant B2B SaaS infrastructure for AI-powered customer engagement automation**

This repository contains the complete Docker-based infrastructure for ODEUO, a platform that provides AI-powered automation for customer engagement across Instagram DMs, SMS, WhatsApp, and voice channels.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│   Single 4GB DigitalOcean Droplet ($24/mo)  │
├─────────────────────────────────────────────┤
│                                             │
│   Nginx (SSL + Reverse Proxy)              │
│         │                                   │
│    ┌────┴────┬──────────┬──────────┐      │
│    │         │          │          │       │
│  Next.js  Livekit    n8n      Postgres    │
│  (3000)   (7880)   (5678)    (5432)       │
│            │                    │          │
│         Redis                Backups      │
│        (6379)              (Daily)        │
│                                             │
└─────────────────────────────────────────────┘
```

**Capacity:**
- **Supports:** 10-20 clients comfortably
- **Conversations:** ~5,000-10,000/day
- **Database:** 10GB+
- **Cost:** $39/mo total

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- DigitalOcean account (for production)
- Domain name with DNS access

### Local Development Setup

1. **Quick setup (recommended):**
   ```bash
   cd odeuo.net
   npm install
   ./setup.sh local
   ```

   This will:
   - Generate secure passwords automatically
   - Create `.env` with all required settings
   - Start Docker services
   - Run database migrations
   - Seed development data

2. **Manual setup (alternative):**
   ```bash
   npm run setup:local  # Creates .env template
   # Edit .env with your API keys
   npm run dev          # Start services
   ```

3. **Access services:**
   - **Main App:** http://localhost
   - **n8n Admin:** http://localhost/n8n
   - **pgAdmin:** http://localhost/pgadmin (admin@odeuo.com / admin)
   - **RedisInsight:** http://localhost/redis
   - **Health Check:** http://localhost/health

### Production Deployment

1. **Prepare environment:**
   ```bash
   ./setup.sh production
   # Edit .env.production with your actual API keys and domain
   ```

2. **Deploy to DigitalOcean:**
   ```bash
   ./scripts/deploy.sh
   ```

3. **Verify deployment:**
   ```bash
   ./scripts/health-check.sh
   ```

## 📋 Services

| Service | Port | Purpose | Health Check |
|---------|------|---------|--------------|
| **Nginx** | 80/443 | Reverse proxy, SSL termination | `/health` |
| **Next.js** | 3000 | Web application | `/api/health` |
| **PostgreSQL** | 5432 | Primary database | `pg_isready` |
| **Redis** | 6379 | Cache and message queue | `PING` |
| **n8n** | 5678 | Workflow automation | `/healthz` |
| **Livekit** | 7880 | Voice/video AI | `/` |

## 🗄️ Database Schema

Multi-tenant architecture with row-level tenant isolation:

- **`tenants`** - Client organizations (linked to Clerk)
- **`users`** - Users within organizations
- **`conversations`** - Customer conversations across platforms
- **`messages`** - Individual messages in conversations
- **`leads`** - Qualified leads with scoring
- **`voice_calls`** - Livekit voice session records
- **`workflows`** - n8n automation tracking
- **`usage_metrics`** - Billing and usage data

### Database Operations

```bash
# Generate migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Open database GUI
npm run db:studio

# Reset database (dev only)
npm run db:reset
```

## 🔧 Configuration

### Environment Variables

Three environment configurations are provided:

- **`.env.local.example`** - Local development
- **`.env.example`** - General template
- **`.env.production.example`** - Production deployment

### Required External Services

| Service | Purpose | Required For |
|---------|---------|--------------|
| **Clerk** | Authentication & organizations | User management |
| **Stripe** | Payment processing | Billing (optional for MVP) |
| **OpenAI** | GPT models | AI conversations |
| **Anthropic** | Claude models | AI conversations |
| **Twilio** | SMS messaging | SMS automation |
| **Meta/Instagram** | Instagram DMs | Instagram automation |
| **DigitalOcean Spaces** | File storage & backups | Production |

## 🛠️ Management Scripts

### Deployment
```bash
./scripts/deploy.sh          # Full production deployment
```

### Backup Management
```bash
./scripts/backup.sh create   # Create backup
./scripts/backup.sh restore backup_name  # Restore backup
./scripts/backup.sh list     # List all backups
./scripts/backup.sh cleanup  # Clean old backups
./scripts/backup.sh sync     # Sync to remote storage
```

### Health Monitoring
```bash
./scripts/health-check.sh full   # Comprehensive health check
./scripts/health-check.sh quick  # Quick critical services check
```

### Log Management
```bash
./scripts/logs.sh all        # Show all logs
./scripts/logs.sh service postgres  # Show specific service logs
./scripts/logs.sh errors     # Show only errors
./scripts/logs.sh search "database error"  # Search logs
./scripts/logs.sh export     # Export logs to file
```

## 📊 Monitoring (Optional)

Enable comprehensive monitoring stack:

```bash
# Start with monitoring
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Access monitoring tools
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# AlertManager: http://localhost:9093
# Uptime Kuma: http://localhost:3002
```

### Monitoring Stack

- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards
- **Loki** - Log aggregation
- **AlertManager** - Alert routing
- **Uptime Kuma** - Uptime monitoring

## 🔒 Security

### Production Security Checklist

- [ ] SSL certificates configured (Let's Encrypt)
- [ ] Firewall rules applied (ports 22, 80, 443 only)
- [ ] Strong passwords for all services
- [ ] API keys stored securely
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Backup encryption enabled

### Multi-Tenant Security

- Row-level tenant isolation in database
- Middleware-enforced tenant context
- API authentication via Clerk
- Webhook signature verification
- Rate limiting on all endpoints

## 🚨 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker status
docker compose ps

# View service logs
docker compose logs service-name

# Restart specific service
docker compose restart service-name
```

**Database connection issues:**
```bash
# Test database connection
docker compose exec postgres pg_isready -U odeuo

# Check database logs
docker compose logs postgres

# Reset database (dev only)
npm run db:reset
```

**SSL certificate issues:**
```bash
# Check certificate expiry
docker compose exec nginx openssl x509 -in /etc/nginx/ssl/cert.pem -noout -dates

# Renew certificate
certbot renew --nginx
```

### Performance Tuning

**High memory usage:**
- Adjust PostgreSQL `shared_buffers` in `config/postgres/postgresql.conf`
- Reduce Redis memory limit in Docker Compose
- Enable log rotation

**Slow database queries:**
- Check `pg_stat_statements` for slow queries
- Add database indexes as needed
- Optimize Drizzle ORM queries

**High CPU usage:**
- Scale horizontally with multiple droplets
- Optimize AI model usage
- Implement request caching

## 📈 Scaling

### Horizontal Scaling (Phase 2)

When ready to scale beyond single droplet:

1. **Load Balancer Setup:**
   - DigitalOcean Load Balancer
   - Multiple web application droplets
   - Shared database and Redis

2. **Database Scaling:**
   - Read replicas for reporting
   - Connection pooling (PgBouncer)
   - Database partitioning by tenant

3. **Monitoring at Scale:**
   - Centralized logging
   - Distributed tracing
   - Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

- **Documentation:** This README and inline comments
- **Health Checks:** `./scripts/health-check.sh`
- **Logs:** `./scripts/logs.sh`
- **Backups:** `./scripts/backup.sh`

For additional support, contact the development team.
