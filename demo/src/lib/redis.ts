import { createClient } from 'redis';

// Redis connection
const redisUrl = process.env.REDIS_URL;

// Create Redis client only if URL is available
let redis: ReturnType<typeof createClient> | null = null;
let isConnected = false;

if (redisUrl) {
  redis = createClient({
    url: redisUrl,
    socket: {
      connectTimeout: 3000,  // 3 second connection timeout
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          return new Error('Redis connection failed after 3 retries');
        }
        return Math.min(retries * 50, 500);
      },
    },
  });

  // Connect to Redis
  redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });
}

export { redis };

export async function connectRedis(): Promise<void> {
  if (!redis || isConnected) {
    return;
  }

  await redis.connect();
  isConnected = true;
}

// Health check function
export async function checkRedisHealth(): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    if (!isConnected) {
      await connectRedis();
    }
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

// Cache utilities
export async function setCache(key: string, value: string, ttl?: number): Promise<void> {
  if (!redis) {
    throw new Error('Redis client not available');
  }

  if (!isConnected) {
    await connectRedis();
  }

  if (ttl) {
    await redis.setEx(key, ttl, value);
  } else {
    await redis.set(key, value);
  }
}

export async function getCache(key: string): Promise<string | null> {
  if (!redis) {
    return null;
  }

  if (!isConnected) {
    await connectRedis();
  }

  return await redis.get(key);
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) {
    return;
  }

  if (!isConnected) {
    await connectRedis();
  }

  await redis.del(key);
}

// Close Redis connection
export async function closeRedisConnection(): Promise<void> {
  if (redis && isConnected) {
    await redis.quit();
    isConnected = false;
  }
}
