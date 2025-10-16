#!/bin/bash
set -e

# ============================================
# Twenty CRM Database Initialization Script
# ============================================
# This script creates the Twenty database and user
# It runs automatically when the postgres container starts

echo "Initializing Twenty CRM database..."

# Create Twenty database user if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create Twenty user if it doesn't exist
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${TWENTY_DB_USER:-twenty}') THEN
            CREATE USER ${TWENTY_DB_USER:-twenty} WITH PASSWORD '${TWENTY_DB_PASSWORD}';
            RAISE NOTICE 'User ${TWENTY_DB_USER:-twenty} created';
        ELSE
            RAISE NOTICE 'User ${TWENTY_DB_USER:-twenty} already exists';
        END IF;
    END
    \$\$;

    -- Create Twenty database if it doesn't exist
    SELECT 'CREATE DATABASE ${TWENTY_DB_NAME:-twenty} OWNER ${TWENTY_DB_USER:-twenty}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${TWENTY_DB_NAME:-twenty}')\gexec

    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE ${TWENTY_DB_NAME:-twenty} TO ${TWENTY_DB_USER:-twenty};
EOSQL

# Connect to the Twenty database and set up extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "${TWENTY_DB_NAME:-twenty}" <<-EOSQL
    -- Enable required extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Grant schema privileges
    GRANT ALL ON SCHEMA public TO ${TWENTY_DB_USER:-twenty};
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${TWENTY_DB_USER:-twenty};
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${TWENTY_DB_USER:-twenty};
    
    -- Set default privileges for future objects
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${TWENTY_DB_USER:-twenty};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${TWENTY_DB_USER:-twenty};
EOSQL

echo "Twenty CRM database initialization completed successfully!"

