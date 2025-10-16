import axios, { AxiosError } from 'axios';
import path from 'path';
import logger from './logger';
import { FileMetadata, IngestionResult } from './types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/knowledge/file-watcher';
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY || '2000');
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '30000');

export class IngestionService {
  private webhookUrl: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(webhookUrl: string = N8N_WEBHOOK_URL) {
    this.webhookUrl = webhookUrl;
    this.maxRetries = MAX_RETRIES;
    this.retryDelay = RETRY_DELAY;
  }

  async ingest(metadata: FileMetadata, filePath: string): Promise<IngestionResult> {
    const startTime = Date.now();

    try {
      logger.info('Starting ingestion', {
        file: filePath,
        title: metadata.title,
        category: metadata.category
      });

      await this.sendToWebhook(metadata, filePath);

      const duration = Date.now() - startTime;

      logger.info('Ingestion successful', {
        file: filePath,
        duration,
        title: metadata.title
      });

      return {
        success: true,
        file: filePath,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Ingestion failed', {
        file: filePath,
        duration,
        error: errorMessage
      });

      return {
        success: false,
        file: filePath,
        duration,
        error: errorMessage,
      };
    }
  }

  private async sendToWebhook(metadata: FileMetadata, filePath: string, attempt: number = 1): Promise<void> {
    try {
      // Format the payload for the file-watcher webhook
      const payload = {
        filePath: filePath,
        fileName: path.basename(filePath)
      };

      const response = await axios.post(this.webhookUrl, payload, {
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      logger.debug('Webhook call successful', {
        status: response.status,
        data: response.data
      });
    } catch (error) {
      if (attempt < this.maxRetries) {
        logger.warn(`Webhook call failed, retrying (${attempt}/${this.maxRetries})`, {
          error: this.getErrorMessage(error)
        });

        await this.sleep(this.retryDelay * attempt);
        return this.sendToWebhook(metadata, filePath, attempt + 1);
      }

      throw new Error(`Webhook call failed after ${this.maxRetries} attempts: ${this.getErrorMessage(error)}`);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return `HTTP ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`;
      } else if (axiosError.request) {
        return 'No response received from webhook';
      }
    }
    return error instanceof Error ? error.message : 'Unknown error';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Try to reach the n8n service
      const healthUrl = this.webhookUrl.replace('/webhook/knowledge/ingest', '/healthz');
      const response = await axios.get(healthUrl, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      logger.warn('n8n health check failed', { error: this.getErrorMessage(error) });
      return false;
    }
  }
}

export function deriveMetadata(
  filePath: string, 
  extractedContent: { content: string; metadata?: any }
): FileMetadata {
  const filename = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).toLowerCase();
  
  // Parse filename for category (e.g., "legal_fees_billing" -> "legal_fees")
  const parts = filename.split('_');
  const derivedCategory = parts.length > 1 ? parts.slice(0, -1).join('_') : 'general';
  
  // Get metadata from extracted content or use defaults
  const title = extractedContent.metadata?.title || filename.replace(/_/g, ' ');
  const category = extractedContent.metadata?.category || derivedCategory;
  const content_type = extractedContent.metadata?.content_type || process.env.DEFAULT_CONTENT_TYPE || 'legal_knowledge';
  const tenant_id = process.env.DEFAULT_TENANT_ID || 'default-tenant';
  
  // Build tags
  const tags = [
    'auto-ingested',
    ext.replace('.', ''),
    ...(extractedContent.metadata?.tags || []),
  ];
  
  if (category !== 'general') {
    tags.push(category);
  }
  
  return {
    title,
    content: extractedContent.content,
    content_type,
    category,
    tenant_id,
    source: 'file-watcher',
    tags,
  };
}

export default IngestionService;

