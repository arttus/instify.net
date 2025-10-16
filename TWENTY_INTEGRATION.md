# Twenty CRM Integration Guide

## Overview

Twenty CRM has been integrated into the ODEUO Docker Compose setup. Twenty is an open-source CRM platform that provides contact management, deal tracking, and workflow automation.

## Architecture

The Twenty integration includes:

- **twenty-server**: Main API and frontend server (port 3002 in dev)
- **twenty-worker**: Background job processor for async tasks
- **Shared PostgreSQL**: Uses the existing `postgres` service with a separate `twenty` database
- **Shared Redis**: Uses the existing `redis` service for caching and job queues

## Getting Started

### 1. Run the Setup Script

The setup script has been updated to generate Twenty-specific environment variables:

```bash
./setup.sh dev
```

This will:
- Generate `TWENTY_APP_SECRET` (required for security)
- Generate `TWENTY_DB_PASSWORD` (database password)
- Create necessary log directories
- Generate all other ODEUO environment variables

### 2. Deploy with Docker Compose

Start the development environment with Twenty:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

This will start:
- ODEUO services (web, n8n, Livekit, etc.)
- Twenty services (server and worker)
- All supporting services (PostgreSQL, Redis, Nginx, etc.)

### 3. Access Twenty

Once deployed, access Twenty at:

- **Development**: http://localhost:3002
- **Production**: https://your-domain.com/crm (after Nginx configuration)

## Environment Variables

The following Twenty-specific variables are configured in `.env`:

```ini
# Twenty CRM Database
TWENTY_DB_USER=twenty
TWENTY_DB_PASSWORD=<generated>
TWENTY_DB_NAME=twenty

# Twenty Security
TWENTY_APP_SECRET=<generated>

# Twenty URLs
TWENTY_SERVER_URL=http://localhost:3002
TWENTY_FRONT_BASE_URL=http://localhost:3002

# Logging
TWENTY_LOG_LEVEL=debug  # development, info for production
```

## Database Setup

Twenty uses a separate PostgreSQL database (`twenty`) from the main ODEUO database (`odeuo`).

### Initial Database Migration

The Twenty server automatically runs migrations on startup. If you need to manually run migrations:

```bash
docker-compose exec twenty-server npm run typeorm migration:run
```

### Database Backup

Backups are handled by the existing `postgres-backup` service which backs up all databases including Twenty.

## Features

### Twenty Server
- REST API for CRM operations
- GraphQL API support
- Web-based UI
- Authentication and authorization
- Contact, company, and deal management

### Twenty Worker
- Async job processing
- Email notifications
- Webhook handling
- Data synchronization
- Background tasks

## Integration with ODEUO Services

### With n8n Automation
Twenty can be integrated with n8n workflows for:
- Automated contact creation from external sources
- Deal pipeline automation
- Email notifications
- Data synchronization

### With Livekit Voice/Video
Twenty can integrate with Livekit for:
- In-app video calls with contacts
- Voice call recording
- Real-time communication

### With AI Services
Twenty can leverage:
- OpenAI API for AI-powered insights
- Anthropic API for advanced analysis

## Monitoring and Logs

### View Twenty Logs

```bash
# Server logs
docker-compose logs -f twenty-server

# Worker logs
docker-compose logs -f twenty-worker

# Or view log files
tail -f logs/twenty/app.log
tail -f logs/twenty-worker/app.log
```

### Health Checks

Both services include health checks:

```bash
# Check Twenty server health
curl http://localhost:3002/health

# Check via Docker
docker-compose ps | grep twenty
```

## Production Deployment

For production deployment:

1. Update `.env.production` with:
   ```ini
   TWENTY_SERVER_URL=https://your-domain.com/crm
   TWENTY_FRONT_BASE_URL=https://your-domain.com/crm
   TWENTY_LOG_LEVEL=info
   ```

2. Configure Nginx to route `/crm` to Twenty server:
   ```nginx
   location /crm {
     proxy_pass http://twenty-server:3000;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

3. Deploy with production compose:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Troubleshooting

### Twenty Server Won't Start

Check logs:
```bash
docker-compose logs twenty-server
```

Common issues:
- Database not ready: Wait for PostgreSQL to be healthy
- Redis connection: Verify Redis is running
- APP_SECRET not set: Ensure `.env` has `TWENTY_APP_SECRET`

### Database Connection Issues

```bash
# Test database connection
docker-compose exec postgres psql -U twenty -d twenty -c "SELECT 1"

# Check database exists
docker-compose exec postgres psql -U postgres -l | grep twenty
```

### Worker Not Processing Jobs

```bash
# Check worker logs
docker-compose logs -f twenty-worker

# Verify Redis connection
docker-compose exec redis redis-cli ping
```

## Useful Commands

```bash
# Restart Twenty services
docker-compose restart twenty-server twenty-worker

# Rebuild Twenty images
docker-compose build --no-cache twenty-server twenty-worker

# Access Twenty database
docker-compose exec postgres psql -U twenty -d twenty

# View Twenty server stats
docker-compose stats twenty-server twenty-worker
```

## Documentation

- **Twenty Official Docs**: https://twenty.com/developers
- **Twenty GitHub**: https://github.com/twentyhq/twenty
- **Twenty Docker Setup**: https://twenty.com/developers/section/self-hosting/docker-compose

## Support

For issues with Twenty integration:
1. Check the logs: `docker-compose logs twenty-server`
2. Verify environment variables: `docker-compose config | grep TWENTY`
3. Check Twenty GitHub issues: https://github.com/twentyhq/twenty/issues
4. Review ODEUO documentation for service integration

