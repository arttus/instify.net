#!/bin/bash

# ============================================
# ODEUO Platform Deployment Script
# DigitalOcean Production Deployment
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=""
EMAIL=""
SERVER_IP=""
DEPLOY_USER="deploy"
GITHUB_REPO="https://github.com/arttus/odeuo.net.git"
DEPLOY_DIR="/home/$DEPLOY_USER/odeuo"

# ============================================
# Helper Functions
# ============================================

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# ============================================
# Configuration Check
# ============================================

check_config() {
    log "Checking deployment configuration..."
    
    if [ -z "$DOMAIN" ]; then
        read -p "Enter your domain name (e.g., odeuo.com): " DOMAIN
    fi
    
    if [ -z "$EMAIL" ]; then
        read -p "Enter your email for SSL certificates: " EMAIL
    fi
    
    if [ -z "$SERVER_IP" ]; then
        read -p "Enter your server IP address: " SERVER_IP
    fi
    
    log "Configuration:"
    log "  Domain: $DOMAIN"
    log "  Email: $EMAIL"
    log "  Server IP: $SERVER_IP"
    
    read -p "Is this correct? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Deployment cancelled"
    fi
}

# ============================================
# Server Setup
# ============================================

setup_server() {
    log "Setting up server..."
    
    # Update system
    log "Updating system packages..."
    sudo apt-get update
    sudo apt-get upgrade -y
    
    # Install required packages
    log "Installing required packages..."
    sudo apt-get install -y \
        curl \
        wget \
        git \
        ufw \
        fail2ban \
        htop \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        sudo usermod -aG docker $USER
        log "Docker installed successfully"
    else
        log "Docker already installed"
    fi
    
    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        log "Docker Compose installed successfully"
    else
        log "Docker Compose already installed"
    fi
}

# ============================================
# Firewall Configuration
# ============================================

setup_firewall() {
    log "Configuring firewall..."
    
    # Reset UFW
    sudo ufw --force reset
    
    # Default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # SSH
    sudo ufw allow ssh
    
    # HTTP/HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # LiveKit ports
    sudo ufw allow 7880/tcp  # LiveKit HTTP
    sudo ufw allow 7881/tcp  # LiveKit gRPC
    sudo ufw allow 50000:50100/udp  # LiveKit WebRTC
    
    # Enable firewall
    sudo ufw --force enable
    
    log "Firewall configured successfully"
}

# ============================================
# SSL Certificate Setup
# ============================================

setup_ssl() {
    log "Setting up SSL certificates..."
    
    # Install Certbot
    if ! command -v certbot &> /dev/null; then
        log "Installing Certbot..."
        sudo apt-get install -y snapd
        sudo snap install core; sudo snap refresh core
        sudo snap install --classic certbot
        sudo ln -sf /snap/bin/certbot /usr/bin/certbot
    fi
    
    # Stop any running web servers
    sudo systemctl stop nginx 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down nginx 2>/dev/null || true
    
    # Generate SSL certificate
    log "Generating SSL certificate for $DOMAIN..."
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"
    
    # Set up auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
    
    log "SSL certificates configured successfully"
}

# ============================================
# Repository Setup
# ============================================

clone_repository() {
    log "Cloning repository from GitHub..."

    # Remove existing directory if it exists
    if [ -d "$DEPLOY_DIR" ]; then
        log "Removing existing deployment directory..."
        rm -rf "$DEPLOY_DIR"
    fi

    # Clone the repository
    log "Cloning from $GITHUB_REPO..."
    git clone "$GITHUB_REPO" "$DEPLOY_DIR"

    # Change to deployment directory
    cd "$DEPLOY_DIR"

    log "Repository cloned successfully to $DEPLOY_DIR"
}

# ============================================
# Environment Setup
# ============================================

setup_environment() {
    log "Setting up environment variables..."

    # Ensure we're in the deployment directory
    cd "$DEPLOY_DIR"

    if [ ! -f .env.production ]; then
        if [ -f .env.production.example ]; then
            cp .env.production.example .env.production
            log "Created .env.production from template"
        else
            error ".env.production.example not found"
        fi
    fi
    
    # Update domain and server IP in environment file
    sed -i "s/your-domain.com/$DOMAIN/g" .env.production
    sed -i "s/your.server.ip.address/$SERVER_IP/g" .env.production
    sed -i "s/admin@your-domain.com/$EMAIL/g" .env.production
    
    # Update Nginx configuration
    sed -i "s/your-domain.com/$DOMAIN/g" config/nginx/prod.conf
    
    # Update LiveKit configuration
    sed -i "s/your-domain.com/$DOMAIN/g" config/livekit.prod.yaml
    
    warn "Please edit .env.production and add your API keys and secrets"
    warn "Required variables:"
    warn "  - Database passwords"
    warn "  - API keys (OpenAI, Clerk, etc.)"
    warn "  - JWT secrets"
    warn "  - Other service credentials"
    
    read -p "Press Enter after you've updated .env.production..."
}

# ============================================
# Database Setup
# ============================================

setup_database() {
    log "Setting up database..."

    # Ensure we're in the deployment directory
    cd "$DEPLOY_DIR"

    # Start database service
    docker-compose -f docker-compose.prod.yml up -d postgres

    # Wait for database to be ready
    log "Waiting for database to be ready..."
    sleep 30

    # Run database migrations (if you have them)
    # docker-compose -f docker-compose.prod.yml exec odeuo-web npm run db:migrate

    log "Database setup completed"
}

# ============================================
# Application Deployment
# ============================================

deploy_application() {
    log "Deploying application..."

    # Ensure we're in the deployment directory
    cd "$DEPLOY_DIR"

    # Build and start all services
    log "Building Docker images..."
    docker-compose -f docker-compose.prod.yml build --no-cache

    log "Starting all services..."
    docker-compose -f docker-compose.prod.yml up -d

    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 60

    # Check service health
    log "Checking service health..."
    docker-compose -f docker-compose.prod.yml ps

    log "Application deployed successfully"
}

# ============================================
# Post-deployment Setup
# ============================================

post_deployment() {
    log "Running post-deployment tasks..."
    
    # Set up log rotation
    sudo tee /etc/logrotate.d/odeuo > /dev/null <<EOF
$DEPLOY_DIR/logs/*/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $DEPLOY_USER $DEPLOY_USER
}
EOF
    
    # Create backup script
    sudo tee /usr/local/bin/odeuo-backup > /dev/null <<EOF
#!/bin/bash
BACKUP_DIR="$DEPLOY_DIR/backups"
DATE=\$(date +%Y%m%d_%H%M%S)
docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml exec -T postgres pg_dump -U odeuo_prod odeuo_production > "\$BACKUP_DIR/odeuo_\$DATE.sql"
find "\$BACKUP_DIR" -name "odeuo_*.sql" -mtime +7 -delete
EOF
    
    sudo chmod +x /usr/local/bin/odeuo-backup
    
    # Set up daily backups
    echo "0 2 * * * /usr/local/bin/odeuo-backup" | crontab -
    
    log "Post-deployment setup completed"
}

# ============================================
# Main Deployment Function
# ============================================

main() {
    log "Starting ODEUO Platform deployment..."

    check_config
    setup_server
    setup_firewall
    clone_repository
    setup_ssl
    setup_environment
    setup_database
    deploy_application
    post_deployment
    
    log "🎉 Deployment completed successfully!"
    log ""
    log "Your ODEUO platform is now running at:"
    log "  🌐 Web: https://$DOMAIN"
    log "  🔧 n8n: https://$DOMAIN/n8n"
    log "  🎤 LiveKit: wss://$DOMAIN/livekit"
    log ""
    log "Next steps:"
    log "  1. Test the application"
    log "  2. Set up monitoring"
    log "  3. Configure backups"
    log "  4. Set up CI/CD pipeline"
    log ""
    log "For support, check the documentation or contact support."
}

# ============================================
# Script Execution
# ============================================

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    error "Please do not run this script as root"
fi

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --server-ip)
            SERVER_IP="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [--domain DOMAIN] [--email EMAIL] [--server-ip IP]"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Run main deployment
main
