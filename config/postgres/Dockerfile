# Use pgvector/pgvector image which has pgvector pre-installed for PostgreSQL 16
FROM pgvector/pgvector:pg16

# Copy custom configuration
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Copy database initialization scripts
COPY init-twenty-db.sh /docker-entrypoint-initdb.d/02-init-twenty-db.sh
RUN chmod +x /docker-entrypoint-initdb.d/02-init-twenty-db.sh
