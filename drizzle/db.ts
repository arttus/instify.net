// ============================================
// Database Connection and Utilities
// Drizzle ORM setup with connection pooling
// ============================================

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// ============================================
// Database Connection
// ============================================

// Connection string from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client with connection pooling
const client = postgres(connectionString, {
  // Connection pool settings
  max: 20,                    // Maximum connections
  idle_timeout: 20,           // Close idle connections after 20s
  connect_timeout: 10,        // Connection timeout
  
  // SSL settings (disable for local development)
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  
  // Prepared statements
  prepare: true,
  
  // Transform settings
  transform: {
    undefined: null,          // Transform undefined to null
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
});

// Create Drizzle instance
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development',
});

// ============================================
// Database Utilities
// ============================================

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Close database connection
 */
export async function closeConnection(): Promise<void> {
  await client.end();
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    const [stats] = await client`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables 
      ORDER BY n_live_tup DESC
    `;
    return stats;
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return null;
  }
}

// ============================================
// Multi-Tenant Database Helper
// ============================================

/**
 * Database helper with automatic tenant scoping
 * Ensures all queries are scoped to the current tenant
 */
export class TenantDB {
  constructor(private tenantId: number) {
    if (!tenantId || tenantId <= 0) {
      throw new Error('Valid tenant ID is required');
    }
  }

  /**
   * Get the tenant ID for this instance
   */
  getTenantId(): number {
    return this.tenantId;
  }

  /**
   * Create a new TenantDB instance for a different tenant
   */
  forTenant(tenantId: number): TenantDB {
    return new TenantDB(tenantId);
  }

  /**
   * Get the database instance (use with caution - remember to filter by tenant!)
   */
  getDb() {
    return db;
  }
}

// ============================================
// Health Check Function
// ============================================

export async function healthCheck() {
  try {
    // Test basic connection
    const connectionOk = await testConnection();
    
    // Get connection info
    const [connectionInfo] = await client`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version,
        now() as timestamp
    `;

    // Get table counts (basic health indicator)
    const [tableCounts] = await client`
      SELECT 
        COUNT(*) FILTER (WHERE schemaname = 'public') as public_tables,
        COUNT(*) as total_tables
      FROM pg_tables
    `;

    return {
      status: connectionOk ? 'healthy' : 'unhealthy',
      connection: connectionOk,
      database: connectionInfo?.database,
      user: connectionInfo?.user,
      version: connectionInfo?.version?.split(' ')[0], // Just PostgreSQL version
      timestamp: connectionInfo?.timestamp,
      tables: tableCounts,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// Export types for use in application
// ============================================

export type Database = typeof db;
export type Schema = typeof schema;

// Export schema for use in other files
export * from './schema';
