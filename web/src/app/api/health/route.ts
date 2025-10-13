import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';
import { checkRedisHealth } from '@/lib/redis';

export async function GET() {
  try {
    // Basic health check
    const healthData: Record<string, unknown> = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'instify-web',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    };

    let allHealthy = true;

    // Check database connection if available
    if (process.env.DATABASE_URL) {
      try {
        const dbHealthy = await checkDatabaseHealth();
        healthData.database = dbHealthy ? 'connected' : 'disconnected';
        if (!dbHealthy) allHealthy = false;
      } catch (error) {
        healthData.database = 'error';
        healthData.databaseError = error instanceof Error ? error.message : 'Unknown error';
        allHealthy = false;
      }
    }

    // Check Redis connection if available
    if (process.env.REDIS_URL) {
      try {
        const redisHealthy = await checkRedisHealth();
        healthData.redis = redisHealthy ? 'connected' : 'disconnected';
        if (!redisHealthy) allHealthy = false;
      } catch (error) {
        healthData.redis = 'error';
        healthData.redisError = error instanceof Error ? error.message : 'Unknown error';
        allHealthy = false;
      }
    }

    // Update overall status
    if (!allHealthy) {
      healthData.status = 'degraded';
    }

    const statusCode = allHealthy ? 200 : 503;
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
