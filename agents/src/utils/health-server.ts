/**
 * Health Check Server
 * Migrated from Python FastAPI to Express.js
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import si from 'systeminformation';
import { healthLogger } from './logger.js';
import type { HealthStatus, SystemMetrics, AgentMetrics } from '@/types/agent.js';

// Global health status
let healthStatus: HealthStatus = {
  status: 'starting',
  start_time: new Date().toISOString(),
  last_check: null,
  checks: {},
};

// Agent metrics (to be updated by the main agent)
let agentMetrics: AgentMetrics = {
  active_sessions: 0,
  total_conversations: 0,
  average_session_duration: 0,
  last_activity: null,
};

export const updateAgentMetrics = (metrics: Partial<AgentMetrics>) => {
  agentMetrics = { ...agentMetrics, ...metrics };
};

const getSystemInfo = async (): Promise<Partial<SystemMetrics>> => {
  try {
    const [cpu, memory, disk, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
    ]);

    return {
      cpu_percent: Math.round(cpu.currentLoad),
      memory: {
        total: memory.total,
        available: memory.available,
        percent: Math.round((memory.used / memory.total) * 100),
        used: memory.used,
      },
      disk: disk[0] ? {
        total: disk[0].size,
        free: disk[0].available,
        used: disk[0].used,
        percent: Math.round(disk[0].use),
      } : {
        total: 0,
        free: 0,
        used: 0,
        percent: 0,
      },
      network: network[0] ? {
        bytes_sent: network[0].tx_bytes || 0,
        bytes_recv: network[0].rx_bytes || 0,
        packets_sent: network[0].tx_packets || 0,
        packets_recv: network[0].rx_packets || 0,
      } : {
        bytes_sent: 0,
        bytes_recv: 0,
        packets_sent: 0,
        packets_recv: 0,
      },
    };
  } catch (error) {
    healthLogger.error('Failed to get system info:', error);
    return {};
  }
};

const getNetworkStats = async () => {
  try {
    const networkStats = await si.networkStats();
    if (networkStats && networkStats.length > 0) {
      const stats = networkStats[0];
      return {
        bytes_sent: stats.tx_bytes || 0,
        bytes_recv: stats.rx_bytes || 0,
        packets_sent: stats.tx_packets || 0,
        packets_recv: stats.rx_packets || 0,
      };
    }
  } catch (error) {
    healthLogger.error('Failed to get network stats:', error);
  }
  return {
    bytes_sent: 0,
    bytes_recv: 0,
    packets_sent: 0,
    packets_recv: 0,
  };
};

const getUptimeSeconds = (): number => {
  const startTime = new Date(healthStatus.start_time);
  return Math.floor((Date.now() - startTime.getTime()) / 1000);
};

export const createHealthApp = (): express.Application => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Basic health check endpoint
  app.get('/health', async (req, res) => {
    try {
      // Update health status
      healthStatus.last_check = new Date().toISOString();
      healthStatus.status = 'healthy';

      // Perform basic system checks
      const systemInfo = await getSystemInfo();
      healthStatus.checks.system = systemInfo;

      res.status(200).json(healthStatus);
    } catch (error) {
      healthLogger.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        last_check: new Date().toISOString(),
      });
    }
  });

  // Detailed health check with system metrics
  app.get('/health/detailed', async (req, res) => {
    try {
      const detailedStatus = { ...healthStatus };

      // Add detailed system metrics
      const [cpu, memory, disk, processes] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.processes(),
      ]);

      detailedStatus.system_metrics = {
        cpu_percent: Math.round(cpu.currentLoad),
        memory: {
          total: memory.total,
          available: memory.available,
          percent: Math.round((memory.used / memory.total) * 100),
          used: memory.used,
        },
        disk: disk[0] ? {
          total: disk[0].size,
          free: disk[0].available,
          used: disk[0].used,
          percent: Math.round(disk[0].use),
        } : {
          total: 0,
          free: 0,
          used: 0,
          percent: 0,
        },
        network: await getNetworkStats(),
        processes: processes.all || 0,
      };

      // Add agent-specific metrics
      detailedStatus.agent_metrics = agentMetrics;

      res.status(200).json(detailedStatus);
    } catch (error) {
      healthLogger.error('Detailed health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        last_check: new Date().toISOString(),
      });
    }
  });

  // Prometheus metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      const metrics: string[] = [];

      // System metrics
      const [cpu, memory] = await Promise.all([
        si.currentLoad(),
        si.mem(),
      ]);

      metrics.push(
        '# HELP agent_cpu_percent CPU usage percentage',
        '# TYPE agent_cpu_percent gauge',
        `agent_cpu_percent ${Math.round(cpu.currentLoad)}`,
        '',
        '# HELP agent_memory_percent Memory usage percentage',
        '# TYPE agent_memory_percent gauge',
        `agent_memory_percent ${Math.round((memory.used / memory.total) * 100)}`,
        '',
        '# HELP agent_memory_used_bytes Memory used in bytes',
        '# TYPE agent_memory_used_bytes gauge',
        `agent_memory_used_bytes ${memory.used}`,
        '',
      );

      // Agent uptime
      const uptimeSeconds = getUptimeSeconds();
      metrics.push(
        '# HELP agent_uptime_seconds Agent uptime in seconds',
        '# TYPE agent_uptime_seconds counter',
        `agent_uptime_seconds ${uptimeSeconds}`,
        '',
      );

      // Agent-specific metrics
      metrics.push(
        '# HELP agent_active_sessions Number of active sessions',
        '# TYPE agent_active_sessions gauge',
        `agent_active_sessions ${agentMetrics.active_sessions}`,
        '',
        '# HELP agent_total_conversations Total number of conversations',
        '# TYPE agent_total_conversations counter',
        `agent_total_conversations ${agentMetrics.total_conversations}`,
        '',
      );

      res.set('Content-Type', 'text/plain');
      res.send(metrics.join('\n'));
    } catch (error) {
      healthLogger.error('Metrics endpoint failed:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Status endpoint
  app.get('/status', (req, res) => {
    res.json({
      status: healthStatus.status,
      uptime: getUptimeSeconds(),
      last_check: healthStatus.last_check,
    });
  });

  return app;
};

export const startHealthServer = async (
  host: string = '0.0.0.0',
  port: number = 8001
): Promise<void> => {
  const app = createHealthApp();

  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => {
      healthLogger.info(`🏥 Health server started on ${host}:${port}`);
      resolve();
    });

    server.on('error', (error) => {
      healthLogger.error('Health server error:', error);
      reject(error);
    });
  });
};
