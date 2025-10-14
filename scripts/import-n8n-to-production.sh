#!/bin/bash

# Import n8n workflows and credentials to production
# This script runs locally and imports via SSH to the production server

set -e

SERVER="deploy@167.71.86.216"
CONTAINER="instify-n8n-prod"
LOCAL_N8N_DIR="config/n8n"

echo "🚀 Starting n8n import to production..."

# Function to copy credentials directly to n8n data directory
copy_credentials() {
    echo "🔐 Copying credentials to n8n data directory..."

    # Create credentials directory in n8n container if it doesn't exist
    ssh "$SERVER" "docker exec $CONTAINER mkdir -p /home/node/.n8n/credentials"

    for cred_file in "$LOCAL_N8N_DIR/credentials"/*.json; do
        if [ -f "$cred_file" ]; then
            cred_name=$(basename "$cred_file")
            echo "  🔑 Copying credential: $cred_name"

            # Copy credential file directly to n8n credentials directory
            scp "$cred_file" "$SERVER:/tmp/$cred_name"
            ssh "$SERVER" "docker cp /tmp/$cred_name $CONTAINER:/home/node/.n8n/credentials/$cred_name && rm /tmp/$cred_name"
        fi
    done
}

# Function to import workflows
import_workflows() {
    echo "📋 Importing workflows..."

    for workflow_file in "$LOCAL_N8N_DIR/workflows"/*.json; do
        if [ -f "$workflow_file" ]; then
            workflow_name=$(basename "$workflow_file")
            echo "  📄 Importing workflow: $workflow_name"

            # Copy workflow file to server and import via docker cp
            scp "$workflow_file" "$SERVER:/tmp/$workflow_name"
            ssh "$SERVER" "docker cp /tmp/$workflow_name $CONTAINER:/tmp/$workflow_name && docker exec $CONTAINER n8n import:workflow --input=/tmp/$workflow_name && rm /tmp/$workflow_name"
        fi
    done
}

# Function to copy workflows to n8n data directory
copy_workflows() {
    echo "📋 Copying workflows to n8n data directory..."

    # Create workflows directory in n8n container if it doesn't exist
    ssh "$SERVER" "docker exec $CONTAINER mkdir -p /home/node/.n8n/workflows"

    for workflow_file in "$LOCAL_N8N_DIR/workflows"/*.json; do
        if [ -f "$workflow_file" ]; then
            workflow_name=$(basename "$workflow_file")
            echo "  📄 Copying workflow: $workflow_name"

            # Copy workflow file directly to n8n workflows directory
            scp "$workflow_file" "$SERVER:/tmp/$workflow_name"
            ssh "$SERVER" "docker cp /tmp/$workflow_name $CONTAINER:/home/node/.n8n/workflows/$workflow_name && rm /tmp/$workflow_name"
        fi
    done
}

# Check if n8n is running
echo "🔍 Checking n8n status..."
if ! ssh "$SERVER" "docker exec $CONTAINER n8n --version" > /dev/null 2>&1; then
    echo "❌ Error: n8n container is not running or not accessible"
    exit 1
fi

echo "✅ n8n is running"

# Copy credentials first (workflows may depend on them)
copy_credentials

# Copy workflows
copy_workflows

# Restart n8n to pick up the new files
echo "🔄 Restarting n8n to load new configurations..."
ssh "$SERVER" "cd instify && docker-compose -f docker-compose.prod.yml restart n8n"

echo "🎉 n8n import completed successfully!"
echo ""
echo "You can now access your workflows at: https://n8n.instify.net"
echo "Note: You may need to reconfigure credentials with actual API keys in the n8n interface."
