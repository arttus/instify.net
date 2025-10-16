# Twenty CRM Quick Reference Card

## 🚀 Quick Start

```bash
# Automated setup (recommended)
./scripts/setup-twenty.sh

# Manual setup
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build postgres
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Twenty CRM** | http://crm.odeuo.local |
| **Direct Access** | http://localhost:3002 |
| **REST API** | http://crm.odeuo.local/rest |
| **GraphQL API** | http://crm.odeuo.local/graphql |
| **Health Check** | http://localhost:3002/health |

## 📝 Required Environment Variables

```ini
TWENTY_DB_USER=twenty
TWENTY_DB_PASSWORD=<generate-with-openssl>
TWENTY_DB_NAME=twenty
TWENTY_APP_SECRET=<generate-with-openssl>
TWENTY_SERVER_URL=http://crm.odeuo.local
TWENTY_FRONT_BASE_URL=http://crm.odeuo.local
TWENTY_LOG_LEVEL=debug
```

**Generate secrets:**
```bash
openssl rand -base64 32
```

## 🔧 Common Commands

### Service Management
```bash
# Start services
docker-compose up -d twenty-server twenty-worker

# Stop services
docker-compose stop twenty-server twenty-worker

# Restart services
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

# View last 100 lines
docker-compose logs twenty-server --tail=100
```

### Database
```bash
# Access Twenty database
docker-compose exec postgres psql -U twenty -d twenty

# Run migrations
docker-compose exec twenty-server npm run database:migrate

# Check database connection
docker-compose exec postgres psql -U twenty -d twenty -c "SELECT 1;"
```

### Debugging
```bash
# Check environment variables
docker-compose exec twenty-server env | grep TWENTY

# Check health
curl http://localhost:3002/health

# View container stats
docker-compose stats twenty-server twenty-worker

# Execute shell in container
docker-compose exec twenty-server sh
```

## 🔍 Health Checks

```bash
# Server health
curl http://localhost:3002/health

# Database connection
docker-compose exec postgres psql -U twenty -d twenty -c "SELECT 1;"

# Redis connection
docker-compose exec redis redis-cli ping

# Check all services
docker-compose ps
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Check logs
docker-compose logs twenty-server --tail=100

# Verify database
docker-compose exec postgres psql -U twenty -d twenty -c "SELECT 1;"

# Check environment
docker-compose exec twenty-server env | grep PG_DATABASE_URL
```

### Database errors
```bash
# Rebuild postgres
docker-compose build postgres

# Reset database
docker-compose down
docker volume rm odeuo-twenty-data-dev
docker-compose up -d
```

### Can't access via subdomain
```bash
# Check /etc/hosts
cat /etc/hosts | grep crm.odeuo.local

# Add if missing
echo "127.0.0.1 crm.odeuo.local" | sudo tee -a /etc/hosts

# Check nginx
docker-compose exec nginx nginx -t
```

## 📦 Data Management

### Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U twenty twenty > twenty_backup.sql

# Backup data volume
docker run --rm -v odeuo-twenty-data-dev:/data -v $(pwd):/backup \
  alpine tar czf /backup/twenty_data_backup.tar.gz -C /data .
```

### Restore
```bash
# Restore database
cat twenty_backup.sql | docker-compose exec -T postgres psql -U twenty -d twenty

# Restore data volume
docker run --rm -v odeuo-twenty-data-dev:/data -v $(pwd):/backup \
  alpine tar xzf /backup/twenty_data_backup.tar.gz -C /data
```

### Reset
```bash
# Complete reset
docker-compose down
docker volume rm odeuo-twenty-data-dev
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "DROP DATABASE IF EXISTS twenty;"
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "DROP USER IF EXISTS twenty;"
docker-compose up -d
```

## 🔐 Security

### Generate new secrets
```bash
# Generate password
openssl rand -base64 32

# Generate app secret
openssl rand -base64 32

# Update .env file
nano .env
```

### Rotate secrets
```bash
# 1. Generate new secrets
NEW_SECRET=$(openssl rand -base64 32)

# 2. Update .env
sed -i.bak "s|TWENTY_APP_SECRET=.*|TWENTY_APP_SECRET=${NEW_SECRET}|g" .env

# 3. Restart services
docker-compose restart twenty-server twenty-worker
```

## 📊 Monitoring

### Resource usage
```bash
# Container stats
docker-compose stats twenty-server twenty-worker

# Disk usage
docker system df -v | grep twenty

# Volume size
docker volume inspect odeuo-twenty-data-dev
```

### Performance
```bash
# Database connections
docker-compose exec postgres psql -U twenty -d twenty -c \
  "SELECT count(*) FROM pg_stat_activity WHERE datname='twenty';"

# Redis memory
docker-compose exec redis redis-cli info memory

# Server metrics (if available)
curl http://localhost:3002/metrics
```

## 🔗 Integration

### With n8n
```bash
# Access n8n
open http://n8n.odeuo.local

# Twenty API credentials in n8n:
# - URL: http://twenty-server:3000
# - API Key: (generate in Twenty UI)
```

### API Examples

**REST API:**
```bash
# Get contacts
curl http://crm.odeuo.local/rest/contacts

# Create contact
curl -X POST http://crm.odeuo.local/rest/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe"}'
```

**GraphQL API:**
```bash
# Query contacts
curl -X POST http://crm.odeuo.local/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ people { edges { node { id firstName lastName } } } }"}'
```

## 📚 Documentation

- **Setup Guide**: `TWENTY_SETUP_GUIDE.md`
- **Summary**: `TWENTY_CRM_SETUP_SUMMARY.md`
- **Integration**: `TWENTY_INTEGRATION.md`
- **Official Docs**: https://twenty.com/developers
- **GitHub**: https://github.com/twentyhq/twenty

## 🆘 Quick Help

```bash
# View this reference
cat TWENTY_QUICK_REFERENCE.md

# View setup guide
cat TWENTY_SETUP_GUIDE.md

# Run setup script
./scripts/setup-twenty.sh

# Check service status
docker-compose ps | grep twenty
```

---

**Need more help?** Check `TWENTY_SETUP_GUIDE.md` for detailed instructions.

