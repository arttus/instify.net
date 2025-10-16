import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import logger from '../logger';
import { ExtractedContent } from '../types';

export async function extractPdf(filePath: string): Promise<ExtractedContent> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Clean up extracted text
    const content = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    logger.debug('Extracted PDF', { 
      file: filePath, 
      pages: data.numpages,
      contentLength: content.length 
    });
    
    return {
      content,
      metadata: {
        title: data.info?.Title,
      },
    };
  } catch (error) {
    logger.error('Failed to extract PDF', { file: filePath, error });
    throw error;
  }
}

