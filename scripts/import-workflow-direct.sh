#!/bin/bash

# Import a single workflow directly into the n8n database
# This bypasses the n8n import command which has foreign key issues

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <workflow-json-file>"
    exit 1
fi

WORKFLOW_FILE="$1"
CONTAINER="odeuo-postgres"

if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "Error: Workflow file not found: $WORKFLOW_FILE"
    exit 1
fi

echo "📋 Importing workflow directly to database: $(basename "$WORKFLOW_FILE")"

# Extract workflow data from JSON
WORKFLOW_ID=$(jq -r '.id' "$WORKFLOW_FILE")
WORKFLOW_NAME=$(jq -r '.name' "$WORKFLOW_FILE")
WORKFLOW_ACTIVE=$(jq -r '.active' "$WORKFLOW_FILE")
WORKFLOW_NODES=$(jq -c '.nodes' "$WORKFLOW_FILE")
WORKFLOW_CONNECTIONS=$(jq -c '.connections' "$WORKFLOW_FILE")
WORKFLOW_SETTINGS=$(jq -c '.settings' "$WORKFLOW_FILE")

# Get project ID
PROJECT_ID=$(docker exec "$CONTAINER" psql -U odeuo -d odeuo -t -A -c "SELECT id FROM n8n.project WHERE type = 'personal' LIMIT 1;" 2>/dev/null | tr -d ' \n')

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not find project in n8n database"
    exit 1
fi

echo "  Workflow ID: $WORKFLOW_ID"
echo "  Workflow Name: $WORKFLOW_NAME"
echo "  Project ID: $PROJECT_ID"

# Check if workflow already exists
EXISTING=$(docker exec "$CONTAINER" psql -U odeuo -d odeuo -t -A -c "SELECT id FROM n8n.workflow_entity WHERE TRIM(id) = '$WORKFLOW_ID';" 2>/dev/null | tr -d ' \n')

if [ -n "$EXISTING" ]; then
    echo "⏭️  Workflow already exists, skipping"
    exit 0
fi

# Write workflow data to temp files to avoid shell escaping issues
echo "$WORKFLOW_NODES" > /tmp/nodes.json
echo "$WORKFLOW_CONNECTIONS" > /tmp/connections.json
echo "$WORKFLOW_SETTINGS" > /tmp/settings.json

# Copy JSON files to container
docker cp /tmp/nodes.json "$CONTAINER:/tmp/nodes.json"
docker cp /tmp/connections.json "$CONTAINER:/tmp/connections.json"
docker cp /tmp/settings.json "$CONTAINER:/tmp/settings.json"

# Execute SQL using psql with file input for JSON
echo "Executing SQL..."
docker exec "$CONTAINER" bash -c "psql -U odeuo -d odeuo << 'EOSQL'
SET search_path TO n8n;

-- Insert workflow
INSERT INTO workflow_entity (id, name, active, nodes, connections, settings, \"createdAt\", \"updatedAt\", \"versionId\")
VALUES (
    '$WORKFLOW_ID',
    '$WORKFLOW_NAME',
    $WORKFLOW_ACTIVE,
    pg_read_file('/tmp/nodes.json')::jsonb,
    pg_read_file('/tmp/connections.json')::jsonb,
    pg_read_file('/tmp/settings.json')::jsonb,
    NOW(),
    NOW(),
    '1'
);

-- Insert shared_workflow entry
INSERT INTO shared_workflow (\"workflowId\", \"projectId\", role, \"createdAt\", \"updatedAt\")
VALUES (
    '$WORKFLOW_ID',
    '$PROJECT_ID',
    'workflow:owner',
    NOW(),
    NOW()
);
EOSQL
"

# Clean up temp files
rm /tmp/nodes.json /tmp/connections.json /tmp/settings.json
docker exec "$CONTAINER" rm /tmp/nodes.json /tmp/connections.json /tmp/settings.json 2>/dev/null || true

echo "✅ Workflow imported successfully!"

