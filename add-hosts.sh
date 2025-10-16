#!/bin/bash

# ============================================
# Add ODEUO Local Hosts Entries
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root. Use: sudo ./add-hosts.sh"
fi

log "Adding ODEUO local hosts entries..."

# Backup hosts file
HOSTS_FILE="/etc/hosts"
BACKUP_FILE="/etc/hosts.backup.$(date +%s)"

log "Creating backup: $BACKUP_FILE"
cp "$HOSTS_FILE" "$BACKUP_FILE"
success "Backup created"

# Check if entries already exist
if grep -q "odeuo.local" "$HOSTS_FILE"; then
    warning "ODEUO hosts entries already exist in $HOSTS_FILE"
    echo ""
    echo "Current entries:"
    grep "odeuo.local" "$HOSTS_FILE" || true
    exit 0
fi

# Add entries
log "Adding hosts entries..."

cat >> "$HOSTS_FILE" << 'EOF'

# ODEUO Local Development
127.0.0.1    odeuo.local
127.0.0.1    admin.odeuo.local
127.0.0.1    api.odeuo.local
127.0.0.1    crm.odeuo.local
127.0.0.1    n8n.odeuo.local
127.0.0.1    redis.odeuo.local
EOF

success "Hosts entries added"

# Verify entries
echo ""
log "Verifying entries..."
echo ""
grep "odeuo.local" "$HOSTS_FILE"
echo ""

# Flush DNS cache on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    log "Flushing DNS cache..."
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
    success "DNS cache flushed"
fi

echo ""
success "ODEUO hosts entries added successfully!"
echo ""
echo "You can now access:"
echo "  • http://odeuo.local"
echo "  • http://admin.odeuo.local"
echo "  • http://api.odeuo.local"
echo "  • http://crm.odeuo.local (Twenty CRM)"
echo "  • http://n8n.odeuo.local"
echo "  • http://redis.odeuo.local"
echo ""
echo "Backup saved to: $BACKUP_FILE"

