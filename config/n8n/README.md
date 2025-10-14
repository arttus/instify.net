# n8n Configuration Management

This directory contains persistent configuration for n8n workflows and credentials that are automatically imported during deployment.

## Directory Structure

```
config/n8n/
├── README.md              # This file
├── workflows/             # Workflow JSON files (exported with --separate)
├── credentials/           # Credential JSON files (encrypted)
├── scripts/               # Import/export scripts
│   ├── export-config.sh   # Export current n8n configuration
│   ├── import-config.sh   # Import configuration to n8n
│   └── backup-config.sh   # Create timestamped backups
└── examples/              # Example workflow and credential files
```

## How It Works

### During Deployment
1. The deployment script starts all services including n8n
2. After n8n is ready, it automatically runs `import-config.sh`
3. All workflows and credentials in this directory are imported into n8n
4. You can access n8n at `https://n8n.yourdomain.com` with your configured credentials

### Making Changes
1. Use the n8n web interface to create/modify workflows and credentials
2. When you're ready to persist changes, run: `./config/n8n/scripts/export-config.sh`
3. This exports your current n8n configuration to the config files
4. Commit the changes to version control if desired
5. On next deployment, your changes will be automatically restored

## Scripts Usage

### Export Configuration
```bash
# Export all workflows and credentials from running n8n
./config/n8n/scripts/export-config.sh
```

### Import Configuration
```bash
# Import all workflows and credentials to running n8n
./config/n8n/scripts/import-config.sh
```

## Current Configuration

### Workflows (3)
- `ai-receptionist-rag-2025.json` - AI Receptionist with RAG capabilities
- `conversation-summarization.json` - Conversation summarization workflow
- `knowledge-base-ingestion-2025.json` - Knowledge base ingestion workflow

### Credentials (7)
- OpenAI API credentials (encrypted)
- PostgreSQL database credentials (encrypted)
- Additional service credentials (encrypted)

## Security

- **Credentials**: Exported credentials are encrypted using n8n's internal encryption
- **Environment Variables**: Sensitive data should use environment variables, not hardcoded values
- **File Permissions**: Config files are readable by the deploy user and n8n container
- **Version Control**: You can safely commit workflow files; credentials are encrypted

## Troubleshooting

### Import Fails
- Check that n8n is fully started and healthy
- Verify file permissions on config files
- Check deployment logs for specific error messages

### Workflows Not Appearing
- Ensure workflow JSON files are in the `workflows/` directory
- Check that workflow files have valid JSON syntax
- Verify n8n container has read access to config files

### Credentials Not Working
- Credentials are imported with their encrypted values
- Environment variables referenced in credentials must be set in the container
- Check that credential files are in the `credentials/` directory
