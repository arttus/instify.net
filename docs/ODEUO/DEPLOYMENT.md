# ODEUO Deployment Guide

> **Step-by-step guide for deploying ODEUO to production**

## 🎯 Pre-Deployment Checklist

### 1. External Services Setup

Before deploying, ensure all external services are configured:

#### Clerk (Authentication)
- [ ] Create Clerk application
- [ ] Enable Organizations feature
- [ ] Configure webhook endpoints
- [ ] Copy API keys to `.env.production`

#### Stripe (Payments)
- [ ] Create Stripe account
- [ ] Create products and pricing plans
- [ ] Configure webhook endpoints
- [ ] Copy API keys to `.env.production`

#### AI Services
- [ ] OpenAI API key with sufficient credits
- [ ] Anthropic API key with sufficient credits
- [ ] Test API connectivity

#### Communication Services
- [ ] Twilio account with phone number
- [ ] Instagram/Meta app configuration
- [ ] WhatsApp Business API (optional)

#### DigitalOcean
- [ ] Account created and verified
- [ ] Payment method added
- [ ] SSH key uploaded
- [ ] `doctl` CLI installed and authenticated

### 2. Domain and DNS
- [ ] Domain purchased and accessible
- [ ] DNS provider configured (recommend Cloudflare)
- [ ] Ready to create A record pointing to droplet IP

### 3. Code Repository
- [ ] All code committed to Git
- [ ] `.env.production` configured (not committed)
- [ ] Docker Compose files tested locally
- [ ] Database migrations ready

## 🚀 Deployment Process

### Step 1: Prepare Environment

```bash
# Clone repository (if not already done)
git clone https://github.com/yourorg/odeuo.git
cd odeuo.net

# Install dependencies
npm install

# Create production environment file
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production
```

### Step 2: Configure Production Environment

Edit `.env.production` with your actual values:

```bash
# Critical settings to update:
DOMAIN=your-actual-domain.com
DB_PASSWORD=your-secure-database-password
REDIS_PASSWORD=your-secure-redis-password

# API Keys (get from respective services)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Security secrets (generate with openssl rand -base64 32)
NEXTAUTH_SECRET=...
JWT_SECRET=...
```

### Step 3: Deploy to DigitalOcean

Run the automated deployment script:

```bash
./scripts/deploy.sh
```

The script will:
1. Create DigitalOcean droplet
2. Install Docker and dependencies
3. Configure firewall
4. Set up SSL certificates
5. Deploy application containers
6. Run database migrations
7. Configure automated backups

### Step 4: DNS Configuration

When prompted by the deployment script:

1. **Cloudflare Setup:**
   - Go to Cloudflare dashboard
   - Add A record: `your-domain.com` → `DROPLET_IP`
   - Set proxy status to "DNS only" (gray cloud)
   - Wait for propagation (usually 1-5 minutes)

2. **Other DNS Providers:**
   - Create A record pointing to droplet IP
   - Ensure TTL is set to 300 seconds for faster propagation

### Step 5: Post-Deployment Verification

```bash
# Run health checks
./scripts/health-check.sh full

# Check all services are running
docker compose ps

# Test endpoints
curl https://your-domain.com/health
curl https://your-domain.com/api/health
```

### Step 6: Configure Backups

SSH to your server and configure rclone for DigitalOcean Spaces:

```bash
ssh root@your-droplet-ip
rclone config

# Follow prompts to configure DigitalOcean Spaces:
# - Choose "New remote"
# - Name: do-spaces
# - Storage: Amazon S3 Compliant
# - Provider: DigitalOcean Spaces
# - Enter your Spaces credentials
```

## 🔧 Post-Deployment Configuration

### 1. Create First Tenant

Access your application and create the first tenant organization through Clerk.

### 2. Configure Webhooks

Set up webhooks in external services:

#### Clerk Webhooks
- URL: `https://your-domain.com/api/webhooks/clerk`
- Events: `organization.created`, `organization.updated`, `user.created`, `user.updated`

#### Stripe Webhooks
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `invoice.payment_succeeded`

#### Twilio Webhooks
- SMS URL: `https://your-domain.com/api/webhooks/twilio/sms`

#### Instagram Webhooks
- URL: `https://your-domain.com/api/webhooks/instagram`
- Verify token: (from your `.env.production`)

### 3. Test Integrations

Test each integration:

```bash
# Test Instagram DM automation
# Test SMS automation
# Test voice AI (Livekit)
# Test n8n workflows
```

## 📊 Monitoring Setup (Optional)

Enable comprehensive monitoring:

```bash
# On your server
cd /root/odeuo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Configure Grafana
# Access: https://your-domain.com:3001
# Login: admin/admin (change on first login)
```

## 🔒 Security Hardening

### 1. Server Security

```bash
# Update system packages
apt update && apt upgrade -y

# Configure automatic security updates
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades

# Harden SSH (optional)
nano /etc/ssh/sshd_config
# Set: PermitRootLogin no, PasswordAuthentication no
systemctl restart ssh
```

### 2. Application Security

- [ ] Change default passwords for all services
- [ ] Enable rate limiting in production
- [ ] Configure CORS properly
- [ ] Set up SSL certificate auto-renewal
- [ ] Enable audit logging

### 3. Database Security

```bash
# Create read-only user for reporting
docker compose exec postgres psql -U odeuo -d odeuo -c "
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE odeuo TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
"
```

## 🚨 Troubleshooting Deployment

### Common Deployment Issues

**SSL Certificate Fails:**
```bash
# Check DNS propagation
nslookup your-domain.com

# Manually get certificate
certbot certonly --standalone -d your-domain.com
```

**Services Won't Start:**
```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Check memory usage
free -h
```

**Database Migration Fails:**
```bash
# Check database connection
docker compose exec postgres pg_isready -U odeuo

# Run migrations manually
docker compose exec odeuo-web npm run db:migrate
```

**High Memory Usage:**
```bash
# Restart services to free memory
docker compose restart

# Check container resource usage
docker stats
```

## 📈 Performance Optimization

### 1. Database Optimization

```bash
# Analyze query performance
docker compose exec postgres psql -U odeuo -d odeuo -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
"
```

### 2. Application Optimization

- Enable Redis caching for frequently accessed data
- Optimize database queries with proper indexes
- Implement CDN for static assets
- Configure Nginx caching for API responses

### 3. Resource Monitoring

```bash
# Monitor resource usage
./scripts/health-check.sh full

# Check logs for errors
./scripts/logs.sh errors

# Monitor backup status
./scripts/backup.sh list
```

## 🔄 Maintenance

### Regular Maintenance Tasks

**Daily:**
- [ ] Check health status
- [ ] Verify backups completed
- [ ] Monitor error logs

**Weekly:**
- [ ] Update system packages
- [ ] Clean old logs
- [ ] Review performance metrics

**Monthly:**
- [ ] Update Docker images
- [ ] Review and rotate API keys
- [ ] Test backup restoration
- [ ] Security audit

### Maintenance Commands

```bash
# Update system
apt update && apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d

# Clean old logs
./scripts/logs.sh clean

# Clean old backups
./scripts/backup.sh cleanup 30
```

## 🆘 Emergency Procedures

### Service Recovery

```bash
# Quick service restart
docker compose restart

# Full system restart
docker compose down
docker compose up -d

# Restore from backup
./scripts/backup.sh restore backup_name
```

### Rollback Procedure

```bash
# Rollback to previous version
git checkout previous-working-commit
docker compose up -d --build

# Restore database if needed
./scripts/backup.sh restore last_known_good
```

This deployment guide ensures a smooth, secure, and maintainable production deployment of ODEUO.
