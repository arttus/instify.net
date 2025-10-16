import path from 'path';
import { extractMarkdown } from './markdown';
import { extractPdf } from './pdf';
import { extractWord } from './word';
import { ExtractedContent } from '../types';

export async function extractContent(filePath: string): Promise<ExtractedContent> {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.md':
    case '.markdown':
      return extractMarkdown(filePath);
    
    case '.pdf':
      return extractPdf(filePath);
    
    case '.docx':
      return extractWord(filePath);
    
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

export function isSupportedFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ['.md', '.markdown', '.pdf', '.docx'].includes(ext);
}

