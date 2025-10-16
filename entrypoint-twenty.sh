#!/bin/bash
set -e

# Export all environment variables so they're available to child processes
export PG_DATABASE_URL="${PG_DATABASE_URL}"
export ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}"
export REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}"
export APP_SECRET="${APP_SECRET}"
export REDIS_URL="${REDIS_URL}"
export SERVER_URL="${SERVER_URL}"
export FRONT_BASE_URL="${FRONT_BASE_URL}"
export NODE_ENV="${NODE_ENV:-development}"
export LOG_LEVEL="${LOG_LEVEL:-debug}"
export ENABLE_DB_MIGRATIONS="${ENABLE_DB_MIGRATIONS:-false}"

# Debug: Print environment variables
echo "Environment variables set:"
echo "PG_DATABASE_URL: ${PG_DATABASE_URL:0:50}..."
echo "ACCESS_TOKEN_SECRET: ${ACCESS_TOKEN_SECRET:0:50}..."
echo "REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET:0:50}..."
echo "APP_SECRET: ${APP_SECRET:0:50}..."

# Run the original entrypoint
exec /app/entrypoint.sh "$@"

