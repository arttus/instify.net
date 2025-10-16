# ODEUO Local Development - Quick Reference

## 🚀 Quick Start

```bash
# Automated setup
./setup.sh

# Manual start
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 🌐 Access URLs

### Subdomain Access (if configured)
| Service | URL |
|---------|-----|
| **Main App** | http://odeuo.local |
| **n8n** | http://n8n.odeuo.local |
| **Twenty CRM** | http://crm.odeuo.local |
| **LiveKit** | http://livekit.odeuo.local |
| **pgAdmin** | http://pgadmin.odeuo.local |
| **Redis Insight** | http://redis.odeuo.local |

### Port Access (always works)
| Service | URL |
|---------|-----|
| **Main App** | http://localhost:3001 |
| **n8n** | http://localhost:5678 |
| **Twenty CRM** | http://localhost:3002 |
| **LiveKit** | http://localhost:7880 |
| **pgAdmin** | http://localhost:5050 |
| **Redis Insight** | http://localhost:5540 |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

## 🔧 Common Commands

### Service Management
```bash
# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop all services
docker-compose stop

# Restart all services
docker-compose restart

# Stop and remove containers
docker-compose down

# View service status
docker-compose ps

# Rebuild and restart
docker-compose up -d --build
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f odeuo-web
docker-compose logs -f twenty-server
docker-compose logs -f n8n
docker-compose logs -f postgres

# View last 100 lines
docker-compose logs --tail=100 odeuo-web
```

### Database
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U odeuo -d odeuo_dev

# Run migrations
docker-compose exec odeuo-web npm run db:migrate

# Seed data
docker-compose exec odeuo-web npm run db:seed

# Backup database
docker-compose exec postgres pg_dump -U odeuo odeuo_dev > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U odeuo -d odeuo_dev
```

### Redis
```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Check Redis connection
docker-compose exec redis redis-cli ping

# View all keys
docker-compose exec redis redis-cli KEYS '*'

# Flush all data (careful!)
docker-compose exec redis redis-cli FLUSHALL
```

### Application
```bash
# Execute command in web container
docker-compose exec odeuo-web npm run [command]

# Access shell
docker-compose exec odeuo-web sh

# Install npm packages
docker-compose exec odeuo-web npm install [package]

# Run tests
docker-compose exec odeuo-web npm test
```

## 🐛 Troubleshooting

### Check Service Health
```bash
# All services
docker-compose ps

# Specific service
docker-compose ps odeuo-web

# Health check
curl http://localhost:3001/health
curl http://crm.odeuo.local/health
```

### Restart Specific Service
```bash
docker-compose restart odeuo-web
docker-compose restart twenty-server
docker-compose restart postgres
```

### View Resource Usage
```bash
# Container stats
docker-compose stats

# Disk usage
docker system df

# Detailed disk usage
docker system df -v
```

### Clean Up
```bash
# Remove stopped containers
docker-compose rm

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything (careful!)
docker system prune -a
```

### Reset Service
```bash
# Stop service
docker-compose stop odeuo-web

# Remove container
docker-compose rm -f odeuo-web

# Rebuild and start
docker-compose up -d --build odeuo-web
```

## 📝 Configuration

### Environment Variables
```bash
# Edit .env file
nano .env

# Restart services after changes
docker-compose restart
```

### Generate Secrets
```bash
# Password (25 chars)
openssl rand -base64 32 | tr -d "=+/" | cut -c1-25

# Secret (50 chars)
openssl rand -base64 64 | tr -d "=+/" | cut -c1-50
```

### Configure Subdomains
```bash
# Add to /etc/hosts
sudo tee -a /etc/hosts << 'EOF'
127.0.0.1 odeuo.local
127.0.0.1 n8n.odeuo.local
127.0.0.1 crm.odeuo.local
127.0.0.1 livekit.odeuo.local
127.0.0.1 pgadmin.odeuo.local
127.0.0.1 redis.odeuo.local
EOF

# Verify
cat /etc/hosts | grep odeuo.local
```

## 🔍 Debugging

### Check Logs for Errors
```bash
# All errors
docker-compose logs | grep -i error

# Specific service errors
docker-compose logs odeuo-web | grep -i error
```

### Access Container Shell
```bash
# Web app
docker-compose exec odeuo-web sh

# Database
docker-compose exec postgres bash

# Redis
docker-compose exec redis sh
```

### Network Issues
```bash
# List networks
docker network ls

# Inspect network
docker network inspect odeuo-network

# Test connectivity
docker-compose exec odeuo-web ping postgres
docker-compose exec odeuo-web ping redis
```

### Port Conflicts
```bash
# Check what's using a port (Mac/Linux)
lsof -i :80
lsof -i :5432
lsof -i :6379

# Kill process using port
kill -9 $(lsof -t -i:80)
```

## 📊 Monitoring

### View Container Stats
```bash
# Real-time stats
docker-compose stats

# One-time stats
docker-compose stats --no-stream
```

### Check Disk Usage
```bash
# Overall
docker system df

# Volumes
docker volume ls
docker volume inspect odeuo-postgres-data-dev
```

### Check Memory Usage
```bash
# Container memory
docker-compose stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"
```

## 🔄 Updates

### Update Code
```bash
# Pull latest changes
git pull

# Rebuild services
docker-compose build

# Restart with new code
docker-compose up -d
```

### Update Dependencies
```bash
# Update npm packages
docker-compose exec odeuo-web npm update

# Rebuild container
docker-compose build odeuo-web
docker-compose up -d odeuo-web
```

### Update Docker Images
```bash
# Pull latest images
docker-compose pull

# Restart services
docker-compose up -d
```

## 📚 Documentation

- **Setup Guide**: [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)
- **Twenty CRM**: [TWENTY_SETUP_GUIDE.md](TWENTY_SETUP_GUIDE.md)
- **Twenty Quick Ref**: [TWENTY_QUICK_REFERENCE.md](TWENTY_QUICK_REFERENCE.md)
- **Production Deploy**: [deploy-subdomains.sh](deploy-subdomains.sh)

## 🆘 Quick Help

```bash
# View this reference
cat LOCAL_DEV_QUICK_REFERENCE.md

# Run setup script
./setup.sh

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

---

**Need more help?** Check [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for detailed instructions.

