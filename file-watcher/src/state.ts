import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import logger from './logger';
import { IngestionState, FileState } from './types';

const STATE_FILE = process.env.STATE_FILE || '/app/data/ingestion-state.json';

export class StateManager {
  private state: IngestionState = {};
  private stateFile: string;

  constructor(stateFile: string = STATE_FILE) {
    this.stateFile = stateFile;
  }

  async initialize(): Promise<void> {
    try {
      // Ensure data directory exists
      const dir = path.dirname(this.stateFile);
      await fs.mkdir(dir, { recursive: true });

      // Load existing state
      await this.load();
      logger.info('State manager initialized', { stateFile: this.stateFile, files: Object.keys(this.state).length });
    } catch (error) {
      logger.error('Failed to initialize state manager', { error });
      throw error;
    }
  }

  async load(): Promise<void> {
    try {
      const data = await fs.readFile(this.stateFile, 'utf-8');
      this.state = JSON.parse(data);
      logger.debug('State loaded', { files: Object.keys(this.state).length });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        logger.info('No existing state file, starting fresh');
        this.state = {};
      } else {
        logger.error('Failed to load state', { error });
        throw error;
      }
    }
  }

  async save(): Promise<void> {
    try {
      await fs.writeFile(this.stateFile, JSON.stringify(this.state, null, 2), 'utf-8');
      logger.debug('State saved', { files: Object.keys(this.state).length });
    } catch (error) {
      logger.error('Failed to save state', { error });
      throw error;
    }
  }

  async getFileHash(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath);
      return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
      logger.error('Failed to calculate file hash', { file: filePath, error });
      throw error;
    }
  }

  async hasChanged(filePath: string): Promise<boolean> {
    const currentHash = await this.getFileHash(filePath);
    const storedState = this.state[filePath];
    
    if (!storedState) {
      return true; // New file
    }
    
    return storedState.hash !== currentHash;
  }

  async updateFileState(filePath: string, status: 'success' | 'failed', error?: string): Promise<void> {
    const hash = await this.getFileHash(filePath);
    const stats = await fs.stat(filePath);
    
    const existingState = this.state[filePath];
    
    this.state[filePath] = {
      hash,
      lastIngested: Date.now(),
      status,
      attempts: status === 'failed' ? (existingState?.attempts || 0) + 1 : 0,
      lastError: error,
      size: stats.size,
    };
    
    await this.save();
  }

  getState(filePath: string): FileState | undefined {
    return this.state[filePath];
  }

  getAllStates(): IngestionState {
    return { ...this.state };
  }

  getMetrics() {
    const states = Object.values(this.state);
    const successful = states.filter(s => s.status === 'success');
    const failed = states.filter(s => s.status === 'failed');
    const pending = states.filter(s => s.status === 'pending');
    
    const processingTimes = successful.map(s => s.lastIngested);
    const avgTime = processingTimes.length > 0 
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
      : 0;
    
    const lastIngestion = Math.max(...processingTimes, 0);
    
    return {
      totalFiles: states.length,
      successfulIngestions: successful.length,
      failedIngestions: failed.length,
      pendingRetries: pending.length,
      lastIngestionTime: lastIngestion > 0 ? lastIngestion : null,
      averageProcessingTime: avgTime,
    };
  }

  async cleanup(existingFiles: Set<string>): Promise<void> {
    // Remove state entries for files that no longer exist
    const stateFiles = Object.keys(this.state);
    let removed = 0;
    
    for (const file of stateFiles) {
      if (!existingFiles.has(file)) {
        delete this.state[file];
        removed++;
      }
    }
    
    if (removed > 0) {
      await this.save();
      logger.info('Cleaned up state', { removedEntries: removed });
    }
  }
}

export default StateManager;

