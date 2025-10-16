# 🚀 DigitalOcean Production Deployment Guide

## Complete deployment guide for ODEUO Platform with LiveKit Agents Voice AI

---

## 📋 Prerequisites

### 1. DigitalOcean Setup
- **Account**: DigitalOcean account with payment method
- **Droplet**: Ubuntu 22.04 LTS, 4GB+ RAM, 2+ vCPUs (8GB recommended for Voice AI)
- **Storage**: 80GB+ SSD
- **Networking**: Public IP address

### 2. Domain Configuration
- Domain name purchased and accessible
- DNS A records configured:
  - `yourdomain.com` → Server IP
  - `www.yourdomain.com` → Server IP

### 3. Required API Keys
```bash
# Essential (Required)
OPENAI_API_KEY=sk-your_openai_key          # Voice AI LLM
CLERK_SECRET_KEY=sk_live_your_clerk_key    # Authentication
LIVEKIT_API_KEY=your_livekit_key           # Voice/Video
LIVEKIT_API_SECRET=your_livekit_secret     # Voice/Video

# Optional (Enhanced Features)
ANTHROPIC_API_KEY=sk-ant-your_key          # Alternative LLM
ASSEMBLYAI_API_KEY=your_assemblyai_key     # Advanced STT
CARTESIA_API_KEY=your_cartesia_key         # Advanced TTS
DEEPGRAM_API_KEY=your_deepgram_key         # Alternative STT
ELEVENLABS_API_KEY=your_elevenlabs_key     # Premium TTS
```

---

## 🛠️ Deployment Options

### Option 1: Automated Deployment (Recommended)

#### Step 1: Server Preparation
```bash
# SSH into your DigitalOcean droplet
ssh root@your-server-ip

# Create deployment user
adduser deploy
usermod -aG sudo deploy
su - deploy
```

#### Step 2: Get the Code
```bash
# Clone repository
git clone https://github.com/yourusername/odeuo.git
cd odeuo/odeuo.net

# Or upload via SCP/SFTP if private repo
```

#### Step 3: Run Automated Deployment
```bash
# Make script executable
chmod +x deploy.sh

# Run with parameters
./deploy.sh --domain yourdomain.com --email admin@yourdomain.com --server-ip your-server-ip

# Or run interactively
./deploy.sh
```

**What the script does:**
- ✅ Installs Docker & Docker Compose
- ✅ Configures UFW firewall
- ✅ Generates SSL certificates (Let's Encrypt)
- ✅ Sets up environment variables
- ✅ Deploys all services
- ✅ Configures backups & monitoring

### Option 2: Manual Deployment

#### Step 1: System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login to apply Docker group
exit
# SSH back in
```

#### Step 2: Firewall Configuration
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp        # HTTP
sudo ufw allow 443/tcp       # HTTPS
sudo ufw allow 7880/tcp      # LiveKit HTTP
sudo ufw allow 7881/tcp      # LiveKit gRPC
sudo ufw allow 50000:50100/udp  # LiveKit WebRTC
sudo ufw enable
```

#### Step 3: SSL Certificates
```bash
# Install Certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Generate certificates
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email admin@yourdomain.com \
  --agree-tos \
  --non-interactive
```

#### Step 4: Environment Setup
```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production
```

#### Step 5: Deploy Services
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

---

## ⚙️ Configuration

### Environment Variables (.env.production)

#### Core Configuration
```bash
# Server
DOMAIN=yourdomain.com
SERVER_IP=your.server.ip.address
NODE_ENV=production

# Database
DB_USER=odeuo_prod
DB_PASSWORD=your_secure_db_password_here
DB_NAME=odeuo_production
REDIS_PASSWORD=your_secure_redis_password_here

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_32_char_secret_here
CLERK_SECRET_KEY=sk_live_your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key

# LiveKit (Voice AI)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://yourdomain.com/livekit

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
```

#### Advanced AI Services (Optional)
```bash
# Enhanced Speech-to-Text
ASSEMBLYAI_API_KEY=your_assemblyai_key
DEEPGRAM_API_KEY=your_deepgram_key

# Enhanced Text-to-Speech
CARTESIA_API_KEY=your_cartesia_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### Domain Configuration Updates

Update these files with your domain:

1. **Nginx Configuration**
```bash
# Edit config/nginx/prod.conf
sed -i 's/your-domain.com/yourdomain.com/g' config/nginx/prod.conf
```

2. **LiveKit Configuration**
```bash
# Edit config/livekit.prod.yaml
sed -i 's/your-domain.com/yourdomain.com/g' config/livekit.prod.yaml
```

---

## 🎤 Voice AI Configuration

### Default AI Pipeline
- **STT (Speech-to-Text)**: AssemblyAI Universal Streaming
- **LLM (Language Model)**: OpenAI GPT-4.1 mini
- **TTS (Text-to-Speech)**: Cartesia Sonic-2
- **VAD (Voice Activity Detection)**: Silero VAD

### Customization Options
Override defaults with environment variables:
```bash
# In .env.production
STT_PROVIDER=assemblyai    # or openai, deepgram
LLM_PROVIDER=openai       # or anthropic
TTS_PROVIDER=cartesia     # or openai, elevenlabs
```

### Voice AI Features
- **Real-time Conversation**: Natural voice interactions
- **Multi-language Support**: 50+ languages supported
- **Noise Cancellation**: Background noise filtering
- **Interruption Handling**: Natural conversation flow
- **Customer Context**: Integration with ODEUO platform data

---

## 📊 Monitoring & Health Checks

### Service Health Endpoints
```bash
# Main application
curl https://yourdomain.com/health

# LiveKit Agents
curl http://your-server-ip:8001/health

# LiveKit server
curl http://your-server-ip:7880/health

# Detailed agent metrics
curl http://your-server-ip:8001/health/detailed
```

### Service Management
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f [service-name]

# Restart service
docker-compose -f docker-compose.prod.yml restart [service-name]

# Update and restart
docker-compose -f docker-compose.prod.yml up -d --build [service-name]
```

---

## 🔒 Security Configuration

### Firewall Rules (UFW)
```bash
# View current rules
sudo ufw status verbose

# Essential ports
22/tcp     # SSH
80/tcp     # HTTP (redirects to HTTPS)
443/tcp    # HTTPS
7880/tcp   # LiveKit HTTP
7881/tcp   # LiveKit gRPC
50000:50100/udp  # LiveKit WebRTC
```

### SSL/TLS Configuration
- **Certificates**: Let's Encrypt (auto-renewal configured)
- **Protocols**: TLS 1.2, TLS 1.3 only
- **HSTS**: Enabled with 1-year max-age
- **Security Headers**: CSP, X-Frame-Options, etc.

### Database Security
- **PostgreSQL**: Localhost access only, strong passwords
- **Redis**: Password protected, localhost only
- **Backups**: Encrypted and rotated daily

---

## 💾 Backup & Recovery

### Automated Backups
```bash
# Database backup (runs daily at 2 AM)
/usr/local/bin/odeuo-backup

# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U odeuo_prod odeuo_production > backup_$(date +%Y%m%d).sql
```

### Recovery Process
```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore database
docker-compose -f docker-compose.prod.yml up -d postgres
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U odeuo_prod odeuo_production < backup_file.sql

# Start all services
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. SSL Certificate Problems
```bash
# Check certificate status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

#### 2. LiveKit WebRTC Issues
```bash
# Check UDP ports
sudo netstat -ulnp | grep :50000

# Test connectivity
curl http://your-server-ip:7880/health

# Check agent logs
docker-compose -f docker-compose.prod.yml logs livekit-agents
```

#### 3. Voice AI Agent Problems
```bash
# Check agent health
curl http://localhost:8001/health/detailed

# View agent logs
docker-compose -f docker-compose.prod.yml logs -f livekit-agents

# Restart agents
docker-compose -f docker-compose.prod.yml restart livekit-agents
```

#### 4. Database Connection Issues
```bash
# Check database status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# View connections
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U odeuo_prod -c "SELECT * FROM pg_stat_activity;"
```

### Performance Monitoring
```bash
# System resources
htop
df -h
free -h

# Docker resources
docker stats

# Service-specific logs
docker-compose -f docker-compose.prod.yml logs --tail=100 [service]
```

---

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Check health
docker-compose -f docker-compose.prod.yml ps
```

### System Maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Clean up unused Docker resources
docker system prune -a
```

---

## 🎉 Success!

After successful deployment, your ODEUO platform will be available at:

- **🌐 Main Application**: `https://yourdomain.com`
- **🔧 Workflow Automation**: `https://yourdomain.com/n8n`
- **🎤 Voice AI Demo**: `https://yourdomain.com/livekit-demo`
- **📊 Health Monitoring**: `https://yourdomain.com/health`

### Testing Voice AI
1. Visit `https://yourdomain.com/livekit-demo`
2. Click "Connect to Room"
3. Allow microphone access
4. Start speaking - the AI agent will respond!

### Next Steps
1. **Configure Monitoring**: Set up alerts and monitoring
2. **Backup Strategy**: Verify automated backups are working
3. **Performance Tuning**: Monitor and optimize based on usage
4. **Security Audit**: Regular security reviews and updates

The platform is now ready for production use with full Voice AI capabilities! 🚀
