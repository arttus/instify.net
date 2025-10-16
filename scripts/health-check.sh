#!/bin/bash
# ============================================
# ODEUO Health Check Script
# Monitor system health and service status
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
DOMAIN="${DOMAIN:-localhost}"

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
# Health Check Functions
# ============================================

check_docker_services() {
    log "Checking Docker services..."
    
    local services=("postgres" "redis" "odeuo-web" "nginx" "n8n" "livekit")
    local healthy_count=0
    
    for service in "${services[@]}"; do
        if docker compose ps "$service" | grep -q "Up"; then
            success "$service is running"
            ((healthy_count++))
        else
            error "$service is not running"
        fi
    done
    
    log "Services status: $healthy_count/${#services[@]} healthy"
    
    if [[ $healthy_count -eq ${#services[@]} ]]; then
        success "All Docker services are healthy"
        return 0
    else
        warning "Some Docker services are unhealthy"
        return 1
    fi
}

check_database_health() {
    log "Checking database health..."
    
    # Check if PostgreSQL is responding
    if docker compose exec -T postgres pg_isready -U odeuo &>/dev/null; then
        success "Database is responding"
    else
        error "Database is not responding"
        return 1
    fi
    
    # Check database connection and basic query
    local db_stats=$(docker compose exec -T postgres psql -U odeuo -d odeuo -t -c "
        SELECT 
            current_database() as db,
            current_user as user,
            count(*) as table_count
        FROM information_schema.tables 
        WHERE table_schema = 'public';
    " 2>/dev/null)
    
    if [[ -n "$db_stats" ]]; then
        success "Database query successful"
        log "Database info: $db_stats"
    else
        error "Database query failed"
        return 1
    fi
    
    # Check database size
    local db_size=$(docker compose exec -T postgres psql -U odeuo -d odeuo -t -c "
        SELECT pg_size_pretty(pg_database_size('odeuo'));
    " 2>/dev/null | xargs)
    
    if [[ -n "$db_size" ]]; then
        log "Database size: $db_size"
    fi
    
    return 0
}

check_redis_health() {
    log "Checking Redis health..."
    
    # Check if Redis is responding
    if docker compose exec -T redis redis-cli ping | grep -q "PONG"; then
        success "Redis is responding"
    else
        error "Redis is not responding"
        return 1
    fi
    
    # Get Redis info
    local redis_info=$(docker compose exec -T redis redis-cli info server | grep "redis_version" | cut -d: -f2 | tr -d '\r')
    if [[ -n "$redis_info" ]]; then
        log "Redis version: $redis_info"
    fi
    
    # Check memory usage
    local memory_usage=$(docker compose exec -T redis redis-cli info memory | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
    if [[ -n "$memory_usage" ]]; then
        log "Redis memory usage: $memory_usage"
    fi
    
    return 0
}

check_web_application() {
    log "Checking web application health..."
    
    # Check internal health endpoint
    if docker compose exec -T odeuo-web curl -f http://localhost:3000/api/health &>/dev/null; then
        success "Internal web application health check passed"
    else
        error "Internal web application health check failed"
        return 1
    fi
    
    # Check external access
    local protocol="http"
    if [[ "$DOMAIN" != "localhost" ]]; then
        protocol="https"
    fi
    
    if curl -f -s "$protocol://$DOMAIN/health" &>/dev/null; then
        success "External web application access OK"
    else
        warning "External web application access failed"
    fi
    
    return 0
}

check_nginx_health() {
    log "Checking Nginx health..."
    
    # Check if Nginx configuration is valid
    if docker compose exec -T nginx nginx -t &>/dev/null; then
        success "Nginx configuration is valid"
    else
        error "Nginx configuration is invalid"
        return 1
    fi
    
    # Check if Nginx is serving requests
    if docker compose exec -T nginx curl -f http://localhost/health &>/dev/null; then
        success "Nginx is serving requests"
    else
        error "Nginx is not serving requests"
        return 1
    fi
    
    return 0
}

check_livekit_health() {
    log "Checking Livekit health..."
    
    # Check if Livekit is responding
    if docker compose exec -T livekit curl -f http://localhost:7880/ &>/dev/null; then
        success "Livekit is responding"
    else
        error "Livekit is not responding"
        return 1
    fi
    
    return 0
}

check_n8n_health() {
    log "Checking n8n health..."
    
    # Check if n8n is responding
    if docker compose exec -T n8n curl -f http://localhost:5678/healthz &>/dev/null; then
        success "n8n is responding"
    else
        error "n8n is not responding"
        return 1
    fi
    
    return 0
}

check_system_resources() {
    log "Checking system resources..."
    
    # Check disk space
    local disk_usage=$(df -h "$PROJECT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $disk_usage -lt 80 ]]; then
        success "Disk usage OK: ${disk_usage}%"
    elif [[ $disk_usage -lt 90 ]]; then
        warning "Disk usage high: ${disk_usage}%"
    else
        error "Disk usage critical: ${disk_usage}%"
    fi
    
    # Check memory usage (if available)
    if command -v free &> /dev/null; then
        local memory_usage=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
        if (( $(echo "$memory_usage < 80" | bc -l) )); then
            success "Memory usage OK: ${memory_usage}%"
        elif (( $(echo "$memory_usage < 90" | bc -l) )); then
            warning "Memory usage high: ${memory_usage}%"
        else
            error "Memory usage critical: ${memory_usage}%"
        fi
    fi
    
    # Check Docker stats
    log "Docker container resource usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -10
}

check_ssl_certificates() {
    if [[ "$DOMAIN" == "localhost" ]]; then
        log "Skipping SSL check for localhost"
        return 0
    fi
    
    log "Checking SSL certificates..."
    
    # Check if SSL certificate exists
    if docker compose exec -T nginx test -f /etc/nginx/ssl/cert.pem; then
        success "SSL certificate file exists"
    else
        warning "SSL certificate file not found"
        return 1
    fi
    
    # Check certificate expiration
    local cert_expiry=$(docker compose exec -T nginx openssl x509 -in /etc/nginx/ssl/cert.pem -noout -enddate 2>/dev/null | cut -d= -f2)
    if [[ -n "$cert_expiry" ]]; then
        log "SSL certificate expires: $cert_expiry"
        
        # Check if certificate expires within 30 days
        local expiry_timestamp=$(date -d "$cert_expiry" +%s 2>/dev/null || echo "0")
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [[ $days_until_expiry -gt 30 ]]; then
            success "SSL certificate is valid for $days_until_expiry days"
        elif [[ $days_until_expiry -gt 7 ]]; then
            warning "SSL certificate expires in $days_until_expiry days"
        else
            error "SSL certificate expires in $days_until_expiry days - renewal needed!"
        fi
    fi
    
    return 0
}

check_backups() {
    log "Checking backup system..."
    
    local backup_dir="$PROJECT_DIR/backups"
    
    if [[ -d "$backup_dir" ]]; then
        local backup_count=$(find "$backup_dir" -name "*.dump" | wc -l)
        if [[ $backup_count -gt 0 ]]; then
            success "Found $backup_count backup(s)"
            
            # Check latest backup age
            local latest_backup=$(find "$backup_dir" -name "*.dump" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
            if [[ -n "$latest_backup" ]]; then
                local backup_age=$(( ($(date +%s) - $(date -r "$latest_backup" +%s)) / 86400 ))
                if [[ $backup_age -le 1 ]]; then
                    success "Latest backup is $backup_age day(s) old"
                elif [[ $backup_age -le 7 ]]; then
                    warning "Latest backup is $backup_age day(s) old"
                else
                    error "Latest backup is $backup_age day(s) old - backup may be failing"
                fi
            fi
        else
            warning "No backups found"
        fi
    else
        warning "Backup directory does not exist"
    fi
}

# ============================================
# Main Health Check
# ============================================

run_full_health_check() {
    echo "🏥 ODEUO Health Check"
    echo "======================"
    echo "Domain: $DOMAIN"
    echo "Time: $(date)"
    echo ""
    
    local checks_passed=0
    local total_checks=0
    
    # Run all health checks
    local checks=(
        "check_docker_services"
        "check_database_health"
        "check_redis_health"
        "check_web_application"
        "check_nginx_health"
        "check_livekit_health"
        "check_n8n_health"
        "check_system_resources"
        "check_ssl_certificates"
        "check_backups"
    )
    
    for check in "${checks[@]}"; do
        echo ""
        if $check; then
            ((checks_passed++))
        fi
        ((total_checks++))
    done
    
    echo ""
    echo "======================"
    log "Health check complete: $checks_passed/$total_checks checks passed"
    
    if [[ $checks_passed -eq $total_checks ]]; then
        success "All health checks passed! 🎉"
        exit 0
    elif [[ $checks_passed -gt $((total_checks * 3 / 4)) ]]; then
        warning "Most health checks passed, but some issues detected"
        exit 1
    else
        error "Multiple health check failures detected"
        exit 2
    fi
}

# ============================================
# Quick Health Check
# ============================================

run_quick_health_check() {
    echo "🚀 Quick Health Check"
    echo "===================="
    
    # Check only critical services
    local critical_checks=0
    local total_critical=3
    
    if check_docker_services; then ((critical_checks++)); fi
    if check_database_health; then ((critical_checks++)); fi
    if check_web_application; then ((critical_checks++)); fi
    
    echo ""
    if [[ $critical_checks -eq $total_critical ]]; then
        success "All critical services are healthy! ✅"
        exit 0
    else
        error "Critical service failures detected! ❌"
        exit 1
    fi
}

# ============================================
# Usage
# ============================================

show_usage() {
    echo "Usage: $0 [quick|full]"
    echo
    echo "Options:"
    echo "  quick    Run quick health check (critical services only)"
    echo "  full     Run comprehensive health check (default)"
    echo
}

main() {
    local mode="${1:-full}"
    
    case "$mode" in
        quick)
            run_quick_health_check
            ;;
        full)
            run_full_health_check
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
