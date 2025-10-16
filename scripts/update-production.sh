#!/bin/bash

# ============================================
# Production Update Script
# Incremental updates without full redeployment
# ============================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Configuration
DEPLOY_DIR="/home/deploy/odeuo"
BACKUP_DIR="/home/deploy/backups"
COMPOSE_FILE="docker-compose.prod.yml"

# Default values
UPDATE_CODE=true
UPDATE_CONTAINERS=false
UPDATE_N8N=false
RESTART_SERVICES=""
FORCE_REBUILD=false

# Help function
show_help() {
    cat << EOF
Production Update Script - Incremental updates without full redeployment

Usage: $0 [OPTIONS]

OPTIONS:
    --code-only         Update code only (git pull + restart web container)
    --containers        Update and rebuild containers
    --n8n              Update n8n configuration (workflows/credentials)
    --restart SERVICE   Restart specific service(s) (comma-separated)
    --force-rebuild     Force rebuild of containers (no cache)
    --help             Show this help message

EXAMPLES:
    # Quick code update (most common)
    $0 --code-only

    # Update n8n workflows and credentials
    $0 --n8n

    # Restart specific services
    $0 --restart odeuo-web,n8n

    # Full container update with rebuild
    $0 --containers --force-rebuild

    # Update code and restart web service
    $0 --code-only --restart odeuo-web
EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --code-only)
                UPDATE_CODE=true
                UPDATE_CONTAINERS=false
                shift
                ;;
            --containers)
                UPDATE_CONTAINERS=true
                shift
                ;;
            --n8n)
                UPDATE_N8N=true
                shift
                ;;
            --restart)
                RESTART_SERVICES="$2"
                shift 2
                ;;
            --force-rebuild)
                FORCE_REBUILD=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                error "Unknown option: $1. Use --help for usage information."
                ;;
        esac
    done
}

# Check if we're on the production server
check_environment() {
    if [[ ! -d "$DEPLOY_DIR" ]]; then
        error "Deployment directory not found: $DEPLOY_DIR"
    fi
    
    if [[ ! -f "$DEPLOY_DIR/$COMPOSE_FILE" ]]; then
        error "Docker Compose file not found: $DEPLOY_DIR/$COMPOSE_FILE"
    fi
    
    log "Environment check passed"
}

# Create backup before update
create_backup() {
    log "Creating backup before update..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    
    # Backup database
    docker exec odeuo-postgres-prod pg_dump -U odeuo odeuo > "$BACKUP_DIR/${BACKUP_NAME}_db.sql" || warn "Database backup failed"
    
    # Backup current code
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_code.tar.gz" -C "$DEPLOY_DIR" . || warn "Code backup failed"
    
    log "Backup created: $BACKUP_NAME"
}

# Update code from repository
update_code() {
    if [[ "$UPDATE_CODE" == true ]]; then
        log "Updating code from repository..."
        
        cd "$DEPLOY_DIR"
        
        # Stash any local changes
        git stash push -m "Auto-stash before update $(date)" || true
        
        # Pull latest changes
        git pull origin main || error "Failed to pull latest changes"
        
        # Update file permissions
        chmod +x scripts/*.sh 2>/dev/null || true
        chmod +x config/n8n/scripts/*.sh 2>/dev/null || true
        
        log "Code updated successfully"
    fi
}

# Update n8n configuration
update_n8n() {
    if [[ "$UPDATE_N8N" == true ]]; then
        log "Updating n8n configuration..."
        
        cd "$DEPLOY_DIR"
        
        # Check if n8n container is running
        if ! docker ps | grep -q "odeuo-n8n-prod"; then
            warn "n8n container is not running, skipping n8n update"
            return
        fi
        
        # Run n8n import script
        if [[ -f "config/n8n/scripts/import-config.sh" ]]; then
            ./config/n8n/scripts/import-config.sh || warn "n8n import failed"
        else
            warn "n8n import script not found"
        fi
        
        log "n8n configuration updated"
    fi
}

# Update containers
update_containers() {
    if [[ "$UPDATE_CONTAINERS" == true ]]; then
        log "Updating containers..."
        
        cd "$DEPLOY_DIR"
        
        if [[ "$FORCE_REBUILD" == true ]]; then
            log "Force rebuilding containers..."
            docker-compose -f "$COMPOSE_FILE" build --no-cache
        else
            log "Pulling latest images..."
            docker-compose -f "$COMPOSE_FILE" pull
            
            log "Building updated containers..."
            docker-compose -f "$COMPOSE_FILE" build
        fi
        
        log "Containers updated"
    fi
}

# Restart specific services
restart_services() {
    if [[ -n "$RESTART_SERVICES" ]]; then
        log "Restarting services: $RESTART_SERVICES"
        
        cd "$DEPLOY_DIR"
        
        # Convert comma-separated list to array
        IFS=',' read -ra SERVICES <<< "$RESTART_SERVICES"
        
        for service in "${SERVICES[@]}"; do
            service=$(echo "$service" | xargs) # Trim whitespace
            log "Restarting service: $service"
            docker-compose -f "$COMPOSE_FILE" restart "$service" || warn "Failed to restart $service"
        done
        
        log "Service restart completed"
    fi
}

# Health check after update
health_check() {
    log "Performing health check..."
    
    cd "$DEPLOY_DIR"
    
    # Wait a moment for services to stabilize
    sleep 10
    
    # Check container status
    log "Container status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    # Check specific service health
    local failed_services=()
    
    # Check web application
    if ! curl -f -s http://localhost:3000/api/health >/dev/null 2>&1; then
        failed_services+=("odeuo-web")
    fi
    
    # Check n8n if it should be running
    if docker ps | grep -q "odeuo-n8n-prod"; then
        if ! curl -f -s http://localhost:5678/healthz >/dev/null 2>&1; then
            failed_services+=("n8n")
        fi
    fi
    
    if [[ ${#failed_services[@]} -gt 0 ]]; then
        warn "Health check failed for: ${failed_services[*]}"
        warn "Check logs with: docker-compose -f $COMPOSE_FILE logs [service]"
    else
        log "Health check passed"
    fi
}

# Main function
main() {
    log "Starting production update..."
    
    parse_args "$@"
    check_environment
    create_backup
    update_code
    update_n8n
    update_containers
    restart_services
    health_check
    
    log "🎉 Production update completed successfully!"
    log ""
    log "Your ODEUO platform has been updated:"
    log "  🌐 Main App: https://odeuo.net"
    log "  🔧 n8n: https://n8n.odeuo.net"
    log "  🎤 LiveKit: https://livekit.odeuo.net"
    log ""
    log "If you encounter issues, you can:"
    log "  1. Check logs: docker-compose -f $COMPOSE_FILE logs [service]"
    log "  2. Rollback: git checkout HEAD~1 && docker-compose -f $COMPOSE_FILE up -d"
    log "  3. Restore backup from: $BACKUP_DIR"
}

# Run main function with all arguments
main "$@"
