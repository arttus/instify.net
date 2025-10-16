# ============================================
# ODEUO File Watcher Service
# Automated file ingestion for knowledge base
# ============================================

FROM node:20-alpine

# Install system dependencies for PDF parsing
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Create necessary directories
RUN mkdir -p /app/logs /app/data

# Set permissions
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose health check port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start the service
CMD ["node", "dist/index.js"]

