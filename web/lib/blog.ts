import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  content: string;
  featured?: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured?: boolean;
}

export function getAllPosts(): BlogPostMeta[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const readingTimeResult = readingTime(content);

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date || new Date().toISOString().split('T')[0], // Default to today if no date
        author: data.author || 'ODEUO Team',
        category: data.category,
        tags: data.tags || [],
        readingTime: readingTimeResult.text,
        featured: data.featured || false,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const readingTimeResult = readingTime(content);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date || new Date().toISOString().split('T')[0], // Default to today if no date
      author: data.author || 'ODEUO Team',
      category: data.category,
      tags: data.tags || [],
      readingTime: readingTimeResult.text,
      content,
      featured: data.featured || false,
    };
  } catch {
    return null;
  }
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

export function getFeaturedPosts(): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.featured);
}

export function getCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = allPosts.map((post) => post.category);
  return Array.from(new Set(categories));
}

export function getTags(): string[] {
  const allPosts = getAllPosts();
  const tags = allPosts.flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}
