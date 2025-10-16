#!/bin/bash
# ============================================
# ODEUO Backup Management Script
# Create, restore, and manage database backups
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

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
# Backup Functions
# ============================================

create_backup() {
    local backup_name="${1:-backup_$TIMESTAMP}"
    
    log "Creating backup: $backup_name"
    
    # Ensure backup directory exists
    mkdir -p "$BACKUP_DIR"
    
    # Check if PostgreSQL container is running
    if ! docker compose ps postgres | grep -q "Up"; then
        error "PostgreSQL container is not running"
    fi
    
    # Create database backup
    log "Creating database backup..."
    docker compose exec -T postgres pg_dump \
        -U odeuo \
        -d odeuo \
        --format=custom \
        --compress=9 \
        --verbose \
        > "$BACKUP_DIR/${backup_name}.dump"
    
    # Create configuration backup
    log "Creating configuration backup..."
    tar -czf "$BACKUP_DIR/${backup_name}_config.tar.gz" \
        -C "$PROJECT_DIR" \
        config/ \
        docker-compose.yml \
        .env 2>/dev/null || true
    
    # Create backup metadata
    cat > "$BACKUP_DIR/${backup_name}_metadata.json" << EOF
{
    "backup_name": "$backup_name",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "database_size": "$(du -h "$BACKUP_DIR/${backup_name}.dump" | cut -f1)",
    "config_size": "$(du -h "$BACKUP_DIR/${backup_name}_config.tar.gz" | cut -f1)",
    "version": "1.0",
    "environment": "${NODE_ENV:-unknown}"
}
EOF
    
    success "Backup created: $backup_name"
    log "Database backup: $BACKUP_DIR/${backup_name}.dump"
    log "Config backup: $BACKUP_DIR/${backup_name}_config.tar.gz"
    log "Metadata: $BACKUP_DIR/${backup_name}_metadata.json"
}

restore_backup() {
    local backup_name="$1"
    
    if [[ -z "$backup_name" ]]; then
        error "Backup name is required for restore"
    fi
    
    local backup_file="$BACKUP_DIR/${backup_name}.dump"
    local config_file="$BACKUP_DIR/${backup_name}_config.tar.gz"
    
    if [[ ! -f "$backup_file" ]]; then
        error "Backup file not found: $backup_file"
    fi
    
    warning "This will overwrite the current database!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Restore cancelled"
        exit 0
    fi
    
    log "Restoring backup: $backup_name"
    
    # Stop application to prevent connections
    log "Stopping application containers..."
    docker compose stop odeuo-web n8n livekit || true
    
    # Wait a moment for connections to close
    sleep 5
    
    # Drop and recreate database
    log "Recreating database..."
    docker compose exec -T postgres psql -U odeuo -d postgres << EOF
DROP DATABASE IF EXISTS odeuo;
CREATE DATABASE odeuo OWNER odeuo;
EOF
    
    # Restore database
    log "Restoring database from backup..."
    docker compose exec -T postgres pg_restore \
        -U odeuo \
        -d odeuo \
        --clean \
        --if-exists \
        --verbose \
        < "$backup_file"
    
    # Restore configuration if available
    if [[ -f "$config_file" ]]; then
        log "Restoring configuration..."
        tar -xzf "$config_file" -C "$PROJECT_DIR"
    fi
    
    # Restart services
    log "Restarting services..."
    docker compose up -d
    
    success "Backup restored successfully: $backup_name"
}

list_backups() {
    log "Available backups:"
    echo
    
    if [[ ! -d "$BACKUP_DIR" ]] || [[ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]]; then
        warning "No backups found in $BACKUP_DIR"
        return
    fi
    
    # List backups with metadata
    for metadata_file in "$BACKUP_DIR"/*_metadata.json; do
        if [[ -f "$metadata_file" ]]; then
            local backup_name=$(basename "$metadata_file" _metadata.json)
            local timestamp=$(jq -r '.timestamp' "$metadata_file" 2>/dev/null || echo "unknown")
            local db_size=$(jq -r '.database_size' "$metadata_file" 2>/dev/null || echo "unknown")
            local env=$(jq -r '.environment' "$metadata_file" 2>/dev/null || echo "unknown")
            
            echo "📦 $backup_name"
            echo "   Created: $timestamp"
            echo "   Size: $db_size"
            echo "   Environment: $env"
            echo
        fi
    done
    
    # List backups without metadata (legacy)
    for dump_file in "$BACKUP_DIR"/*.dump; do
        if [[ -f "$dump_file" ]]; then
            local backup_name=$(basename "$dump_file" .dump)
            local metadata_file="$BACKUP_DIR/${backup_name}_metadata.json"
            
            if [[ ! -f "$metadata_file" ]]; then
                local file_date=$(date -r "$dump_file" +"%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "unknown")
                local file_size=$(du -h "$dump_file" | cut -f1)
                
                echo "📦 $backup_name (legacy)"
                echo "   Modified: $file_date"
                echo "   Size: $file_size"
                echo
            fi
        fi
    done
}

cleanup_backups() {
    local keep_days="${1:-7}"
    
    log "Cleaning up backups older than $keep_days days..."
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        warning "Backup directory does not exist"
        return
    fi
    
    local deleted_count=0
    
    # Find and delete old backup files
    find "$BACKUP_DIR" -name "*.dump" -mtime +$keep_days -type f | while read -r file; do
        local backup_name=$(basename "$file" .dump)
        log "Deleting old backup: $backup_name"
        
        # Delete associated files
        rm -f "$file"
        rm -f "$BACKUP_DIR/${backup_name}_config.tar.gz"
        rm -f "$BACKUP_DIR/${backup_name}_metadata.json"
        
        ((deleted_count++))
    done
    
    if [[ $deleted_count -eq 0 ]]; then
        log "No old backups to clean up"
    else
        success "Cleaned up $deleted_count old backups"
    fi
}

sync_to_remote() {
    log "Syncing backups to remote storage..."
    
    # Check if rclone is configured
    if ! command -v rclone &> /dev/null; then
        error "rclone is not installed. Please install it first."
    fi
    
    if ! rclone listremotes | grep -q "do-spaces:"; then
        error "rclone remote 'do-spaces' is not configured. Please run 'rclone config' first."
    fi
    
    # Sync backups to DigitalOcean Spaces
    rclone sync "$BACKUP_DIR" do-spaces:odeuo-backups \
        --progress \
        --exclude "*.tmp" \
        --exclude "*.log"
    
    success "Backups synced to remote storage"
}

# ============================================
# Health Check
# ============================================

health_check() {
    log "Running backup system health check..."
    
    # Check backup directory
    if [[ ! -d "$BACKUP_DIR" ]]; then
        warning "Backup directory does not exist: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        success "Created backup directory"
    fi
    
    # Check PostgreSQL container
    if docker compose ps postgres | grep -q "Up"; then
        success "PostgreSQL container is running"
    else
        error "PostgreSQL container is not running"
    fi
    
    # Check disk space
    local available_space=$(df "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    local available_gb=$((available_space / 1024 / 1024))
    
    if [[ $available_gb -lt 1 ]]; then
        warning "Low disk space: ${available_gb}GB available"
    else
        success "Disk space OK: ${available_gb}GB available"
    fi
    
    # Check rclone configuration
    if command -v rclone &> /dev/null && rclone listremotes | grep -q "do-spaces:"; then
        success "Remote backup configured"
    else
        warning "Remote backup not configured"
    fi
    
    success "Backup system health check complete"
}

# ============================================
# Main Function
# ============================================

show_usage() {
    echo "Usage: $0 <command> [options]"
    echo
    echo "Commands:"
    echo "  create [name]     Create a new backup (optional custom name)"
    echo "  restore <name>    Restore from backup"
    echo "  list              List all available backups"
    echo "  cleanup [days]    Clean up backups older than N days (default: 7)"
    echo "  sync              Sync backups to remote storage"
    echo "  health            Check backup system health"
    echo
    echo "Examples:"
    echo "  $0 create                    # Create backup with timestamp"
    echo "  $0 create pre-migration      # Create backup with custom name"
    echo "  $0 restore backup_20231210   # Restore specific backup"
    echo "  $0 cleanup 30                # Keep backups for 30 days"
}

main() {
    local command="$1"
    
    case "$command" in
        create)
            create_backup "$2"
            ;;
        restore)
            restore_backup "$2"
            ;;
        list)
            list_backups
            ;;
        cleanup)
            cleanup_backups "$2"
            ;;
        sync)
            sync_to_remote
            ;;
        health)
            health_check
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
