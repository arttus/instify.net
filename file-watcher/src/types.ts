export interface FileMetadata {
  title: string;
  content: string;
  content_type: string;
  category: string;
  tenant_id: string;
  source: string;
  tags: string[];
}

export interface FileState {
  hash: string;
  lastIngested: number;
  status: 'success' | 'failed' | 'pending';
  attempts: number;
  lastError?: string;
  size: number;
}

export interface IngestionState {
  [filepath: string]: FileState;
}

export interface ExtractedContent {
  content: string;
  metadata?: {
    title?: string;
    category?: string;
    tags?: string[];
    content_type?: string;
  };
}

export interface IngestionResult {
  success: boolean;
  file: string;
  duration: number;
  error?: string;
}

export interface ServiceMetrics {
  totalFiles: number;
  successfulIngestions: number;
  failedIngestions: number;
  pendingRetries: number;
  lastIngestionTime: number | null;
  averageProcessingTime: number;
}

