# File Watcher Setup Guide

## Overview

The File Watcher service provides automated ingestion of knowledge base documents into the n8n workflow system. It monitors the `RAG-data` folder and automatically processes markdown, PDF, and Word documents.

## Quick Start

### 1. Prerequisites

Ensure the following are running:
- PostgreSQL database
- n8n service with `knowledge-base-ingestion-2025` workflow active
- Docker and Docker Compose

### 2. Configuration

The file watcher is pre-configured with sensible defaults. To customize, edit your `.env` file:

```bash
# File Watcher Configuration
DEFAULT_TENANT_ID=default-tenant
DEFAULT_CONTENT_TYPE=legal_knowledge
```

### 3. Start the Service

**Development:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up file-watcher
```

**Production:**
```bash
docker-compose up -d file-watcher
```

### 4. Verify Operation

Check the service is running:
```bash
# Check container status
docker ps | grep file-watcher

# Check logs
docker logs odeuo-file-watcher

# Check health endpoint
curl http://localhost:8082/health
```

## How It Works

### File Processing Flow

1. **Detection**: Chokidar watches the `RAG-data` folder for file changes
2. **Extraction**: Content is extracted based on file type (MD/PDF/DOCX)
3. **Metadata**: Title, category, and tags are derived from filename/frontmatter
4. **Validation**: Content length and file size are validated
5. **Ingestion**: Data is sent to n8n webhook endpoint
6. **State Tracking**: File hash and status are saved to prevent duplicates

### Supported File Types

| Extension | Library | Features |
|-----------|---------|----------|
| `.md`, `.markdown` | gray-matter | Frontmatter parsing, markdown preservation |
| `.pdf` | pdf-parse | Text extraction, metadata extraction |
| `.docx` | mammoth | Text conversion, basic formatting |

### Metadata Extraction

#### Markdown Frontmatter
```yaml
---
title: "Legal Fees and Billing Guide"
category: "billing"
tags: ["fees", "billing", "payment"]
content_type: "guide"
---
```

#### Filename Convention
Pattern: `{category}_{subcategory}_{type}.md`

Example: `legal_fees_billing.md`
- Derived category: `legal_fees`
- Derived title: `legal fees billing`

#### Default Values
- `content_type`: `legal_knowledge` (from env)
- `category`: `general` (if not detected)
- `tenant_id`: `default-tenant` (from env)
- `source`: `file-watcher`
- `tags`: `["auto-ingested", file-extension, category]`

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WATCH_PATH` | `/data/RAG-data` | Path to monitor |
| `SCAN_ON_STARTUP` | `true` | Process existing files on startup |
| `DEBOUNCE_DELAY` | `2000` | Milliseconds to wait before processing |
| `MAX_FILE_SIZE` | `10485760` | Maximum file size (10MB) |
| `MIN_CONTENT_LENGTH` | `50` | Minimum content length |
| `N8N_WEBHOOK_URL` | `http://n8n:5678/webhook/knowledge/ingest` | n8n webhook endpoint |
| `MAX_RETRIES` | `3` | Number of retry attempts |
| `RETRY_DELAY` | `2000` | Milliseconds between retries |
| `DEFAULT_TENANT_ID` | `default-tenant` | Default tenant for ingestion |
| `DEFAULT_CONTENT_TYPE` | `legal_knowledge` | Default content type |
| `LOG_LEVEL` | `info` | Logging level (error/warn/info/debug) |

### Docker Compose Override

To customize for your environment, create a `docker-compose.override.yml`:

```yaml
version: '3.8'

services:
  file-watcher:
    environment:
      - DEFAULT_TENANT_ID=my-tenant
      - LOG_LEVEL=debug
      - MAX_FILE_SIZE=20971520  # 20MB
    volumes:
      - /custom/path:/data/RAG-data:ro
```

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:8082/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "file-watcher",
  "timestamp": "2025-10-15T10:30:00Z",
  "n8n": "connected",
  "metrics": {
    "totalFiles": 6,
    "successfulIngestions": 6,
    "failedIngestions": 0
  }
}
```

### Status Endpoint

```bash
curl http://localhost:8082/status
```

Provides detailed information about all tracked files.

### Metrics Endpoint

```bash
curl http://localhost:8082/metrics
```

Prometheus-compatible metrics for monitoring integration.

### Logs

View logs in real-time:
```bash
docker logs -f odeuo-file-watcher
```

Log files are stored in:
- `./logs/file-watcher/file-watcher-YYYY-MM-DD.log`
- `./logs/file-watcher/error-YYYY-MM-DD.log`

## Usage Examples

### Adding a New Document

1. Create a markdown file with frontmatter:

```markdown
---
title: "Client Onboarding Process"
category: "onboarding"
tags: ["client", "process", "intake"]
content_type: "procedure"
---

# Client Onboarding Process

This document describes the step-by-step process...
```

2. Save it to `RAG-data/client_onboarding_process.md`

3. The file watcher will automatically:
   - Detect the new file
   - Extract content and metadata
   - Send to n8n workflow
   - Log the result

### Updating an Existing Document

1. Edit the file in `RAG-data/`
2. Save the changes
3. The file watcher will:
   - Detect the change (via hash comparison)
   - Re-extract and re-ingest
   - Update the knowledge base

### Adding PDF Documents

1. Place PDF file in `RAG-data/`
2. The file watcher will:
   - Extract text content
   - Use filename as title
   - Derive category from filename
   - Ingest to knowledge base

## Troubleshooting

### Files Not Being Processed

**Check 1: Service Running**
```bash
docker ps | grep file-watcher
```

**Check 2: Logs**
```bash
docker logs odeuo-file-watcher | tail -50
```

**Check 3: File Permissions**
```bash
ls -la RAG-data/
```

**Check 4: n8n Connection**
```bash
curl http://localhost:8082/health
```

### n8n Workflow Not Receiving Data

**Verify workflow is active:**
1. Access n8n at `http://n8n.odeuo.local` (dev) or `https://n8n.odeuo.net` (prod)
2. Open `knowledge-base-ingestion-2025` workflow
3. Ensure it's activated (toggle in top-right)

**Test webhook manually:**
```bash
curl -X POST http://n8n:5678/webhook/knowledge/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Document",
    "content": "This is test content for the knowledge base.",
    "content_type": "test",
    "category": "testing",
    "tenant_id": "default-tenant",
    "source": "manual-test",
    "tags": ["test"]
  }'
```

### High Memory Usage

**Check current usage:**
```bash
docker stats odeuo-file-watcher
```

**Solutions:**
1. Reduce `MAX_FILE_SIZE` in environment variables
2. Increase container memory limit in docker-compose
3. Process fewer files at once

### Failed Ingestions

**View failed files:**
```bash
curl http://localhost:8082/status | jq '.files[] | select(.status=="failed")'
```

**Trigger manual rescan:**
```bash
curl -X POST http://localhost:8082/rescan
```

**Check state file:**
```bash
docker exec odeuo-file-watcher cat /app/data/ingestion-state.json
```

## Maintenance

### Clearing State

To force re-ingestion of all files:

```bash
# Stop the service
docker stop odeuo-file-watcher

# Remove state file
docker volume rm odeuo_file_watcher_data

# Restart the service
docker start odeuo-file-watcher
```

### Log Rotation

Logs are automatically rotated daily and kept for:
- Regular logs: 7 days
- Error logs: 14 days

### Backup State

```bash
docker cp odeuo-file-watcher:/app/data/ingestion-state.json ./backups/
```

## Integration with CI/CD

### Automated Deployment

The file watcher is automatically deployed with the main stack:

```bash
# Development
./deploy.sh

# Production
./deploy-subdomains.sh
```

### Health Checks in Deployment

Add to your deployment script:

```bash
# Wait for file-watcher to be healthy
echo "Waiting for file-watcher..."
for i in {1..30}; do
  if curl -f http://localhost:8082/health > /dev/null 2>&1; then
    echo "File-watcher is healthy"
    break
  fi
  sleep 2
done
```

## Best Practices

1. **File Naming**: Use descriptive, consistent naming patterns
2. **Frontmatter**: Include metadata in markdown files for better categorization
3. **File Size**: Keep files under 10MB for optimal processing
4. **Testing**: Test new document types in development first
5. **Monitoring**: Regularly check health and status endpoints
6. **Logs**: Review logs for any processing errors

## Security Considerations

1. **Read-Only Mount**: RAG-data is mounted read-only to prevent accidental modifications
2. **Network Isolation**: Service only communicates with n8n within Docker network
3. **No External Exposure**: Health endpoints only accessible on localhost
4. **State Persistence**: State data is stored in Docker volume, not in code

## Support

For issues or questions:
1. Check logs: `docker logs odeuo-file-watcher`
2. Review this documentation
3. Check n8n workflow configuration
4. Contact the ODEUO development team

