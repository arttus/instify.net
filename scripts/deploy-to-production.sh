#!/bin/bash

# ============================================
# Local Development to Production Deployment Script
# Safe deployment with rollback capabilities
# ============================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="${SERVER_IP:-167.71.86.216}"
SERVER_USER="${SERVER_USER:-deploy}"
DEPLOY_DIR="/home/deploy/odeuo"

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

# Help function
show_help() {
    cat << EOF
Local Development to Production Deployment Script

Usage: $0 [OPTIONS]

OPTIONS:
    --code-only         Deploy code changes only (fastest)
    --n8n              Deploy n8n configuration changes
    --containers        Deploy container changes (slower)
    --full             Full deployment with rebuild
    --dry-run          Show what would be deployed without doing it
    --rollback         Rollback to previous version
    --help             Show this help message

EXAMPLES:
    # Quick code deployment (most common)
    $0 --code-only

    # Deploy n8n workflow changes
    $0 --n8n

    # Deploy with container updates
    $0 --containers

    # See what would be deployed
    $0 --dry-run

    # Rollback if something went wrong
    $0 --rollback
EOF
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository"
    fi
    
    # Check if we have uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        warn "You have uncommitted changes. Consider committing them first."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check SSH connection
    if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "$SERVER_USER@$SERVER_IP" exit 2>/dev/null; then
        error "Cannot connect to production server. Check your SSH key and server access."
    fi
    
    log "Prerequisites check passed"
}

# Analyze changes
analyze_changes() {
    log "Analyzing changes since last deployment..."
    
    # Get the last commit that was deployed (we'll track this)
    LAST_DEPLOYED=$(ssh "$SERVER_USER@$SERVER_IP" "cd $DEPLOY_DIR && git rev-parse HEAD" 2>/dev/null || echo "")
    CURRENT_COMMIT=$(git rev-parse HEAD)
    
    if [[ -z "$LAST_DEPLOYED" ]]; then
        warn "Cannot determine last deployed commit. Assuming first deployment."
        CHANGED_FILES=$(git ls-files)
    else
        CHANGED_FILES=$(git diff --name-only "$LAST_DEPLOYED" "$CURRENT_COMMIT" || git ls-files)
    fi
    
    # Categorize changes
    HAS_CODE_CHANGES=false
    HAS_CONTAINER_CHANGES=false
    HAS_N8N_CHANGES=false
    
    while IFS= read -r file; do
        case "$file" in
            web/*)
                HAS_CODE_CHANGES=true
                ;;
            docker-compose*.yml|Dockerfile|*/Dockerfile)
                HAS_CONTAINER_CHANGES=true
                ;;
            config/n8n/*)
                HAS_N8N_CHANGES=true
                ;;
            package*.json|yarn.lock|pnpm-lock.yaml)
                HAS_CONTAINER_CHANGES=true
                ;;
        esac
    done <<< "$CHANGED_FILES"
    
    log "Change analysis:"
    log "  Code changes: $HAS_CODE_CHANGES"
    log "  Container changes: $HAS_CONTAINER_CHANGES"
    log "  n8n changes: $HAS_N8N_CHANGES"
    
    if [[ "$CHANGED_FILES" ]]; then
        log "Changed files:"
        echo "$CHANGED_FILES" | sed 's/^/    /'
    fi
}

# Deploy based on deployment type
deploy() {
    local deployment_type="$1"
    
    log "Starting deployment: $deployment_type"
    
    # Push changes to GitHub first
    log "Pushing changes to GitHub..."
    git push origin main || error "Failed to push to GitHub"
    
    # Deploy to production server
    log "Deploying to production server..."
    
    ssh "$SERVER_USER@$SERVER_IP" << ENDSSH
        set -e
        cd $DEPLOY_DIR
        
        # Make sure update script is executable
        chmod +x scripts/update-production.sh 2>/dev/null || true
        
        # Run the appropriate update
        case "$deployment_type" in
            "code-only")
                ./scripts/update-production.sh --code-only --restart odeuo-web
                ;;
            "n8n")
                ./scripts/update-production.sh --code-only --n8n
                ;;
            "containers")
                ./scripts/update-production.sh --code-only --containers
                ;;
            "full")
                ./scripts/update-production.sh --containers --force-rebuild
                ;;
            *)
                echo "Unknown deployment type: $deployment_type"
                exit 1
                ;;
        esac
ENDSSH
    
    log "Deployment completed"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Wait for services to stabilize
    sleep 15
    
    # Check main application
    if curl -f -s https://odeuo.net/api/health > /dev/null 2>&1; then
        log "✅ Main application is healthy"
    else
        warn "❌ Main application health check failed"
        return 1
    fi
    
    # Check n8n
    if curl -f -s https://n8n.odeuo.net/healthz > /dev/null 2>&1; then
        log "✅ n8n is healthy"
    else
        warn "⚠️ n8n health check failed"
    fi
    
    log "Deployment verification completed"
    return 0
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."
    
    ssh "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
        set -e
        cd /home/deploy/odeuo
        
        # Get previous commit
        PREVIOUS_COMMIT=$(git log --oneline -n 2 | tail -n 1 | cut -d' ' -f1)
        
        if [[ -z "$PREVIOUS_COMMIT" ]]; then
            echo "Cannot find previous commit to rollback to"
            exit 1
        fi
        
        echo "Rolling back to commit: $PREVIOUS_COMMIT"
        git checkout "$PREVIOUS_COMMIT"
        
        # Restart services
        docker-compose -f docker-compose.prod.yml restart odeuo-web
        
        echo "Rollback completed"
ENDSSH
    
    log "Rollback completed"
}

# Dry run function
dry_run() {
    log "DRY RUN - No changes will be made"
    
    analyze_changes
    
    log "Would deploy the following:"
    if [[ "$HAS_CODE_CHANGES" == true ]]; then
        log "  - Code changes (web application)"
    fi
    if [[ "$HAS_CONTAINER_CHANGES" == true ]]; then
        log "  - Container changes (Docker images)"
    fi
    if [[ "$HAS_N8N_CHANGES" == true ]]; then
        log "  - n8n configuration changes"
    fi
    
    log "To actually deploy, run without --dry-run"
}

# Main function
main() {
    local deployment_type=""
    local dry_run_mode=false
    local rollback_mode=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --code-only)
                deployment_type="code-only"
                shift
                ;;
            --n8n)
                deployment_type="n8n"
                shift
                ;;
            --containers)
                deployment_type="containers"
                shift
                ;;
            --full)
                deployment_type="full"
                shift
                ;;
            --dry-run)
                dry_run_mode=true
                shift
                ;;
            --rollback)
                rollback_mode=true
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
    
    # Handle special modes
    if [[ "$rollback_mode" == true ]]; then
        rollback
        exit 0
    fi
    
    if [[ "$dry_run_mode" == true ]]; then
        dry_run
        exit 0
    fi
    
    # Auto-detect deployment type if not specified
    if [[ -z "$deployment_type" ]]; then
        check_prerequisites
        analyze_changes
        
        if [[ "$HAS_CONTAINER_CHANGES" == true ]]; then
            deployment_type="containers"
            log "Auto-detected: Container changes found, using --containers"
        elif [[ "$HAS_N8N_CHANGES" == true ]]; then
            deployment_type="n8n"
            log "Auto-detected: n8n changes found, using --n8n"
        elif [[ "$HAS_CODE_CHANGES" == true ]]; then
            deployment_type="code-only"
            log "Auto-detected: Code changes found, using --code-only"
        else
            log "No significant changes detected, using --code-only"
            deployment_type="code-only"
        fi
    else
        check_prerequisites
    fi
    
    # Confirm deployment
    log "About to deploy with type: $deployment_type"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deployment cancelled"
        exit 0
    fi
    
    # Execute deployment
    deploy "$deployment_type"
    
    # Verify deployment
    if verify_deployment; then
        log "🎉 Deployment successful!"
        log ""
        log "Your changes are now live at:"
        log "  🌐 https://odeuo.net"
        log "  🔧 https://n8n.odeuo.net"
        log "  🎤 https://livekit.odeuo.net"
    else
        warn "Deployment completed but verification failed"
        warn "You may want to check the logs or consider rolling back"
        log "To rollback: $0 --rollback"
    fi
}

# Run main function with all arguments
main "$@"
