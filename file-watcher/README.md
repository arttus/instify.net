# File Watcher Service

Automated file ingestion service for the ODEUO knowledge base system. Monitors the RAG-data folder and automatically ingests markdown, PDF, and Word documents into the n8n knowledge base workflow.

## Features

- **Multi-format Support**: Handles `.md`, `.pdf`, and `.docx` files
- **Automatic Detection**: Watches for new files and modifications
- **Smart Processing**: 
  - Hash-based change detection to avoid duplicate ingestions
  - Debouncing to handle rapid file saves
  - File size validation
  - Content length validation
- **Robust Error Handling**:
  - Retry logic with exponential backoff
  - State persistence across restarts
  - Detailed logging
- **Monitoring**: Health check and metrics endpoints
- **Metadata Extraction**:
  - Markdown frontmatter parsing
  - Filename-based category detection
  - Automatic tagging

## Architecture

```
file-watcher/
├── src/
│   ├── index.ts           # Main entry point & HTTP server
│   ├── watcher.ts         # File watching logic
│   ├── state.ts           # State management
│   ├── ingestion.ts       # n8n webhook integration
│   ├── logger.ts          # Winston logging setup
│   ├── types.ts           # TypeScript interfaces
│   └── extractors/        # Content extraction
│       ├── index.ts       # Extractor router
│       ├── markdown.ts    # Markdown parser
│       ├── pdf.ts         # PDF text extraction
│       └── word.ts        # Word document parser
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WATCH_PATH` | `/data/RAG-data` | Path to monitor for files |
| `SCAN_ON_STARTUP` | `true` | Scan existing files on startup |
| `DEBOUNCE_DELAY` | `2000` | Milliseconds to wait before processing |
| `MAX_FILE_SIZE` | `10485760` | Maximum file size (10MB) |
| `MIN_CONTENT_LENGTH` | `50` | Minimum content length |
| `N8N_WEBHOOK_URL` | `http://n8n:5678/webhook/knowledge/ingest` | n8n webhook endpoint |
| `MAX_RETRIES` | `3` | Number of retry attempts |
| `DEFAULT_TENANT_ID` | `default-tenant` | Default tenant for ingestion |
| `DEFAULT_CONTENT_TYPE` | `legal_knowledge` | Default content type |
| `PORT` | `8080` | HTTP server port |
| `LOG_LEVEL` | `info` | Logging level |

## API Endpoints

### GET /health
Health check endpoint for container orchestration.

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

### GET /status
Detailed status with file-level information.

**Response:**
```json
{
  "service": "file-watcher",
  "timestamp": "2025-10-15T10:30:00Z",
  "watchPath": "/data/RAG-data",
  "metrics": { ... },
  "files": [
    {
      "file": "/data/RAG-data/legal_fees_billing.md",
      "status": "success",
      "lastIngested": "2025-10-15T10:25:00Z",
      "size": 12345,
      "attempts": 0
    }
  ]
}
```

### GET /metrics
Prometheus-compatible metrics endpoint.

### POST /rescan
Trigger a manual rescan of all files.

## File Processing

### Supported File Types

1. **Markdown (`.md`, `.markdown`)**
   - Extracts frontmatter metadata
   - Preserves markdown formatting
   - Supports YAML frontmatter

2. **PDF (`.pdf`)**
   - Extracts plain text
   - Preserves paragraph structure
   - Extracts document metadata

3. **Word (`.docx`)**
   - Converts to plain text
   - Preserves basic formatting
   - Extracts document properties

### Metadata Extraction

#### From Markdown Frontmatter
```yaml
---
title: "Legal Fees and Billing Guide"
category: "billing"
tags: ["fees", "billing", "payment"]
content_type: "guide"
---
```

#### From Filename
Pattern: `{category}_{subcategory}_{type}.md`

Example: `legal_fees_billing.md`
- Category: `legal_fees`
- Title: `legal fees billing`

#### Default Values
- `content_type`: From `DEFAULT_CONTENT_TYPE` env var
- `category`: `general` (if not detected)
- `tenant_id`: From `DEFAULT_TENANT_ID` env var
- `source`: `file-watcher`
- `tags`: `["auto-ingested", file-extension, category]`

## State Management

The service maintains a state file (`/app/data/ingestion-state.json`) that tracks:
- File hash (MD5) for change detection
- Last ingestion timestamp
- Ingestion status (success/failed/pending)
- Number of retry attempts
- Last error message

This ensures:
- Files are only re-ingested when content changes
- State persists across service restarts
- Failed ingestions can be retried

## Logging

Logs are written to:
- Console (for Docker logs)
- `/app/logs/file-watcher-YYYY-MM-DD.log` (daily rotation)
- `/app/logs/error-YYYY-MM-DD.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## Docker Integration

The service runs as a Docker container and integrates with the ODEUO stack:

```yaml
file-watcher:
  build: ./file-watcher
  container_name: odeuo-file-watcher
  restart: unless-stopped
  environment:
    - N8N_WEBHOOK_URL=http://n8n:5678/webhook/knowledge/ingest
    - DEFAULT_TENANT_ID=default-tenant
  volumes:
    - ./RAG-data:/data/RAG-data:ro
    - ./logs/file-watcher:/app/logs
    - file_watcher_data:/app/data
  networks:
    - odeuo-network
  depends_on:
    - n8n
```

## Development

### Local Development
```bash
cd file-watcher
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Docker Build
```bash
docker build -t odeuo-file-watcher .
```

## Troubleshooting

### Files Not Being Ingested

1. Check logs: `docker logs odeuo-file-watcher`
2. Verify n8n is running: `docker ps | grep n8n`
3. Check health endpoint: `curl http://localhost:8080/health`
4. Verify file permissions on RAG-data folder

### n8n Connection Issues

1. Verify webhook URL is correct
2. Check n8n workflow is active
3. Test webhook manually:
```bash
curl -X POST http://n8n:5678/webhook/knowledge/ingest \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content","tenant_id":"default-tenant"}'
```

### High Memory Usage

- Reduce `MAX_FILE_SIZE` if processing large files
- Check for stuck processing (view `/status` endpoint)
- Restart service: `docker restart odeuo-file-watcher`

## License

UNLICENSED - Proprietary to ODEUO

