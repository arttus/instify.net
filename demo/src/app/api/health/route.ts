import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';
import { checkRedisHealth } from '@/lib/redis';

// Helper function to add timeout to promises
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export async function GET() {
  try {
    // Basic health check
    const healthData: Record<string, unknown> = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'odeuo-web',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    };

    let allHealthy = true;

    // Check database connection if available (with 5s timeout)
    if (process.env.DATABASE_URL) {
      try {
        const dbHealthy = await withTimeout(checkDatabaseHealth(), 5000);
        healthData.database = dbHealthy ? 'connected' : 'disconnected';
        if (!dbHealthy) allHealthy = false;
      } catch (error) {
        healthData.database = 'error';
        healthData.databaseError = error instanceof Error ? error.message : 'Unknown error';
        // Don't fail overall health for database issues in development
        if (process.env.NODE_ENV !== 'development') {
          allHealthy = false;
        }
      }
    }

    // Check Redis connection if available (with 3s timeout)
    if (process.env.REDIS_URL) {
      try {
        const redisHealthy = await withTimeout(checkRedisHealth(), 3000);
        healthData.redis = redisHealthy ? 'connected' : 'disconnected';
        if (!redisHealthy) allHealthy = false;
      } catch (error) {
        healthData.redis = 'error';
        healthData.redisError = error instanceof Error ? error.message : 'Unknown error';
        // Don't fail overall health for Redis issues in development
        if (process.env.NODE_ENV !== 'development') {
          allHealthy = false;
        }
      }
    }

    // Update overall status
    if (!allHealthy) {
      healthData.status = 'degraded';
    }

    // In development, always return 200 if the service is running
    const statusCode = process.env.NODE_ENV === 'development' ? 200 : (allHealthy ? 200 : 503);
    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
