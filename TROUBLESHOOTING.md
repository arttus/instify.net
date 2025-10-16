# ODEUO Troubleshooting Guide

> **Common issues and their solutions for ODEUO infrastructure**

## 🚨 Emergency Quick Fixes

### System Down - Critical Issues

**All services unresponsive:**
```bash
# 1. Check system resources
df -h && free -h

# 2. Restart all services
docker compose down && docker compose up -d

# 3. Check health
./scripts/health-check.sh quick
```

**Database connection lost:**
```bash
# 1. Check PostgreSQL status
docker compose ps postgres

# 2. Restart database
docker compose restart postgres

# 3. Wait 30 seconds, then test
docker compose exec postgres pg_isready -U odeuo
```

**SSL certificate expired:**
```bash
# 1. Renew certificate immediately
certbot renew --force-renewal

# 2. Reload Nginx
docker compose exec nginx nginx -s reload
```

## 🔍 Diagnostic Commands

### System Health Check
```bash
# Comprehensive health check
./scripts/health-check.sh full

# Quick critical services check
./scripts/health-check.sh quick

# Check specific service
docker compose ps service-name
docker compose logs service-name
```

### Resource Monitoring
```bash
# System resources
df -h                    # Disk space
free -h                  # Memory usage
top                      # CPU usage

# Docker resources
docker stats             # Container resource usage
docker system df         # Docker disk usage
```

### Log Analysis
```bash
# View all logs
./scripts/logs.sh all

# View errors only
./scripts/logs.sh errors

# Search for specific issue
./scripts/logs.sh search "database error"

# Export logs for analysis
./scripts/logs.sh export
```

## 🐛 Common Issues & Solutions

### 1. Container Issues

#### **Issue: Container won't start**
```bash
# Symptoms
docker compose ps shows "Exit 1" or "Restarting"

# Diagnosis
docker compose logs service-name

# Common causes & solutions
# - Port already in use
sudo netstat -tulpn | grep :PORT
sudo kill -9 PID

# - Volume permission issues
sudo chown -R 1000:1000 ./logs ./backups

# - Out of disk space
df -h
docker system prune -a

# - Memory issues
free -h
docker compose restart
```

#### **Issue: Container keeps restarting**
```bash
# Check restart count
docker compose ps

# Check logs for crash reason
docker compose logs --tail=50 service-name

# Common solutions
# - Increase memory limits in docker-compose.yml
# - Fix configuration errors
# - Check health check endpoints
```

### 2. Database Issues

#### **Issue: PostgreSQL connection refused**
```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec postgres pg_isready -U odeuo

# Solutions
# - Restart PostgreSQL
docker compose restart postgres

# - Check password in .env
grep DB_PASSWORD .env

# - Reset database (DEV ONLY)
npm run db:reset
```

#### **Issue: Database queries are slow**
```bash
# Check active connections
docker compose exec postgres psql -U odeuo -d odeuo -c "
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';
"

# Check slow queries
docker compose exec postgres psql -U odeuo -d odeuo -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 5;
"

# Solutions
# - Add database indexes
# - Optimize queries
# - Increase shared_buffers in postgresql.conf
# - Add connection pooling
```

#### **Issue: Database disk space full**
```bash
# Check database size
docker compose exec postgres psql -U odeuo -d odeuo -c "
SELECT pg_size_pretty(pg_database_size('odeuo'));
"

# Solutions
# - Clean old data
# - Vacuum database
docker compose exec postgres psql -U odeuo -d odeuo -c "VACUUM FULL;"

# - Increase disk size (DigitalOcean)
# - Set up log rotation
```

### 3. Web Application Issues

#### **Issue: Next.js app won't start**
```bash
# Check logs
docker compose logs odeuo-web

# Common causes
# - Node.js version mismatch
# - Missing environment variables
# - Build errors
# - Port conflicts

# Solutions
# - Rebuild container
docker compose build odeuo-web
docker compose up -d odeuo-web

# - Check environment variables
docker compose exec odeuo-web env | grep -E "(CLERK|OPENAI|DATABASE)"

# - Clear build cache
docker compose build --no-cache odeuo-web
```

#### **Issue: API endpoints returning 500 errors**
```bash
# Check application logs
./scripts/logs.sh service odeuo-web

# Check database connection
curl http://localhost:3000/api/health

# Common solutions
# - Check environment variables
# - Verify database migrations
npm run db:migrate

# - Check external API connectivity
# - Restart application
docker compose restart odeuo-web
```

### 4. Nginx Issues

#### **Issue: SSL certificate problems**
```bash
# Check certificate status
docker compose exec nginx openssl x509 -in /etc/nginx/ssl/cert.pem -noout -dates

# Check Nginx configuration
docker compose exec nginx nginx -t

# Renew certificate
certbot renew

# Reload Nginx
docker compose exec nginx nginx -s reload
```

#### **Issue: 502 Bad Gateway**
```bash
# Check upstream services
docker compose ps

# Check Nginx logs
./scripts/logs.sh service nginx

# Common causes
# - Backend service down
# - Wrong upstream configuration
# - Network connectivity issues

# Solutions
# - Restart backend services
docker compose restart odeuo-web

# - Check Nginx configuration
docker compose exec nginx nginx -t
```

### 5. Redis Issues

#### **Issue: Redis connection failed**
```bash
# Check Redis status
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli ping

# Check Redis logs
docker compose logs redis

# Solutions
# - Restart Redis
docker compose restart redis

# - Check password
grep REDIS_PASSWORD .env

# - Clear Redis data (if safe)
docker compose exec redis redis-cli FLUSHALL
```

### 6. External Service Issues

#### **Issue: Clerk authentication failing**
```bash
# Check environment variables
grep CLERK .env

# Test Clerk API
curl -H "Authorization: Bearer $CLERK_SECRET_KEY" \
     https://api.clerk.dev/v1/users

# Common solutions
# - Verify API keys
# - Check webhook endpoints
# - Verify domain configuration
```

#### **Issue: OpenAI API errors**
```bash
# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models

# Check usage limits
# - Log into OpenAI dashboard
# - Check billing and usage

# Solutions
# - Add payment method
# - Increase rate limits
# - Implement retry logic
```

## 🔧 Performance Issues

### High CPU Usage
```bash
# Identify CPU-intensive processes
top -p $(docker compose ps -q)

# Solutions
# - Scale horizontally
# - Optimize database queries
# - Implement caching
# - Reduce AI API calls
```

### High Memory Usage
```bash
# Check memory usage by container
docker stats --no-stream

# Solutions
# - Restart containers to free memory
docker compose restart

# - Adjust memory limits
# - Optimize application code
# - Add swap space (temporary)
```

### Slow Response Times
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/api/health

# Solutions
# - Enable Redis caching
# - Optimize database queries
# - Add CDN
# - Implement connection pooling
```

## 🔄 Recovery Procedures

### Service Recovery
```bash
# Restart specific service
docker compose restart service-name

# Restart all services
docker compose down
docker compose up -d

# Force recreate containers
docker compose up -d --force-recreate
```

### Database Recovery
```bash
# Restore from latest backup
./scripts/backup.sh list
./scripts/backup.sh restore backup_name

# Reset database (DEV ONLY)
npm run db:reset
npm run db:seed
```

### Full System Recovery
```bash
# 1. Stop all services
docker compose down

# 2. Clean Docker system
docker system prune -a

# 3. Restore from backup
./scripts/backup.sh restore latest_backup

# 4. Start services
docker compose up -d

# 5. Verify health
./scripts/health-check.sh full
```

## 📞 Getting Help

### Information to Collect
Before seeking help, collect:

```bash
# System information
uname -a
docker --version
docker compose version

# Service status
docker compose ps

# Recent logs
./scripts/logs.sh errors > error_logs.txt

# Health check results
./scripts/health-check.sh full > health_check.txt

# Resource usage
df -h && free -h > system_resources.txt
```

### Log Files to Check
- Application logs: `./scripts/logs.sh service odeuo-web`
- Database logs: `./scripts/logs.sh service postgres`
- Nginx logs: `./scripts/logs.sh access`
- System logs: `/var/log/syslog`

### Escalation Path
1. Check this troubleshooting guide
2. Run diagnostic commands
3. Check recent changes/deployments
4. Contact development team with collected information

Remember: Always backup before making significant changes!
