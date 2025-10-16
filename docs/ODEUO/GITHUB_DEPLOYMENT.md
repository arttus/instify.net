# 🚀 GitHub-Based DigitalOcean Deployment

## Deploy ODEUO Platform directly from GitHub to DigitalOcean

---

## 📋 Prerequisites

1. **DigitalOcean Droplet**
   - Ubuntu 22.04 LTS
   - 4GB+ RAM, 2+ vCPUs (8GB recommended for Voice AI)
   - 80GB+ SSD storage

2. **Domain Configuration**
   - Domain name purchased
   - DNS A records pointing to your server IP:
     - `yourdomain.com` → `167.71.86.216`
     - `www.yourdomain.com` → `167.71.86.216`

3. **API Keys Ready**
   - OpenAI API key (required for Voice AI)
   - Clerk production keys
   - Other service API keys as needed

---

## 🚀 One-Command Deployment

### Step 1: SSH into Your Server
```bash
ssh root@167.71.86.216
```

### Step 2: Download and Run Deployment Script
```bash
# Download the deployment script directly from GitHub
curl -fsSL https://raw.githubusercontent.com/arttus/odeuo.net/main/deploy.sh -o deploy.sh

# Make it executable
chmod +x deploy.sh

# Run deployment (replace with your actual domain and email)
./deploy.sh --domain yourdomain.com --email admin@yourdomain.com --server-ip 167.71.86.216
```

**That's it!** The script will:
- ✅ Create a deploy user
- ✅ Install Docker and Docker Compose
- ✅ Configure firewall (UFW)
- ✅ Clone your repository from GitHub
- ✅ Generate SSL certificates (Let's Encrypt)
- ✅ Set up environment variables
- ✅ Deploy all services
- ✅ Configure backups and monitoring

---

## 🔧 What the Script Does

### 1. **System Setup**
- Updates Ubuntu packages
- Installs Docker, Docker Compose, Git, UFW, fail2ban
- Creates secure deploy user

### 2. **Security Configuration**
- Configures UFW firewall with proper ports
- Sets up fail2ban for SSH protection
- Generates SSL certificates with Let's Encrypt

### 3. **Repository Cloning**
- Clones from `https://github.com/arttus/odeuo.net.git`
- Sets up deployment directory at `/home/deploy/odeuo`

### 4. **Environment Setup**
- Creates `.env.production` from template
- Updates domain and server IP automatically
- Prompts for API key configuration

### 5. **Service Deployment**
- Builds Docker images for production
- Starts all services (PostgreSQL, Redis, Next.js, LiveKit, Agents, n8n, Nginx)
- Configures health checks and monitoring

### 6. **Post-Deployment**
- Sets up automated database backups
- Configures log rotation
- Creates maintenance scripts

---

## 🎯 After Deployment

### Your Services Will Be Available At:
- **🌐 Main Application**: `https://yourdomain.com`
- **🎤 Voice AI Demo**: `https://yourdomain.com/livekit-demo`
- **🔧 Workflow Automation**: `https://yourdomain.com/n8n`
- **📊 Health Monitoring**: `https://yourdomain.com/health`

### Configure Your API Keys
The script will prompt you to edit `.env.production`:

```bash
# Essential keys to update:
OPENAI_API_KEY=sk-your_real_openai_key
CLERK_SECRET_KEY=sk_live_your_production_clerk_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key

# Optional advanced AI services:
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
CARTESIA_API_KEY=your_cartesia_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

---

## 🔍 Testing Your Deployment

### 1. **Health Check**
```bash
curl https://yourdomain.com/health
# Should return: {"status":"healthy"}
```

### 2. **Voice AI Test**
1. Visit `https://yourdomain.com/livekit-demo`
2. Click "Connect to Room"
3. Allow microphone access
4. Say "Hello" - AI should respond!

### 3. **Service Status**
```bash
# SSH into server and check services
ssh deploy@167.71.86.216
cd ~/odeuo
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔄 Updates and Maintenance

### Update from GitHub
```bash
# SSH into server
ssh deploy@167.71.86.216
cd ~/odeuo

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f livekit-agents
```

### Backup Database
```bash
# Manual backup
/usr/local/bin/odeuo-backup

# Automated backups run daily at 2 AM
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Domain not resolving**
   - Check DNS A records
   - Wait for DNS propagation (up to 24 hours)

2. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

3. **Services not starting**
   ```bash
   docker-compose -f docker-compose.prod.yml logs [service-name]
   ```

4. **Voice AI not working**
   - Check OpenAI API key and credits
   - Verify agent health: `curl http://localhost:8001/health`

### Get Help
- Check service logs for errors
- Verify environment variables
- Ensure all required API keys are configured
- Check firewall and port configuration

---

## 🎉 Success!

Your ODEUO platform with Voice AI is now deployed and running on DigitalOcean!

**Key Features Available:**
- ✅ **Real-time Voice AI**: Natural conversations with customers
- ✅ **Multi-channel Support**: Instagram DMs, SMS, WhatsApp, Voice
- ✅ **Workflow Automation**: n8n for business process automation
- ✅ **Production Security**: SSL, firewall, automated backups
- ✅ **Monitoring**: Health checks and logging
- ✅ **Scalability**: Ready for growth

**Next Steps:**
1. Configure your business workflows in n8n
2. Set up customer data integration
3. Test voice AI with real scenarios
4. Monitor performance and optimize
5. Scale as your business grows

🚀 **Your AI-powered customer engagement platform is live!**
