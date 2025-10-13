#!/bin/bash
# ============================================
# Instify Production Deployment Script
# Enhanced version with error handling and validation
# ============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOMAIN="${DOMAIN:-instify.yourdomain.com}"
DROPLET_NAME="${DROPLET_NAME:-instify-production}"
DROPLET_SIZE="${DROPLET_SIZE:-s-2vcpu-4gb}"
DROPLET_REGION="${DROPLET_REGION:-nyc3}"

# ============================================
# Helper Functions
# ============================================

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# ============================================
# Pre-deployment Checks
# ============================================

check_requirements() {
    log "Checking deployment requirements..."
    
    # Check if doctl is installed
    if ! command -v doctl &> /dev/null; then
        error "doctl CLI is not installed. Please install it first: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    fi
    
    # Check if doctl is authenticated
    if ! doctl account get &> /dev/null; then
        error "doctl is not authenticated. Please run: doctl auth init"
    fi
    
    # Check if .env.production exists
    if [[ ! -f "$PROJECT_DIR/.env.production" ]]; then
        error ".env.production file not found. Please create it from .env.production.example"
    fi
    
    # Check if Docker Compose file exists
    if [[ ! -f "$PROJECT_DIR/docker-compose.yml" ]]; then
        error "docker-compose.yml not found in project directory"
    fi
    
    success "All requirements met"
}

# ============================================
# DigitalOcean Droplet Management
# ============================================

create_droplet() {
    log "Creating DigitalOcean Droplet..."
    
    # Check if droplet already exists
    if doctl compute droplet list --format Name --no-header | grep -q "^$DROPLET_NAME$"; then
        warning "Droplet '$DROPLET_NAME' already exists. Skipping creation."
        return 0
    fi
    
    # Get SSH key IDs
    SSH_KEYS=$(doctl compute ssh-key list --format ID --no-header | tr '\n' ',' | sed 's/,$//')
    
    if [[ -z "$SSH_KEYS" ]]; then
        error "No SSH keys found in DigitalOcean account. Please add an SSH key first."
    fi
    
    # Create droplet
    doctl compute droplet create "$DROPLET_NAME" \
        --size "$DROPLET_SIZE" \
        --image ubuntu-22-04-x64 \
        --region "$DROPLET_REGION" \
        --ssh-keys "$SSH_KEYS" \
        --wait
    
    success "Droplet created successfully"
}

get_droplet_ip() {
    log "Getting Droplet IP address..."
    
    DROPLET_IP=$(doctl compute droplet list "$DROPLET_NAME" --format PublicIPv4 --no-header)
    
    if [[ -z "$DROPLET_IP" ]]; then
        error "Could not get Droplet IP address"
    fi
    
    log "Droplet IP: $DROPLET_IP"
    export DROPLET_IP
}

# ============================================
# DNS Configuration
# ============================================

configure_dns() {
    log "DNS Configuration Required"
    echo "Please configure your DNS to point $DOMAIN to $DROPLET_IP"
    echo "If using Cloudflare:"
    echo "  1. Go to your Cloudflare dashboard"
    echo "  2. Add/update A record: $DOMAIN -> $DROPLET_IP"
    echo "  3. Set proxy status to 'DNS only' (gray cloud)"
    echo ""
    read -p "Press Enter when DNS is configured and propagated..."
    
    # Test DNS resolution
    log "Testing DNS resolution..."
    if nslookup "$DOMAIN" | grep -q "$DROPLET_IP"; then
        success "DNS configured correctly"
    else
        warning "DNS may not be fully propagated yet. Continuing anyway..."
    fi
}

# ============================================
# Server Setup
# ============================================

setup_server() {
    log "Setting up server..."
    
    # Wait for SSH to be available
    log "Waiting for SSH to be available..."
    for i in {1..30}; do
        if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@"$DROPLET_IP" "echo 'SSH ready'" &>/dev/null; then
            break
        fi
        if [[ $i -eq 30 ]]; then
            error "SSH connection failed after 30 attempts"
        fi
        sleep 10
    done
    
    success "SSH connection established"
    
    # Run server setup commands
    ssh -o StrictHostKeyChecking=no root@"$DROPLET_IP" << 'ENDSSH'
        set -e
        
        echo "🔄 Updating system packages..."
        apt update && apt upgrade -y
        
        echo "🐳 Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl enable docker
        systemctl start docker
        
        echo "🔧 Installing Docker Compose..."
        apt install docker-compose-plugin -y
        
        echo "📁 Creating project directory..."
        mkdir -p /root/instify
        cd /root/instify
        
        echo "🔥 Setting up firewall..."
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
        
        echo "✅ Server setup complete"
ENDSSH
    
    success "Server setup completed"
}

# ============================================
# Application Deployment
# ============================================

deploy_application() {
    log "Deploying application..."
    
    # Copy project files
    log "Copying project files..."
    rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.env*' \
        "$PROJECT_DIR/" root@"$DROPLET_IP":/root/instify/
    
    # Copy production environment file
    log "Copying environment configuration..."
    scp "$PROJECT_DIR/.env.production" root@"$DROPLET_IP":/root/instify/.env
    
    # Deploy on server
    ssh -o StrictHostKeyChecking=no root@"$DROPLET_IP" << ENDSSH
        set -e
        cd /root/instify
        
        echo "🔧 Setting up SSL certificates..."
        apt install certbot -y
        
        # Get SSL certificate
        certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
        
        # Copy certificates
        mkdir -p config/nginx/ssl
        cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem config/nginx/ssl/cert.pem
        cp /etc/letsencrypt/live/$DOMAIN/privkey.pem config/nginx/ssl/key.pem
        
        # Enable production nginx config
        if [[ -f config/nginx/conf.d/production.conf.example ]]; then
            sed "s/your-domain.com/$DOMAIN/g" config/nginx/conf.d/production.conf.example > config/nginx/conf.d/production.conf
            rm config/nginx/conf.d/default.conf 2>/dev/null || true
        fi
        
        echo "🚀 Starting containers..."
        docker compose up -d --build
        
        echo "⏳ Waiting for services to be ready..."
        sleep 60
        
        echo "🗄️  Running database migrations..."
        docker compose exec -T instify-web npm run db:migrate || echo "Migration failed, continuing..."
        
        echo "🔄 Setting up SSL certificate renewal..."
        echo "0 12 * * * /usr/bin/certbot renew --quiet && docker compose restart nginx" | crontab -
        
        echo "✅ Deployment complete!"
ENDSSH
    
    success "Application deployed successfully"
}

# ============================================
# Post-deployment Setup
# ============================================

setup_backups() {
    log "Setting up automated backups..."
    
    ssh -o StrictHostKeyChecking=no root@"$DROPLET_IP" << 'ENDSSH'
        set -e
        
        echo "📦 Installing rclone for backup sync..."
        curl https://rclone.org/install.sh | bash
        
        echo "⚠️  Please configure rclone for DigitalOcean Spaces:"
        echo "   1. Run: rclone config"
        echo "   2. Choose 'New remote'"
        echo "   3. Name: do-spaces"
        echo "   4. Storage: Amazon S3 Compliant"
        echo "   5. Provider: DigitalOcean Spaces"
        echo "   6. Enter your Spaces credentials"
        echo ""
        echo "After configuration, backups will sync every 6 hours"
        
        # Add backup sync to crontab
        echo "0 */6 * * * rclone sync /root/instify/backups do-spaces:instify-backups" >> /etc/crontab
        
        echo "✅ Backup setup complete"
ENDSSH
    
    success "Backup configuration completed"
}

# ============================================
# Health Checks
# ============================================

run_health_checks() {
    log "Running post-deployment health checks..."
    
    # Test HTTP endpoint
    if curl -f "http://$DROPLET_IP/health" &>/dev/null; then
        success "HTTP health check passed"
    else
        warning "HTTP health check failed"
    fi
    
    # Test HTTPS endpoint
    if curl -f "https://$DOMAIN/health" &>/dev/null; then
        success "HTTPS health check passed"
    else
        warning "HTTPS health check failed"
    fi
    
    # Test database connection
    ssh -o StrictHostKeyChecking=no root@"$DROPLET_IP" << 'ENDSSH'
        if docker compose exec -T postgres pg_isready -U instify; then
            echo "✅ Database health check passed"
        else
            echo "⚠️  Database health check failed"
        fi
ENDSSH
}

# ============================================
# Main Deployment Flow
# ============================================

main() {
    echo "🚀 Instify Production Deployment"
    echo "================================="
    echo "Domain: $DOMAIN"
    echo "Droplet: $DROPLET_NAME"
    echo "Region: $DROPLET_REGION"
    echo ""
    
    check_requirements
    create_droplet
    get_droplet_ip
    configure_dns
    setup_server
    deploy_application
    setup_backups
    run_health_checks
    
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "======================="
    echo "🌐 Application: https://$DOMAIN"
    echo "🔧 n8n Admin: https://$DOMAIN/n8n"
    echo "📊 Health Check: https://$DOMAIN/health"
    echo "🖥️  Server IP: $DROPLET_IP"
    echo ""
    echo "Next steps:"
    echo "1. Configure rclone for backups (SSH to server and run 'rclone config')"
    echo "2. Test all integrations (Instagram, SMS, Voice)"
    echo "3. Create your first tenant"
    echo "4. Monitor logs: docker compose logs -f"
}

# Run main function
main "$@"
