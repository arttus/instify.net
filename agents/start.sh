#!/bin/bash

# ============================================
# Instify Voice AI Agent Startup Script
# ============================================

set -e

echo "🚀 Starting Instify Voice AI Agent..."

# ============================================
# Environment Setup
# ============================================

# Set default values
export AGENT_MODE=${AGENT_MODE:-dev}
export AGENT_LOG_LEVEL=${AGENT_LOG_LEVEL:-INFO}
export PYTHONPATH=/app/src:$PYTHONPATH
export PYTHONUNBUFFERED=1

# ============================================
# Health Check Function
# ============================================
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    # Check LiveKit server
    if ! curl -s http://livekit:7880/health > /dev/null; then
        echo "⚠️  Warning: LiveKit server not accessible"
    else
        echo "✅ LiveKit server is running"
    fi
    
    # Check Redis
    if ! python -c "import redis; r=redis.Redis(host='redis', port=6379); r.ping()" 2>/dev/null; then
        echo "⚠️  Warning: Redis not accessible"
    else
        echo "✅ Redis is running"
    fi
    
    # Check required environment variables
    if [ -z "$LIVEKIT_API_KEY" ] || [ -z "$LIVEKIT_API_SECRET" ]; then
        echo "❌ Error: LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set"
        exit 1
    fi
    
    if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
        echo "❌ Error: At least one AI service API key must be set (OPENAI_API_KEY or ANTHROPIC_API_KEY)"
        exit 1
    fi
    
    echo "✅ All dependencies checked"
}

# ============================================
# Startup Logic
# ============================================

# Check dependencies
check_dependencies

# Create necessary directories
mkdir -p /app/logs /app/models /app/data

# Set permissions
chown -R agent:agent /app/logs /app/models /app/data 2>/dev/null || true

echo "🎯 Agent Mode: $AGENT_MODE"
echo "📊 Log Level: $AGENT_LOG_LEVEL"
echo "🔗 LiveKit URL: ${LIVEKIT_URL:-ws://livekit:7880}"

# ============================================
# Start Agent Based on Mode
# ============================================

case "$AGENT_MODE" in
    "dev")
        echo "🔧 Starting in development mode..."
        if [ "$HOT_RELOAD" = "true" ]; then
            echo "🔥 Hot reload enabled"
            exec pnpm dev
        else
            exec node dist/main.js dev
        fi
        ;;
    "console")
        echo "💻 Starting in console mode..."
        exec node dist/main.js console
        ;;
    "production")
        echo "🏭 Starting in production mode..."
        exec node dist/main.js start
        ;;
    *)
        echo "❌ Unknown agent mode: $AGENT_MODE"
        echo "Valid modes: dev, console, production"
        exit 1
        ;;
esac
