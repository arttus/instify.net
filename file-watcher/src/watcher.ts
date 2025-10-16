import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs/promises';
import logger from './logger';
import StateManager from './state';
import IngestionService, { deriveMetadata } from './ingestion';
import { extractContent, isSupportedFile } from './extractors';

const WATCH_PATH = process.env.WATCH_PATH || '/data/RAG-data';
const SCAN_ON_STARTUP = process.env.SCAN_ON_STARTUP !== 'false';
const DEBOUNCE_DELAY = parseInt(process.env.DEBOUNCE_DELAY || '2000');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
const MIN_CONTENT_LENGTH = parseInt(process.env.MIN_CONTENT_LENGTH || '50');

export class FileWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private stateManager: StateManager;
  private ingestionService: IngestionService;
  private watchPath: string;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private processing: Set<string> = new Set();

  constructor(
    watchPath: string = WATCH_PATH,
    stateManager: StateManager,
    ingestionService: IngestionService
  ) {
    this.watchPath = watchPath;
    this.stateManager = stateManager;
    this.ingestionService = ingestionService;
  }

  async start(): Promise<void> {
    logger.info('Starting file watcher', { 
      watchPath: this.watchPath,
      scanOnStartup: SCAN_ON_STARTUP 
    });

    // Verify watch path exists
    try {
      await fs.access(this.watchPath);
    } catch (error) {
      throw new Error(`Watch path does not exist: ${this.watchPath}`);
    }

    // Scan existing files on startup
    if (SCAN_ON_STARTUP) {
      await this.scanExistingFiles();
    }

    // Start watching for changes
    this.watcher = chokidar.watch(this.watchPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true, // We already scanned
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100,
      },
    });

    this.watcher
      .on('add', (filePath) => this.handleFileEvent('add', filePath))
      .on('change', (filePath) => this.handleFileEvent('change', filePath))
      .on('unlink', (filePath) => this.handleFileDelete(filePath))
      .on('error', (error) => logger.error('Watcher error', { error }));

    logger.info('File watcher started successfully');
  }

  async stop(): Promise<void> {
    logger.info('Stopping file watcher');
    
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
    
    // Clear any pending debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    
    logger.info('File watcher stopped');
  }

  private async scanExistingFiles(): Promise<void> {
    logger.info('Scanning existing files', { path: this.watchPath });
    
    try {
      const files = await this.getAllFiles(this.watchPath);
      const supportedFiles = files.filter(isSupportedFile);
      
      logger.info('Found files to process', { 
        total: files.length,
        supported: supportedFiles.length 
      });

      // Clean up state for deleted files
      await this.stateManager.cleanup(new Set(supportedFiles));

      // Process each file
      for (const file of supportedFiles) {
        try {
          const hasChanged = await this.stateManager.hasChanged(file);
          
          if (hasChanged) {
            logger.info('Processing existing file', { file });
            await this.processFile(file);
          } else {
            logger.debug('Skipping unchanged file', { file });
          }
        } catch (error) {
          logger.error('Failed to process existing file', { file, error });
        }
      }
      
      logger.info('Existing files scan completed');
    } catch (error) {
      logger.error('Failed to scan existing files', { error });
    }
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.getAllFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      logger.error('Failed to read directory', { dir, error });
    }
    
    return files;
  }

  private handleFileEvent(event: 'add' | 'change', filePath: string): void {
    if (!isSupportedFile(filePath)) {
      logger.debug('Ignoring unsupported file', { file: filePath });
      return;
    }

    logger.debug('File event detected', { event, file: filePath });

    // Clear existing debounce timer
    const existingTimer = this.debounceTimers.get(filePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounce timer
    const timer = setTimeout(() => {
      this.debounceTimers.delete(filePath);
      this.processFile(filePath).catch((error) => {
        logger.error('Failed to process file', { file: filePath, error });
      });
    }, DEBOUNCE_DELAY);

    this.debounceTimers.set(filePath, timer);
  }

  private handleFileDelete(filePath: string): void {
    logger.info('File deleted', { file: filePath });
    // Could implement marking as inactive in knowledge base here
  }

  private async processFile(filePath: string): Promise<void> {
    // Prevent concurrent processing of the same file
    if (this.processing.has(filePath)) {
      logger.debug('File already being processed', { file: filePath });
      return;
    }

    this.processing.add(filePath);

    try {
      // Check file size
      const stats = await fs.stat(filePath);
      if (stats.size > MAX_FILE_SIZE) {
        logger.warn('File exceeds maximum size, skipping', { 
          file: filePath, 
          size: stats.size,
          maxSize: MAX_FILE_SIZE 
        });
        return;
      }

      // Check if file has changed
      const hasChanged = await this.stateManager.hasChanged(filePath);
      if (!hasChanged) {
        logger.debug('File unchanged, skipping', { file: filePath });
        return;
      }

      // Extract content
      logger.info('Extracting content', { file: filePath });
      const extracted = await extractContent(filePath);

      // Validate content
      if (extracted.content.length < MIN_CONTENT_LENGTH) {
        logger.warn('Content too short, skipping', { 
          file: filePath, 
          length: extracted.content.length,
          minLength: MIN_CONTENT_LENGTH 
        });
        return;
      }

      // Derive metadata
      const metadata = deriveMetadata(filePath, extracted);

      // Ingest to n8n
      const result = await this.ingestionService.ingest(metadata, filePath);

      // Update state
      if (result.success) {
        await this.stateManager.updateFileState(filePath, 'success');
      } else {
        await this.stateManager.updateFileState(filePath, 'failed', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('File processing failed', { file: filePath, error: errorMessage });
      await this.stateManager.updateFileState(filePath, 'failed', errorMessage);
    } finally {
      this.processing.delete(filePath);
    }
  }

  getMetrics() {
    return {
      ...this.stateManager.getMetrics(),
      currentlyProcessing: this.processing.size,
      pendingDebounce: this.debounceTimers.size,
    };
  }
}

export default FileWatcher;

