import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Import schema from the parent directory
// This assumes the drizzle schema is in the parent directory
// We'll need to adjust this path based on the actual structure
const schema = {} as Record<string, unknown>; // TODO: Import actual schema

// Database connection
const connectionString = process.env.DATABASE_URL;

// Create postgres client only if connection string is available
let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (connectionString) {
  client = postgres(connectionString, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  // Create drizzle instance
  db = drizzle(client, { schema });
}

export { db };

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  if (!client) {
    return false;
  }

  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Close database connection
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.end();
  }
}
