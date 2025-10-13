// ============================================
// Drizzle ORM Configuration
// Database migrations and schema management
// ============================================

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  // Schema and output configuration
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  
  // Database driver and connection
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  
  // Migration settings
  verbose: true,
  strict: true,
  
  // Table configuration
  tablesFilter: ['!pg_*', '!information_schema*'],
  
  // Schema filters (if using multiple schemas)
  schemaFilter: ['public'],
  
} satisfies Config;
