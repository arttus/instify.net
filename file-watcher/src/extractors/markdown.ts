import fs from 'fs/promises';
import matter from 'gray-matter';
import logger from '../logger';
import { ExtractedContent } from '../types';

export async function extractMarkdown(filePath: string): Promise<ExtractedContent> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    logger.debug('Extracted markdown', { 
      file: filePath, 
      hasFrontmatter: Object.keys(data).length > 0,
      contentLength: content.length 
    });
    
    return {
      content: content.trim(),
      metadata: {
        title: data.title,
        category: data.category,
        tags: data.tags,
        content_type: data.content_type,
      },
    };
  } catch (error) {
    logger.error('Failed to extract markdown', { file: filePath, error });
    throw error;
  }
}

