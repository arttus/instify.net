#!/bin/bash

# ============================================
# n8n Configuration Export Script
# Exports workflows and credentials from n8n to config files
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
if docker ps --format "table {{.Names}}" | grep -q "odeuo-n8n-prod"; then
    # Production environment
    N8N_CONTAINER="odeuo-n8n-prod"
elif docker ps --format "table {{.Names}}" | grep -q "odeuo-n8n"; then
    # Local/development environment
    N8N_CONTAINER="odeuo-n8n"
else
    echo -e "${RED}Error: No n8n container found${NC}"
    exit 1
fi

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
# Export Functions
# ============================================

export_workflows() {
    log "Exporting workflows..."

    # Create workflows directory if it doesn't exist
    mkdir -p "$WORKFLOWS_DIR"

    # Export workflows using n8n CLI
    if docker exec -u node "$N8N_CONTAINER" n8n export:workflow --all --output=/home/node/.n8n/custom/workflows --separate; then
        log "Workflows exported successfully to: $WORKFLOWS_DIR"
    else
        warn "Workflow export failed or no workflows to export"
    fi
}

export_credentials() {
    log "Exporting credentials..."

    # Create credentials directory if it doesn't exist
    mkdir -p "$CREDENTIALS_DIR"

    # Export credentials using n8n CLI
    if docker exec -u node "$N8N_CONTAINER" n8n export:credentials --all --output=/home/node/.n8n/custom/credentials --separate; then
        log "Credentials exported successfully to: $CREDENTIALS_DIR"
    else
        warn "Credential export failed or no credentials to export"
    fi
}

# ============================================
# Main Function
# ============================================

main() {
    log "Starting n8n configuration export..."
    log "Using container: $N8N_CONTAINER"
    
    # Check if n8n container is running
    if ! docker ps --format "table {{.Names}}" | grep -q "$N8N_CONTAINER"; then
        error "n8n container '$N8N_CONTAINER' is not running"
    fi
    
    # Export workflows and credentials
    export_workflows
    export_credentials
    
    log "🎉 Export completed successfully!"
    log ""
    log "Configuration exported:"
    log "  📋 Workflows: $WORKFLOWS_DIR"
    log "  🔐 Credentials: $CREDENTIALS_DIR"
    log ""
    log "Next steps:"
    log "  1. Review exported files"
    log "  2. Commit changes to version control if desired"
    log "  3. Files will be automatically imported on next deployment"
}

# Run main function
main "$@"
