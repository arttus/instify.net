import fs from 'fs/promises';
import mammoth from 'mammoth';
import logger from '../logger';
import { ExtractedContent } from '../types';

export async function extractWord(filePath: string): Promise<ExtractedContent> {
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    // Clean up extracted text
    const content = result.value
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    logger.debug('Extracted Word document', { 
      file: filePath, 
      contentLength: content.length,
      messages: result.messages.length 
    });
    
    if (result.messages.length > 0) {
      logger.warn('Word extraction warnings', { 
        file: filePath, 
        messages: result.messages 
      });
    }
    
    return {
      content,
      metadata: {},
    };
  } catch (error) {
    logger.error('Failed to extract Word document', { file: filePath, error });
    throw error;
  }
}

