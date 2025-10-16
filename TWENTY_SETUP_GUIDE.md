# Twenty CRM Setup Guide for ODEUO

This guide will help you set up Twenty CRM in your ODEUO development environment.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available RAM
- Access to your `.env` file

## Step 1: Configure Environment Variables

1. **Open your `.env` file** (or create one from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Add/Update Twenty CRM configuration**:
   
   Add these variables to your `.env` file if they don't exist:

   ```ini
   # ============================================
   # Twenty CRM Configuration
   # ============================================
   
   # Twenty Database Configuration
   TWENTY_DB_USER=twenty
   TWENTY_DB_PASSWORD=your_secure_twenty_password_here
   TWENTY_DB_NAME=twenty
   
   # Twenty Security (generate with: openssl rand -base64 32)
   TWENTY_APP_SECRET=your_generated_secret_here
   
   # Twenty URLs (for development)
   TWENTY_SERVER_URL=http://crm.odeuo.local
   TWENTY_FRONT_BASE_URL=http://crm.odeuo.local
   
   # Twenty Logging
   TWENTY_LOG_LEVEL=debug
   ```

3. **Generate secure secrets**:
   ```bash
   # Generate a secure password for Twenty database
   openssl rand -base64 32
   
   # Generate a secure app secret for Twenty
   openssl rand -base64 32
   ```
   
   Copy these values into your `.env` file for `TWENTY_DB_PASSWORD` and `TWENTY_APP_SECRET`.

## Step 2: Configure Local DNS (Optional but Recommended)

To access Twenty CRM via `crm.odeuo.local`, add this to your `/etc/hosts` file:

```bash
sudo nano /etc/hosts
```

Add this line:
```
127.0.0.1 crm.odeuo.local
```

Save and exit (Ctrl+X, then Y, then Enter).

## Step 3: Build and Start Services

1. **Rebuild the postgres container** (to include Twenty database initialization):
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build postgres
   ```

2. **Start all services**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

3. **Watch the logs** to ensure Twenty starts correctly:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f twenty-server
   ```

   You should see:
   - Database migrations running
   - Server starting on port 3000 (internal)
   - "Application is running" message

## Step 4: Access Twenty CRM

Once the services are running, you can access Twenty CRM at:

- **Via subdomain**: http://crm.odeuo.local (if you configured /etc/hosts)
- **Via port**: http://localhost:3002

## Step 5: Initial Setup

1. **Open Twenty CRM** in your browser
2. **Create your workspace** - You'll be prompted to create an account
3. **Set up your profile** - Add your name and preferences
4. **Start using Twenty** - Create contacts, companies, and deals!

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx (Port 80)                      │
│                  Routes: crm.odeuo.local                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Twenty Server (Port 3002)                   │
│              - REST API & GraphQL API                        │
│              - Web UI                                        │
│              - Authentication                                │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────────┐
│  PostgreSQL (5432)   │          │    Redis (6379)          │
│  - Database: twenty  │          │    - Cache & Queues      │
│  - User: twenty      │          │                          │
└──────────────────────┘          └──────────────────────────┘
           ▲                                  ▲
           │                                  │
           └──────────────┬───────────────────┘
                          │
                          ▼
           ┌──────────────────────────────┐
           │   Twenty Worker              │
           │   - Background Jobs          │
           │   - Email Notifications      │
           │   - Webhooks                 │
           └──────────────────────────────┘
```

## Troubleshooting

### Twenty server won't start

1. **Check database connection**:
   ```bash
   docker-compose exec postgres psql -U twenty -d twenty -c "SELECT 1;"
   ```

2. **Check environment variables**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml config | grep TWENTY
   ```

3. **View detailed logs**:
   ```bash
   docker-compose logs twenty-server --tail=100
   ```

### Database migration errors

If you see migration errors, you can manually run migrations:

```bash
docker-compose exec twenty-server npm run database:migrate
```

### Can't access via crm.odeuo.local

1. **Verify /etc/hosts entry**:
   ```bash
   cat /etc/hosts | grep crm.odeuo.local
   ```

2. **Check nginx is running**:
   ```bash
   docker-compose ps nginx
   ```

3. **Test nginx configuration**:
   ```bash
   docker-compose exec nginx nginx -t
   ```

### Reset Twenty database

If you need to start fresh:

```bash
# Stop services
docker-compose down

# Remove Twenty database
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "DROP DATABASE IF EXISTS twenty;"
docker-compose exec postgres psql -U odeuo -d odeuo_dev -c "DROP USER IF EXISTS twenty;"

# Remove Twenty data volume
docker volume rm odeuo-twenty-data-dev

# Restart services (database will be recreated)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Useful Commands

```bash
# View Twenty server logs
docker-compose logs -f twenty-server

# View Twenty worker logs
docker-compose logs -f twenty-worker

# Restart Twenty services
docker-compose restart twenty-server twenty-worker

# Access Twenty database
docker-compose exec postgres psql -U twenty -d twenty

# Check Twenty server health
curl http://localhost:3002/health

# View Twenty container stats
docker-compose stats twenty-server twenty-worker
```

## Integration with Other Services

### With n8n Automation

Twenty can be integrated with n8n for automation:

1. **Access n8n**: http://n8n.odeuo.local
2. **Add Twenty credentials** in n8n
3. **Create workflows** to automate CRM tasks

### With Your Main Application

You can integrate Twenty with your main ODEUO application:

- **REST API**: http://crm.odeuo.local/rest
- **GraphQL API**: http://crm.odeuo.local/graphql
- **API Documentation**: http://crm.odeuo.local/graphql (GraphQL Playground)

## Next Steps

1. **Explore the UI** - Familiarize yourself with Twenty's interface
2. **Import data** - Import existing contacts and companies
3. **Set up integrations** - Connect with email, calendar, etc.
4. **Create workflows** - Use n8n to automate CRM tasks
5. **Customize** - Configure fields, views, and pipelines

## Resources

- **Twenty Documentation**: https://twenty.com/developers
- **Twenty GitHub**: https://github.com/twentyhq/twenty
- **Twenty Discord**: https://discord.gg/cx5n4Jzs57
- **ODEUO Integration Docs**: See `TWENTY_INTEGRATION.md`

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs twenty-server`
2. Review this guide's troubleshooting section
3. Check Twenty's official documentation
4. Ask in Twenty's Discord community

