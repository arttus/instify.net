#!/bin/bash

# ============================================
# n8n Configuration Import Script
# Imports workflows and credentials from config files to n8n
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$(dirname "$SCRIPT_DIR")"
WORKFLOWS_DIR="$CONFIG_DIR/workflows"
CREDENTIALS_DIR="$CONFIG_DIR/credentials"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Docker configuration - auto-detect environment
if [ -f "$PROJECT_ROOT/docker-compose.prod.yml" ] && docker ps --format "table {{.Names}}" | grep -q "odeuo-n8n-prod"; then
    # Production environment
    COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
    N8N_CONTAINER="odeuo-n8n-prod"
elif docker ps --format "table {{.Names}}" | grep -q "odeuo-n8n"; then
    # Local/development environment
    COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"
    N8N_CONTAINER="odeuo-n8n"
else
    # Default to production
    COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
    N8N_CONTAINER="odeuo-n8n-prod"
fi

# Default options
IMPORT_WORKFLOWS=true
IMPORT_CREDENTIALS=true
WAIT_FOR_READY=true
MAX_WAIT_TIME=300  # 5 minutes

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
# Wait for n8n to be ready
# ============================================

wait_for_n8n_ready() {
    if [ "$WAIT_FOR_READY" != "true" ]; then
        return 0
    fi
    
    log "Waiting for n8n to be ready..."
    
    local count=0
    local max_attempts=$((MAX_WAIT_TIME / 10))
    
    while [ $count -lt $max_attempts ]; do
        if docker exec "$N8N_CONTAINER" curl -f http://localhost:5678/healthz >/dev/null 2>&1; then
            log "n8n is ready!"
            return 0
        fi
        
        count=$((count + 1))
        log "Waiting for n8n... ($count/$max_attempts)"
        sleep 10
    done
    
    error "n8n did not become ready within $MAX_WAIT_TIME seconds"
}

# ============================================
# Import Functions
# ============================================

import_credentials() {
    if [ "$IMPORT_CREDENTIALS" != "true" ]; then
        return 0
    fi
    
    log "Importing credentials..."
    
    # Import credentials using n8n CLI
    if docker exec -u node "$N8N_CONTAINER" n8n import:credentials --separate --input=/home/node/.n8n/custom/credentials/; then
        log "Credentials imported successfully"
    else
        warn "Credential import failed or no credentials to import"
    fi
}

import_workflows() {
    if [ "$IMPORT_WORKFLOWS" != "true" ]; then
        return 0
    fi
    
    log "Importing workflows..."
    
    # Import workflows using n8n CLI
    if docker exec -u node "$N8N_CONTAINER" n8n import:workflow --separate --input=/home/node/.n8n/custom/workflows/; then
        log "Workflows imported successfully"
    else
        warn "Workflow import failed or no workflows to import"
    fi
}

# ============================================
# Main Function
# ============================================

main() {
    log "Starting n8n configuration import..."
    log "Using container: $N8N_CONTAINER"
    
    # Check if n8n container is running
    if ! docker ps --format "table {{.Names}}" | grep -q "$N8N_CONTAINER"; then
        error "n8n container '$N8N_CONTAINER' is not running"
    fi
    
    # Wait for n8n to be ready
    wait_for_n8n_ready
    
    # Import credentials first (workflows may depend on them)
    import_credentials
    import_workflows
    
    log "🎉 Import completed successfully!"
    log ""
    log "Configuration imported:"
    if [ "$IMPORT_CREDENTIALS" = "true" ]; then
        log "  🔐 Credentials imported from: $CREDENTIALS_DIR"
    fi
    if [ "$IMPORT_WORKFLOWS" = "true" ]; then
        log "  📋 Workflows imported from: $WORKFLOWS_DIR"
    fi
    log ""
    log "Next steps:"
    log "  1. Access n8n web interface to verify import"
    log "  2. Test your workflows and credentials"
    log "  3. Make any necessary adjustments"
}

# Run main function
main "$@"
