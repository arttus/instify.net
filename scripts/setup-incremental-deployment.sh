#!/bin/bash

# ============================================
# Setup Incremental Deployment on Production Server
# Run this once on the production server after initial deployment
# ============================================

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Configuration
DEPLOY_DIR="/home/deploy/odeuo"
BACKUP_DIR="/home/deploy/backups"

log "Setting up incremental deployment system..."

# Create backup directory
log "Creating backup directory..."
mkdir -p "$BACKUP_DIR"

# Ensure we're in the deployment directory
cd "$DEPLOY_DIR"

# Make scripts executable
log "Making scripts executable..."
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x config/n8n/scripts/*.sh 2>/dev/null || true

# Create a simple health check endpoint if it doesn't exist
log "Setting up health check endpoint..."
if [[ ! -f "web/pages/api/health.js" ]] && [[ ! -f "web/app/api/health/route.js" ]]; then
    warn "Health check endpoint not found. You may need to create one manually."
    warn "Expected at: web/pages/api/health.js or web/app/api/health/route.js"
fi

# Set up log rotation for Docker containers
log "Setting up log rotation..."
sudo tee /etc/logrotate.d/docker-containers > /dev/null << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

# Create a simple monitoring script
log "Creating monitoring script..."
cat > scripts/monitor-services.sh << 'EOF'
#!/bin/bash

# Simple service monitoring script
COMPOSE_FILE="docker-compose.prod.yml"

echo "=== Service Status ==="
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo "=== Health Checks ==="

# Check main app
if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Main app: Healthy"
else
    echo "❌ Main app: Unhealthy"
fi

# Check n8n
if curl -f -s http://localhost:5678/healthz > /dev/null 2>&1; then
    echo "✅ n8n: Healthy"
else
    echo "❌ n8n: Unhealthy"
fi

# Check database
if docker exec odeuo-postgres-prod pg_isready -U odeuo > /dev/null 2>&1; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Unhealthy"
fi

echo ""
echo "=== Resource Usage ==="
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
EOF

chmod +x scripts/monitor-services.sh

# Create a cleanup script
log "Creating cleanup script..."
cat > scripts/cleanup.sh << 'EOF'
#!/bin/bash

# Cleanup old Docker resources
echo "Cleaning up Docker resources..."
docker system prune -f

# Clean old backups (keep last 10)
echo "Cleaning old backups..."
cd /home/deploy/backups
ls -t backup_* 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true

# Clean old logs
echo "Cleaning old logs..."
find /var/log -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true

echo "Cleanup completed"
EOF

chmod +x scripts/cleanup.sh

# Set up a simple cron job for cleanup
log "Setting up automated cleanup..."
(crontab -l 2>/dev/null; echo "0 2 * * 0 $DEPLOY_DIR/scripts/cleanup.sh >> /var/log/odeuo-cleanup.log 2>&1") | crontab -

# Create a deployment status file
log "Creating deployment tracking..."
echo "$(date): Incremental deployment system setup completed" > .deployment-status
echo "Last deployed commit: $(git rev-parse HEAD)" >> .deployment-status

log "✅ Incremental deployment system setup completed!"
log ""
log "Available commands:"
log "  ./scripts/update-production.sh --help"
log "  ./scripts/monitor-services.sh"
log "  ./scripts/cleanup.sh"
log ""
log "The system is now ready for incremental deployments!"
