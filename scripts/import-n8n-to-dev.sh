#!/bin/bash

# Import n8n workflows and credentials to local development environment
# This script runs locally and imports directly to the local n8n container

set -e

CONTAINER="odeuo-n8n"
LOCAL_N8N_DIR="config/n8n"

echo "🚀 Starting n8n import to local development..."

# Function to copy credentials directly to n8n data directory
copy_credentials() {
    echo "🔐 Copying credentials to n8n data directory..."

    # Create credentials directory in n8n container if it doesn't exist
    docker exec "$CONTAINER" mkdir -p /home/node/.n8n/credentials

    for cred_file in "$LOCAL_N8N_DIR/credentials"/*.json; do
        if [ -f "$cred_file" ]; then
            cred_name=$(basename "$cred_file")
            echo "  🔑 Copying credential: $cred_name"

            # Copy credential file directly to n8n credentials directory
            docker cp "$cred_file" "$CONTAINER:/home/node/.n8n/credentials/$cred_name"
        fi
    done
}

# Function to get project ID from n8n database
get_n8n_project_id() {
    # Get the first personal project ID
    # Use a subquery to avoid the SET output
    PROJECT_ID=$(docker exec odeuo-postgres psql -U odeuo -d odeuo -t -A -c "SELECT id FROM n8n.project WHERE type = 'personal' LIMIT 1;" 2>/dev/null | tr -d ' \n')

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
            existing=$(docker exec odeuo-postgres psql -U odeuo -d odeuo -t -A -c "SELECT id FROM n8n.workflow_entity WHERE TRIM(id) = '$workflow_id';" 2>/dev/null | tr -d ' \n')

            if [ -n "$existing" ]; then
                echo "  ⏭️  Skipping workflow: $workflow_name (already exists)"
                continue
            fi

            echo "  📄 Importing workflow: $workflow_name"

            # Extract JSON components
            jq -c '.nodes' "$workflow_file" > /tmp/nodes.json
            jq -c '.connections' "$workflow_file" > /tmp/connections.json
            jq -c '.settings' "$workflow_file" > /tmp/settings.json

            # Copy JSON files to postgres container
            docker cp /tmp/nodes.json odeuo-postgres:/tmp/nodes.json > /dev/null 2>&1
            docker cp /tmp/connections.json odeuo-postgres:/tmp/connections.json > /dev/null 2>&1
            docker cp /tmp/settings.json odeuo-postgres:/tmp/settings.json > /dev/null 2>&1

            # Execute SQL to insert workflow
            docker exec odeuo-postgres bash -c "psql -U odeuo -d odeuo << 'EOSQL'
SET search_path TO n8n;
INSERT INTO workflow_entity (id, name, active, nodes, connections, settings, \"createdAt\", \"updatedAt\", \"versionId\")
VALUES ('$workflow_id', '$workflow_display_name', $workflow_active, pg_read_file('/tmp/nodes.json')::jsonb, pg_read_file('/tmp/connections.json')::jsonb, pg_read_file('/tmp/settings.json')::jsonb, NOW(), NOW(), '1');
INSERT INTO shared_workflow (\"workflowId\", \"projectId\", role, \"createdAt\", \"updatedAt\")
VALUES ('$workflow_id', '$PROJECT_ID', 'workflow:owner', NOW(), NOW());
EOSQL
" > /dev/null 2>&1

            # Clean up temp files
            rm /tmp/nodes.json /tmp/connections.json /tmp/settings.json
            docker exec odeuo-postgres rm /tmp/nodes.json /tmp/connections.json /tmp/settings.json 2>/dev/null || true

            echo "    ✅ Imported successfully"
        fi
    done
}

# Function to copy workflows to n8n data directory
copy_workflows() {
    echo "📋 Copying workflows to n8n data directory..."

    # Create workflows directory in n8n container if it doesn't exist
    docker exec "$CONTAINER" mkdir -p /home/node/.n8n/workflows

    for workflow_file in "$LOCAL_N8N_DIR/workflows"/*.json; do
        if [ -f "$workflow_file" ]; then
            workflow_name=$(basename "$workflow_file")
            echo "  📄 Copying workflow: $workflow_name"

            # Copy workflow file directly to n8n workflows directory
            docker cp "$workflow_file" "$CONTAINER:/home/node/.n8n/workflows/$workflow_name"
        fi
    done
}

# Check if n8n is running
echo "🔍 Checking n8n status..."
if ! docker exec "$CONTAINER" n8n --version > /dev/null 2>&1; then
    echo "❌ Error: n8n container is not running or not accessible"
    echo "💡 Try starting it with: docker-compose up -d n8n"
    exit 1
fi

echo "✅ n8n is running"

# Copy credentials first (workflows may depend on them)
copy_credentials

# Import workflows using direct database insertion
import_workflows

echo "🎉 n8n import completed successfully!"
echo ""
echo "You can now access your workflows at:"
echo "  - http://localhost:5678"
echo "  - http://n8n.odeuo.local"
echo ""
echo "Note: You may need to reconfigure credentials with actual API keys in the n8n interface."

