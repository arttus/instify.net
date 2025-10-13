#!/bin/bash
# ============================================
# Instify Local Setup Script
# Generates secure passwords and sets up environment
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

generate_secret() {
    openssl rand -base64 64 | tr -d "=+/" | cut -c1-50
}

# ============================================
# Main Setup Function
# ============================================

main() {
    local environment="${1:-local}"

    echo "🚀 Instify Infrastructure Setup"
    echo "==============================="
    echo "Environment: $environment"
    echo ""

    # Check prerequisites
    log "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi

    if ! command -v openssl &> /dev/null; then
        error "OpenSSL is not installed. Please install OpenSSL first."
    fi

    success "Prerequisites check passed"

    # Generate secure passwords
    log "Generating secure passwords..."

    DB_PASSWORD=$(generate_password)
    REDIS_PASSWORD=$(generate_password)
    NEXTAUTH_SECRET=$(generate_secret)
    JWT_SECRET=$(generate_secret)
    ENCRYPTION_KEY=$(generate_secret)
    WEBHOOK_SECRET=$(generate_password)
    N8N_ENCRYPTION_KEY=$(generate_secret)
    LIVEKIT_API_SECRET=$(generate_secret)
    GRAFANA_PASSWORD=$(generate_password)

    success "Secure passwords generated"

    # Create environment file based on environment type
    case "$environment" in
        "local"|"dev")
            setup_local_environment
            ;;
        "production"|"prod")
            setup_production_environment
            ;;
        *)
            error "Invalid environment. Use 'local' or 'production'"
            ;;
    esac

    # Create necessary directories
    log "Creating directory structure..."
    mkdir -p logs/{nginx,postgres,web,n8n} backups
    success "Directory structure created"

    # Start Docker services
    if [[ "$environment" == "local" || "$environment" == "dev" ]]; then
        log "Starting development environment..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

        # Wait for services to be ready
        log "Waiting for services to start..."
        sleep 30

        # Run database migrations
        log "Running database migrations..."
        docker-compose exec -T instify-web npm run db:migrate || warning "Migration failed - database may not be ready yet"

        # Seed development data
        log "Seeding development data..."
        docker-compose exec -T instify-web npm run db:seed || warning "Seeding failed - will retry later"

        success "Development environment started successfully!"
        echo ""
        echo "🌐 Access your services:"
        echo "   Main App:     http://localhost"
        echo "   n8n Admin:    http://localhost/n8n"
        echo "   pgAdmin:      http://localhost/pgadmin (admin@instify.com / admin)"
        echo "   RedisInsight:  http://localhost/redis"
        echo "   Health Check: http://localhost/health"
        echo ""
        echo "📋 Generated passwords saved to .env"
        echo "🔧 Run 'npm run logs' to view service logs"

    else
        success "Production environment configured!"
        echo ""
        echo "📋 Environment file created: .env.production"
        echo "🚀 Next steps:"
        echo "   1. Edit .env.production with your API keys"
        echo "   2. Run './scripts/deploy.sh' to deploy to DigitalOcean"
        echo ""
        warning "IMPORTANT: Keep your .env.production file secure and never commit it to Git!"
    fi
}

# ============================================
# Environment Setup Functions
# ============================================

setup_local_environment() {
    log "Setting up local development environment..."

    cat > .env << EOF
# ============================================
# Instify Local Development Environment
# Generated on $(date)
# ============================================

# Environment
NODE_ENV=development
DEBUG=true
SKIP_ENV_VALIDATION=true

# Application
DOMAIN=localhost
NEXT_PUBLIC_APP_URL=http://localhost

# Database
DATABASE_URL=postgresql://instify:${DB_PASSWORD}@localhost:5432/instify
DB_HOST=localhost
DB_PORT=5432
DB_NAME=instify
DB_USER=instify
DB_PASSWORD=${DB_PASSWORD}

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# Security
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=http://localhost
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}
WEBHOOK_SECRET=${WEBHOOK_SECRET}

# Authentication (Clerk) - Add your keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# AI Services - Add your keys
OPENAI_API_KEY=sk-your_openai_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# Communication Services - Add your keys
TWILIO_ACCOUNT_SID=AC_your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Voice AI (Livekit)
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
LIVEKIT_WS_URL=ws://localhost:7880

# Automation (n8n)
N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
N8N_USER_MANAGEMENT_DISABLED=true
N8N_BASIC_AUTH_ACTIVE=false

# Monitoring (optional)
GRAFANA_PASSWORD=${GRAFANA_PASSWORD}

# Development flags
MOCK_EXTERNAL_APIS=true
ENABLE_DEBUG_LOGS=true
EOF

    success "Local environment file created (.env)"
}

setup_production_environment() {
    log "Setting up production environment template..."

    cat > .env.production << EOF
# ============================================
# Instify Production Environment
# Generated on $(date)
# ============================================

# Environment
NODE_ENV=production
DEBUG=false

# Application
DOMAIN=your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://instify:${DB_PASSWORD}@postgres:5432/instify
DB_HOST=postgres
DB_PORT=5432
DB_NAME=instify
DB_USER=instify
DB_PASSWORD=${DB_PASSWORD}

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# Security
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}
WEBHOOK_SECRET=${WEBHOOK_SECRET}

# Authentication (Clerk) - CHANGE THESE
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_CHANGE_ME
CLERK_SECRET_KEY=sk_live_CHANGE_ME
CLERK_WEBHOOK_SECRET=whsec_CHANGE_ME

# Payment (Stripe) - CHANGE THESE
STRIPE_PUBLISHABLE_KEY=pk_live_CHANGE_ME
STRIPE_SECRET_KEY=sk_live_CHANGE_ME
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_ME

# AI Services - CHANGE THESE
OPENAI_API_KEY=sk-CHANGE_ME
ANTHROPIC_API_KEY=sk-ant-CHANGE_ME

# Communication Services - CHANGE THESE
TWILIO_ACCOUNT_SID=AC_CHANGE_ME
TWILIO_AUTH_TOKEN=CHANGE_ME
TWILIO_PHONE_NUMBER=+1234567890

# Instagram/Meta - CHANGE THESE
INSTAGRAM_APP_ID=CHANGE_ME
INSTAGRAM_APP_SECRET=CHANGE_ME
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=CHANGE_ME

# Voice AI (Livekit)
LIVEKIT_API_KEY=APIKey
LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
LIVEKIT_WS_URL=wss://your-domain.com:7880

# Automation (n8n)
N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
N8N_USER_MANAGEMENT_DISABLED=false
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=${GRAFANA_PASSWORD}

# File Storage (DigitalOcean Spaces) - CHANGE THESE
DO_SPACES_KEY=CHANGE_ME
DO_SPACES_SECRET=CHANGE_ME
DO_SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=instify-storage

# Monitoring
GRAFANA_PASSWORD=${GRAFANA_PASSWORD}

# SSL
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# Backup
BACKUP_ENCRYPTION_PASSWORD=${ENCRYPTION_KEY}
EOF

    success "Production environment template created (.env.production)"
}

# ============================================
# Usage
# ============================================

show_usage() {
    echo "Usage: $0 [environment]"
    echo
    echo "Environments:"
    echo "  local       Set up local development environment (default)"
    echo "  production  Create production environment template"
    echo
    echo "Examples:"
    echo "  $0              # Set up local development"
    echo "  $0 local        # Set up local development"
    echo "  $0 production   # Create production template"
}

# ============================================
# Main Execution
# ============================================

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    show_usage
    exit 0
fi

main "$@"