/**
 * Logging Configuration
 * Migrated from Python structlog to Winston for Node.js
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { settings } from '@/config/settings.js';

// Create logs directory
const logDir = '/app/logs';
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Custom format for console output with colors
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.padEnd(7)}] ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// JSON format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the main logger
const logger = winston.createLogger({
  level: settings.agent_log_level.toLowerCase(),
  defaultMeta: { service: 'instify-agent' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),
    
    // File transport with rotation
    new DailyRotateFile({
      filename: path.join(logDir, 'agent-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '5d',
      format: fileFormat,
    }),
    
    // Error file transport
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m',
      maxFiles: '5d',
      format: fileFormat,
    }),
  ],
});

// Create specialized loggers for different components
export const createLogger = (component: string) => {
  return logger.child({ component });
};

// Specialized loggers
export const agentLogger = createLogger('agent');
export const conversationLogger = createLogger('conversation');
export const metricsLogger = createLogger('metrics');
export const healthLogger = createLogger('health');
export const errorLogger = createLogger('error');

// Utility functions for structured logging
export const logAgentMetrics = (metrics: Record<string, any>) => {
  metricsLogger.info('Agent metrics', { metrics });
};

export const logConversationEvent = (
  roomName: string, 
  eventType: string, 
  data: Record<string, any>
) => {
  conversationLogger.info(`Conversation event: ${eventType}`, {
    room_name: roomName,
    event_type: eventType,
    event_data: data,
  });
};

export const logErrorWithContext = (
  error: Error, 
  context: Record<string, any>
) => {
  errorLogger.error(`Error occurred: ${error.message}`, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    error_context: context,
  });
};

// Setup logging and log startup information
export const setupLogging = () => {
  agentLogger.info('🔧 Logging system initialized');
  agentLogger.info(`📊 Log level: ${settings.agent_log_level}`);
  agentLogger.info(`📁 Log directory: ${logDir}`);
  
  return logger;
};

export default logger;
