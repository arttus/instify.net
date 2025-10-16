import express from 'express';
import dotenv from 'dotenv';
import logger from './logger';
import StateManager from './state';
import IngestionService from './ingestion';
import FileWatcher from './watcher';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '8080');
const HEALTH_CHECK_INTERVAL = parseInt(process.env.HEALTH_CHECK_INTERVAL || '60000');

class FileWatcherService {
  private app: express.Application;
  private stateManager: StateManager;
  private ingestionService: IngestionService;
  private fileWatcher: FileWatcher;
  private server: any;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.app = express();
    this.stateManager = new StateManager();
    this.ingestionService = new IngestionService();
    this.fileWatcher = new FileWatcher(
      process.env.WATCH_PATH,
      this.stateManager,
      this.ingestionService
    );

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.use(express.json());

    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const n8nHealthy = await this.ingestionService.healthCheck();
        const metrics = this.fileWatcher.getMetrics();
        
        const healthy = n8nHealthy || metrics.successfulIngestions > 0;
        
        res.status(healthy ? 200 : 503).json({
          status: healthy ? 'healthy' : 'unhealthy',
          service: 'file-watcher',
          timestamp: new Date().toISOString(),
          n8n: n8nHealthy ? 'connected' : 'disconnected',
          metrics: {
            totalFiles: metrics.totalFiles,
            successfulIngestions: metrics.successfulIngestions,
            failedIngestions: metrics.failedIngestions,
          },
        });
      } catch (error) {
        logger.error('Health check failed', { error });
        res.status(503).json({
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Detailed status endpoint
    this.app.get('/status', (req, res) => {
      try {
        const metrics = this.fileWatcher.getMetrics();
        const allStates = this.stateManager.getAllStates();
        
        res.json({
          service: 'file-watcher',
          timestamp: new Date().toISOString(),
          watchPath: process.env.WATCH_PATH,
          metrics,
          files: Object.entries(allStates).map(([file, state]) => ({
            file,
            status: state.status,
            lastIngested: new Date(state.lastIngested).toISOString(),
            size: state.size,
            attempts: state.attempts,
            lastError: state.lastError,
          })),
        });
      } catch (error) {
        logger.error('Status check failed', { error });
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Metrics endpoint (Prometheus-compatible)
    this.app.get('/metrics', (req, res) => {
      try {
        const metrics = this.fileWatcher.getMetrics();
        
        const prometheusMetrics = `
# HELP file_watcher_files_total Total number of files tracked
# TYPE file_watcher_files_total gauge
file_watcher_files_total ${metrics.totalFiles}

# HELP file_watcher_ingestions_total Total number of ingestions by status
# TYPE file_watcher_ingestions_total counter
file_watcher_ingestions_total{status="success"} ${metrics.successfulIngestions}
file_watcher_ingestions_total{status="failed"} ${metrics.failedIngestions}

# HELP file_watcher_pending_retries Number of files pending retry
# TYPE file_watcher_pending_retries gauge
file_watcher_pending_retries ${metrics.pendingRetries}

# HELP file_watcher_last_ingestion_timestamp Timestamp of last successful ingestion
# TYPE file_watcher_last_ingestion_timestamp gauge
file_watcher_last_ingestion_timestamp ${metrics.lastIngestionTime || 0}

# HELP file_watcher_processing_duration_seconds Average processing duration
# TYPE file_watcher_processing_duration_seconds gauge
file_watcher_processing_duration_seconds ${metrics.averageProcessingTime / 1000}
        `.trim();
        
        res.set('Content-Type', 'text/plain');
        res.send(prometheusMetrics);
      } catch (error) {
        logger.error('Metrics endpoint failed', { error });
        res.status(500).send('Error generating metrics');
      }
    });

    // Force re-scan endpoint
    this.app.post('/rescan', async (req, res) => {
      try {
        logger.info('Manual rescan triggered');
        // Stop and restart watcher to trigger rescan
        await this.fileWatcher.stop();
        await this.fileWatcher.start();
        res.json({ message: 'Rescan initiated' });
      } catch (error) {
        logger.error('Rescan failed', { error });
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting File Watcher Service', {
        watchPath: process.env.WATCH_PATH,
        n8nWebhook: process.env.N8N_WEBHOOK_URL,
        port: PORT,
      });

      // Initialize state manager
      await this.stateManager.initialize();

      // Start file watcher
      await this.fileWatcher.start();

      // Start HTTP server
      this.server = this.app.listen(PORT, () => {
        logger.info(`HTTP server listening on port ${PORT}`);
      });

      // Start periodic health checks
      this.startHealthChecks();

      logger.info('File Watcher Service started successfully');
    } catch (error) {
      logger.error('Failed to start service', { error });
      throw error;
    }
  }

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const healthy = await this.ingestionService.healthCheck();
        if (!healthy) {
          logger.warn('n8n health check failed');
        }
      } catch (error) {
        logger.error('Health check error', { error });
      }
    }, HEALTH_CHECK_INTERVAL);
  }

  async stop(): Promise<void> {
    logger.info('Stopping File Watcher Service');

    // Stop health checks
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    // Stop file watcher
    await this.fileWatcher.stop();

    // Stop HTTP server
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server.close(() => resolve());
      });
    }

    logger.info('File Watcher Service stopped');
  }
}

// Main execution
const service = new FileWatcherService();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await service.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await service.stop();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  process.exit(1);
});

// Start the service
service.start().catch((error) => {
  logger.error('Failed to start service', { error });
  process.exit(1);
});

