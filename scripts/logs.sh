#!/bin/bash
# ============================================
# ODEUO Logs Management Script
# View, filter, and manage application logs
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
}

# ============================================
# Log Functions
# ============================================

show_all_logs() {
    local follow="${1:-false}"
    local lines="${2:-100}"
    
    log "Showing logs from all services (last $lines lines)"
    
    if [[ "$follow" == "true" ]]; then
        docker compose logs -f --tail="$lines"
    else
        docker compose logs --tail="$lines"
    fi
}

show_service_logs() {
    local service="$1"
    local follow="${2:-false}"
    local lines="${3:-100}"
    
    if [[ -z "$service" ]]; then
        error "Service name is required"
        return 1
    fi
    
    log "Showing logs for service: $service (last $lines lines)"
    
    if [[ "$follow" == "true" ]]; then
        docker compose logs -f --tail="$lines" "$service"
    else
        docker compose logs --tail="$lines" "$service"
    fi
}

show_error_logs() {
    local service="${1:-all}"
    local lines="${2:-50}"
    
    log "Showing error logs (last $lines lines)"
    
    if [[ "$service" == "all" ]]; then
        docker compose logs --tail="$lines" 2>&1 | grep -i -E "(error|exception|failed|fatal|panic|critical)"
    else
        docker compose logs --tail="$lines" "$service" 2>&1 | grep -i -E "(error|exception|failed|fatal|panic|critical)"
    fi
}

show_access_logs() {
    local lines="${1:-100}"
    
    log "Showing Nginx access logs (last $lines lines)"
    
    if docker compose ps nginx | grep -q "Up"; then
        docker compose exec nginx tail -n "$lines" /var/log/nginx/access.log
    else
        error "Nginx container is not running"
    fi
}

show_database_logs() {
    local lines="${1:-50}"
    
    log "Showing PostgreSQL logs (last $lines lines)"
    
    if docker compose ps postgres | grep -q "Up"; then
        docker compose logs --tail="$lines" postgres
    else
        error "PostgreSQL container is not running"
    fi
}

search_logs() {
    local pattern="$1"
    local service="${2:-all}"
    local lines="${3:-100}"
    
    if [[ -z "$pattern" ]]; then
        error "Search pattern is required"
        return 1
    fi
    
    log "Searching for pattern: '$pattern' in $service logs"
    
    if [[ "$service" == "all" ]]; then
        docker compose logs --tail="$lines" 2>&1 | grep -i "$pattern"
    else
        docker compose logs --tail="$lines" "$service" 2>&1 | grep -i "$pattern"
    fi
}

export_logs() {
    local service="${1:-all}"
    local output_file="${2:-logs_$(date +%Y%m%d_%H%M%S).txt}"
    
    log "Exporting logs to: $output_file"
    
    if [[ "$service" == "all" ]]; then
        docker compose logs > "$output_file"
    else
        docker compose logs "$service" > "$output_file"
    fi
    
    success "Logs exported to: $output_file"
    log "File size: $(du -h "$output_file" | cut -f1)"
}

clean_logs() {
    local confirm="${1:-false}"
    
    if [[ "$confirm" != "true" ]]; then
        warning "This will remove all Docker logs for this project"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Log cleanup cancelled"
            return 0
        fi
    fi
    
    log "Cleaning Docker logs..."
    
    # Get container IDs
    local containers=$(docker compose ps -q)
    
    if [[ -n "$containers" ]]; then
        for container in $containers; do
            local container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/^.//')
            log "Cleaning logs for: $container_name"
            
            # Truncate log file
            docker exec "$container" sh -c "truncate -s 0 /proc/1/fd/1" 2>/dev/null || true
            docker exec "$container" sh -c "truncate -s 0 /proc/1/fd/2" 2>/dev/null || true
        done
        
        success "Docker logs cleaned"
    else
        warning "No running containers found"
    fi
    
    # Clean local log files
    local log_dirs=("$PROJECT_DIR/logs" "$PROJECT_DIR/backups")
    
    for log_dir in "${log_dirs[@]}"; do
        if [[ -d "$log_dir" ]]; then
            log "Cleaning log files in: $log_dir"
            find "$log_dir" -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
        fi
    done
    
    success "Log cleanup complete"
}

show_log_stats() {
    log "Log statistics:"
    echo
    
    # Docker logs size
    local containers=$(docker compose ps -q)
    local total_size=0
    
    if [[ -n "$containers" ]]; then
        echo "📊 Container Log Sizes:"
        for container in $containers; do
            local container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/^.//')
            local log_file=$(docker inspect --format='{{.LogPath}}' "$container")
            
            if [[ -f "$log_file" ]]; then
                local size=$(du -h "$log_file" 2>/dev/null | cut -f1)
                echo "   $container_name: $size"
            fi
        done
        echo
    fi
    
    # Local log files
    if [[ -d "$PROJECT_DIR/logs" ]]; then
        echo "📁 Local Log Files:"
        find "$PROJECT_DIR/logs" -name "*.log" -type f -exec du -h {} \; 2>/dev/null | sort -hr | head -10
        echo
    fi
    
    # Nginx logs
    if docker compose ps nginx | grep -q "Up"; then
        echo "🌐 Nginx Log Stats:"
        docker compose exec nginx sh -c "
            if [[ -f /var/log/nginx/access.log ]]; then
                echo '   Access log entries: '$(wc -l < /var/log/nginx/access.log)
                echo '   Access log size: '$(du -h /var/log/nginx/access.log | cut -f1)
            fi
            if [[ -f /var/log/nginx/error.log ]]; then
                echo '   Error log entries: '$(wc -l < /var/log/nginx/error.log)
                echo '   Error log size: '$(du -h /var/log/nginx/error.log | cut -f1)
            fi
        " 2>/dev/null || true
        echo
    fi
    
    # Database logs
    if docker compose ps postgres | grep -q "Up"; then
        echo "🗄️  Database Log Stats:"
        local db_log_count=$(docker compose logs postgres | wc -l)
        echo "   PostgreSQL log entries: $db_log_count"
        echo
    fi
}

tail_multiple_services() {
    local services=("$@")
    
    if [[ ${#services[@]} -eq 0 ]]; then
        services=("odeuo-web" "postgres" "redis" "nginx")
    fi
    
    log "Tailing logs from services: ${services[*]}"
    
    # Create named pipes for each service
    local temp_dir=$(mktemp -d)
    local pids=()
    
    for service in "${services[@]}"; do
        local pipe="$temp_dir/$service.pipe"
        mkfifo "$pipe"
        
        # Start log tailing in background
        (docker compose logs -f --tail=10 "$service" | sed "s/^/[$service] /" > "$pipe") &
        pids+=($!)
        
        # Read from pipe with color coding
        (while read -r line; do
            case "$service" in
                "odeuo-web") echo -e "${GREEN}$line${NC}" ;;
                "postgres") echo -e "${BLUE}$line${NC}" ;;
                "redis") echo -e "${YELLOW}$line${NC}" ;;
                "nginx") echo -e "${CYAN}$line${NC}" ;;
                *) echo "$line" ;;
            esac
        done < "$pipe") &
        pids+=($!)
    done
    
    # Wait for interrupt
    trap "kill ${pids[*]} 2>/dev/null; rm -rf $temp_dir; exit 0" INT TERM
    wait
}

# ============================================
# Usage
# ============================================

show_usage() {
    echo "Usage: $0 <command> [options]"
    echo
    echo "Commands:"
    echo "  all [follow] [lines]         Show logs from all services"
    echo "  service <name> [follow] [lines]  Show logs from specific service"
    echo "  errors [service] [lines]     Show error logs"
    echo "  access [lines]               Show Nginx access logs"
    echo "  database [lines]             Show PostgreSQL logs"
    echo "  search <pattern> [service] [lines]  Search logs for pattern"
    echo "  export [service] [file]      Export logs to file"
    echo "  clean [confirm]              Clean old logs"
    echo "  stats                        Show log statistics"
    echo "  tail [services...]           Tail multiple services with colors"
    echo
    echo "Options:"
    echo "  follow    Follow logs in real-time (true/false)"
    echo "  lines     Number of lines to show (default: 100)"
    echo "  service   Service name (odeuo-web, postgres, redis, nginx, n8n, livekit)"
    echo
    echo "Examples:"
    echo "  $0 all true 50               # Follow all logs, last 50 lines"
    echo "  $0 service odeuo-web       # Show web app logs"
    echo "  $0 errors postgres           # Show PostgreSQL errors"
    echo "  $0 search 'database error'   # Search for database errors"
    echo "  $0 export odeuo-web        # Export web app logs"
    echo "  $0 tail odeuo-web postgres # Tail web and database logs"
}

# ============================================
# Main Function
# ============================================

main() {
    local command="$1"
    
    case "$command" in
        all)
            show_all_logs "$2" "$3"
            ;;
        service)
            show_service_logs "$2" "$3" "$4"
            ;;
        errors)
            show_error_logs "$2" "$3"
            ;;
        access)
            show_access_logs "$2"
            ;;
        database)
            show_database_logs "$2"
            ;;
        search)
            search_logs "$2" "$3" "$4"
            ;;
        export)
            export_logs "$2" "$3"
            ;;
        clean)
            clean_logs "$2"
            ;;
        stats)
            show_log_stats
            ;;
        tail)
            shift
            tail_multiple_services "$@"
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
