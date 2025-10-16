#!/bin/bash

# Import n8n workflows and credentials to production
# This script runs locally and imports via SSH to the production server

set -e

SERVER="deploy@167.71.86.216"
CONTAINER="odeuo-n8n-prod"
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

# Function to get project ID from n8n database
get_n8n_project_id() {
    # Get the first personal project ID
    PROJECT_ID=$(ssh "$SERVER" "docker exec odeuo-postgres-prod psql -U odeuo -d odeuo -t -A -c \"SELECT id FROM n8n.project WHERE type = 'personal' LIMIT 1;\" 2>/dev/null | tr -d ' \n'")

    if [ -z "$PROJECT_ID" ]; then
        echo "⚠️  Warning: Could not find project in n8n database"
        echo "   This might be the first import. Workflows will be imported without project assignment."
        return 1
    fi

    echo "  Using Project ID: $PROJECT_ID"
    return 0
}

# Function to import workflows directly into database
import_workflows() {
    echo "📋 Importing workflows..."

    # Get project ID
    get_n8n_project_id
    HAS_PROJECT_ID=$?

    if [ $HAS_PROJECT_ID -ne 0 ]; then
        echo "❌ Error: Could not get project ID. Cannot import workflows."
        return 1
    fi

    for workflow_file in "$LOCAL_N8N_DIR/workflows"/*.json; do
        if [ -f "$workflow_file" ]; then
            workflow_name=$(basename "$workflow_file")

            # Get workflow data from JSON
            workflow_id=$(jq -r '.id' "$workflow_file")
            workflow_display_name=$(jq -r '.name' "$workflow_file")
            workflow_active=$(jq -r '.active' "$workflow_file")

            # Check if workflow already exists (use TRIM to handle padded CHAR fields)
            existing=$(ssh "$SERVER" "docker exec odeuo-postgres-prod psql -U odeuo -d odeuo -t -A -c \"SELECT id FROM n8n.workflow_entity WHERE TRIM(id) = '$workflow_id';\" 2>/dev/null | tr -d ' \n'")

            if [ -n "$existing" ]; then
                echo "  ⏭️  Skipping workflow: $workflow_name (already exists)"
                continue
            fi

            echo "  📄 Importing workflow: $workflow_name"

            # Extract JSON components
            jq -c '.nodes' "$workflow_file" > /tmp/nodes.json
            jq -c '.connections' "$workflow_file" > /tmp/connections.json
            jq -c '.settings' "$workflow_file" > /tmp/settings.json

            # Copy JSON files to server
            scp /tmp/nodes.json "$SERVER:/tmp/nodes.json" > /dev/null 2>&1
            scp /tmp/connections.json "$SERVER:/tmp/connections.json" > /dev/null 2>&1
            scp /tmp/settings.json "$SERVER:/tmp/settings.json" > /dev/null 2>&1

            # Copy to postgres container and execute SQL
            ssh "$SERVER" "docker cp /tmp/nodes.json odeuo-postgres-prod:/tmp/nodes.json && \
                          docker cp /tmp/connections.json odeuo-postgres-prod:/tmp/connections.json && \
                          docker cp /tmp/settings.json odeuo-postgres-prod:/tmp/settings.json && \
                          docker exec odeuo-postgres-prod bash -c \"psql -U odeuo -d odeuo << 'EOSQL'
SET search_path TO n8n;
INSERT INTO workflow_entity (id, name, active, nodes, connections, settings, \\\"createdAt\\\", \\\"updatedAt\\\", \\\"versionId\\\")
VALUES ('$workflow_id', '$workflow_display_name', $workflow_active, pg_read_file('/tmp/nodes.json')::jsonb, pg_read_file('/tmp/connections.json')::jsonb, pg_read_file('/tmp/settings.json')::jsonb, NOW(), NOW(), '1');
INSERT INTO shared_workflow (\\\"workflowId\\\", \\\"projectId\\\", role, \\\"createdAt\\\", \\\"updatedAt\\\")
VALUES ('$workflow_id', '$PROJECT_ID', 'workflow:owner', NOW(), NOW());
EOSQL
\" && \
                          docker exec odeuo-postgres-prod rm /tmp/nodes.json /tmp/connections.json /tmp/settings.json && \
                          rm /tmp/nodes.json /tmp/connections.json /tmp/settings.json" > /dev/null 2>&1

            # Clean up local temp files
            rm -f /tmp/nodes.json /tmp/connections.json /tmp/settings.json

            echo "    ✅ Imported successfully"
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

# Import workflows using direct database insertion
import_workflows

# Restart n8n to pick up the new workflows
echo "🔄 Restarting n8n to load new workflows..."
ssh "$SERVER" "cd odeuo && docker-compose -f docker-compose.prod.yml restart n8n"

echo "🎉 n8n import completed successfully!"
echo ""
echo "You can now access your workflows at: https://n8n.odeuo.net"
echo "Note: You may need to reconfigure credentials with actual API keys in the n8n interface."
