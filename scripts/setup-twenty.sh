#!/bin/bash

# ============================================
# Twenty CRM Setup Script for ODEUO
# ============================================
# This script helps set up Twenty CRM in your development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_info "Creating .env from .env.example..."
        cp .env.example .env
        print_success ".env file created"
    else
        print_success ".env file exists"
    fi
}

# Generate secure secrets
generate_secrets() {
    print_header "Generating Secure Secrets"
    
    # Check if Twenty variables already exist in .env
    if grep -q "TWENTY_DB_PASSWORD=" .env && grep -q "TWENTY_APP_SECRET=" .env; then
        print_warning "Twenty CRM variables already exist in .env"
        read -p "Do you want to regenerate them? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing secrets"
            return
        fi
    fi
    
    # Generate secrets
    TWENTY_DB_PASSWORD=$(openssl rand -base64 32)
    TWENTY_APP_SECRET=$(openssl rand -base64 32)
    
    # Update or add to .env file
    if grep -q "TWENTY_DB_PASSWORD=" .env; then
        # Update existing
        sed -i.bak "s|TWENTY_DB_PASSWORD=.*|TWENTY_DB_PASSWORD=${TWENTY_DB_PASSWORD}|g" .env
        sed -i.bak "s|TWENTY_APP_SECRET=.*|TWENTY_APP_SECRET=${TWENTY_APP_SECRET}|g" .env
        rm .env.bak 2>/dev/null || true
    else
        # Add new
        cat >> .env << EOF

# ============================================
# Twenty CRM Configuration (Auto-generated)
# ============================================
TWENTY_DB_USER=twenty
TWENTY_DB_PASSWORD=${TWENTY_DB_PASSWORD}
TWENTY_DB_NAME=twenty
TWENTY_APP_SECRET=${TWENTY_APP_SECRET}
TWENTY_SERVER_URL=http://crm.odeuo.local
TWENTY_FRONT_BASE_URL=http://crm.odeuo.local
TWENTY_LOG_LEVEL=debug
EOF
    fi
    
    print_success "Secrets generated and saved to .env"
    print_info "TWENTY_DB_PASSWORD: ${TWENTY_DB_PASSWORD:0:10}..."
    print_info "TWENTY_APP_SECRET: ${TWENTY_APP_SECRET:0:10}..."
}

# Configure /etc/hosts
configure_hosts() {
    print_header "Configuring Local DNS"
    
    if grep -q "crm.odeuo.local" /etc/hosts; then
        print_success "crm.odeuo.local already configured in /etc/hosts"
    else
        print_warning "crm.odeuo.local not found in /etc/hosts"
        print_info "To access Twenty via subdomain, add this line to /etc/hosts:"
        echo -e "${YELLOW}127.0.0.1 crm.odeuo.local${NC}"
        echo
        read -p "Would you like to add it now? (requires sudo) (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "127.0.0.1 crm.odeuo.local" | sudo tee -a /etc/hosts > /dev/null
            print_success "Added crm.odeuo.local to /etc/hosts"
        else
            print_info "You can add it manually later with:"
            echo -e "${YELLOW}echo '127.0.0.1 crm.odeuo.local' | sudo tee -a /etc/hosts${NC}"
        fi
    fi
}

# Build postgres container
build_postgres() {
    print_header "Building PostgreSQL Container"
    
    print_info "Rebuilding postgres container to include Twenty database initialization..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build postgres
    
    print_success "PostgreSQL container built successfully"
}

# Start services
start_services() {
    print_header "Starting Services"
    
    print_info "Starting all services..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    
    print_success "Services started"
    
    print_info "Waiting for Twenty server to be ready..."
    sleep 10
    
    # Wait for Twenty server to be healthy
    MAX_ATTEMPTS=30
    ATTEMPT=0
    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        if curl -sf http://localhost:3002/health > /dev/null 2>&1; then
            print_success "Twenty server is ready!"
            break
        fi
        ATTEMPT=$((ATTEMPT + 1))
        echo -n "."
        sleep 2
    done
    echo
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        print_warning "Twenty server is taking longer than expected to start"
        print_info "Check logs with: docker-compose logs -f twenty-server"
    fi
}

# Show access information
show_access_info() {
    print_header "Twenty CRM Setup Complete!"
    
    echo -e "${GREEN}Twenty CRM is now running!${NC}\n"
    
    echo -e "${BLUE}Access Twenty CRM at:${NC}"
    echo -e "  • Via subdomain: ${YELLOW}http://crm.odeuo.local${NC}"
    echo -e "  • Via port:      ${YELLOW}http://localhost:3002${NC}\n"
    
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  • View logs:     ${YELLOW}docker-compose logs -f twenty-server${NC}"
    echo -e "  • Restart:       ${YELLOW}docker-compose restart twenty-server twenty-worker${NC}"
    echo -e "  • Stop:          ${YELLOW}docker-compose stop twenty-server twenty-worker${NC}\n"
    
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Open Twenty CRM in your browser"
    echo -e "  2. Create your workspace and account"
    echo -e "  3. Start managing your contacts and deals!\n"
    
    echo -e "${BLUE}Documentation:${NC}"
    echo -e "  • Setup Guide:   ${YELLOW}TWENTY_SETUP_GUIDE.md${NC}"
    echo -e "  • Integration:   ${YELLOW}TWENTY_INTEGRATION.md${NC}"
    echo -e "  • Twenty Docs:   ${YELLOW}https://twenty.com/developers${NC}\n"
}

# Main execution
main() {
    print_header "Twenty CRM Setup for ODEUO"
    
    # Check prerequisites
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    
    # Run setup steps
    check_env_file
    generate_secrets
    configure_hosts
    build_postgres
    start_services
    show_access_info
}

# Run main function
main

