#!/bin/bash

# ============================================
# File Watcher Test Script
# ============================================
# This script helps test the file watcher service
# by creating test files and monitoring the results

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAG_DATA_DIR="$PROJECT_ROOT/RAG-data"
HEALTH_ENDPOINT="http://localhost:8082/health"
STATUS_ENDPOINT="http://localhost:8082/status"

# ============================================
# Helper Functions
# ============================================

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================
# Test Functions
# ============================================

check_service() {
    log "Checking file-watcher service..."
    
    if ! docker ps | grep -q "odeuo-file-watcher"; then
        error "File watcher service is not running"
        echo "Start it with: docker-compose up -d file-watcher"
        exit 1
    fi
    
    success "File watcher service is running"
}

check_health() {
    log "Checking health endpoint..."
    
    if curl -f -s "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
        success "Health endpoint is responding"
        curl -s "$HEALTH_ENDPOINT" | jq '.'
    else
        error "Health endpoint is not responding"
        exit 1
    fi
}

create_test_markdown() {
    log "Creating test markdown file..."
    
    local filename="$RAG_DATA_DIR/test_document_$(date +%s).md"
    
    cat > "$filename" << 'EOF'
---
title: "Test Document for File Watcher"
category: "testing"
tags: ["test", "automated", "file-watcher"]
content_type: "test"
---

# Test Document

This is a test document created to verify the file watcher service is working correctly.

## Features Being Tested

1. File detection
2. Markdown parsing
3. Frontmatter extraction
4. Content ingestion

## Expected Behavior

The file watcher should:
- Detect this new file
- Extract the frontmatter metadata
- Parse the markdown content
- Send it to the n8n webhook
- Log the successful ingestion

## Timestamp

Created at: $(date)
EOF
    
    success "Created test file: $filename"
    echo "$filename"
}

create_test_pdf() {
    log "Creating test PDF file..."
    warn "PDF creation requires additional tools. Skipping for now."
    warn "To test PDFs, manually add a PDF file to $RAG_DATA_DIR"
}

watch_logs() {
    log "Watching file-watcher logs (Ctrl+C to stop)..."
    docker logs -f odeuo-file-watcher
}

view_status() {
    log "Fetching current status..."
    
    if curl -f -s "$STATUS_ENDPOINT" > /dev/null 2>&1; then
        curl -s "$STATUS_ENDPOINT" | jq '.'
    else
        error "Status endpoint is not responding"
    fi
}

view_metrics() {
    log "Fetching metrics..."
    
    if curl -f -s "http://localhost:8082/metrics" > /dev/null 2>&1; then
        curl -s "http://localhost:8082/metrics"
    else
        error "Metrics endpoint is not responding"
    fi
}

trigger_rescan() {
    log "Triggering manual rescan..."
    
    if curl -f -s -X POST "http://localhost:8082/rescan" > /dev/null 2>&1; then
        success "Rescan triggered successfully"
    else
        error "Failed to trigger rescan"
    fi
}

cleanup_test_files() {
    log "Cleaning up test files..."
    
    local count=$(find "$RAG_DATA_DIR" -name "test_document_*.md" | wc -l)
    
    if [ "$count" -gt 0 ]; then
        find "$RAG_DATA_DIR" -name "test_document_*.md" -delete
        success "Removed $count test file(s)"
    else
        warn "No test files found to clean up"
    fi
}

run_full_test() {
    log "Running full test suite..."
    echo ""
    
    # Check service
    check_service
    echo ""
    
    # Check health
    check_health
    echo ""
    
    # Create test file
    local test_file=$(create_test_markdown)
    echo ""
    
    # Wait for processing
    log "Waiting 5 seconds for file to be processed..."
    sleep 5
    echo ""
    
    # Check status
    view_status
    echo ""
    
    # Check if test file was processed
    log "Checking if test file was ingested..."
    if curl -s "$STATUS_ENDPOINT" | jq -e ".files[] | select(.file | contains(\"test_document\"))" > /dev/null; then
        success "Test file was successfully ingested!"
    else
        warn "Test file not found in status. Check logs for details."
    fi
    echo ""
    
    # Cleanup
    read -p "Clean up test file? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cleanup_test_files
    fi
}

show_help() {
    cat << EOF
File Watcher Test Script

Usage: $0 [command]

Commands:
  check         Check if service is running and healthy
  health        Show health status
  status        Show detailed status
  metrics       Show Prometheus metrics
  test          Create a test markdown file
  rescan        Trigger manual rescan
  logs          Watch service logs (Ctrl+C to stop)
  cleanup       Remove test files
  full          Run full test suite
  help          Show this help message

Examples:
  $0 check              # Check service status
  $0 test               # Create test file
  $0 full               # Run complete test
  $0 logs               # Watch logs in real-time

EOF
}

# ============================================
# Main Script
# ============================================

case "${1:-help}" in
    check)
        check_service
        check_health
        ;;
    health)
        check_health
        ;;
    status)
        view_status
        ;;
    metrics)
        view_metrics
        ;;
    test)
        create_test_markdown
        ;;
    rescan)
        trigger_rescan
        ;;
    logs)
        watch_logs
        ;;
    cleanup)
        cleanup_test_files
        ;;
    full)
        run_full_test
        ;;
    help|*)
        show_help
        ;;
esac

