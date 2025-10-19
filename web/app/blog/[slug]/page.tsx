import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts, getCategories, getTags } from '@/lib/blog';
import { BlogLayout } from '@/components/blog/blog-layout';
import { generateBlogPostStructuredData } from '@/lib/structured-data';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - ODEUO AI',
    };
  }

  return {
    title: `${post.title} - ODEUO AI Blog`,
    description: post.description,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-4xl font-bold mb-6 text-foreground" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-3xl font-semibold mb-4 mt-8 text-foreground" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-2xl font-semibold mb-3 mt-6 text-foreground" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 text-foreground leading-relaxed" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="mb-4 ml-6 list-disc text-foreground" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="mb-4 ml-6 list-decimal text-foreground" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="mb-2 text-foreground" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-cyan pl-4 my-6 italic text-muted-foreground bg-cyan/5 py-2" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-cyan hover:text-cyan/80 underline transition-colors" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-foreground" {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic text-foreground" {...props} />,
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const structuredData = generateBlogPostStructuredData(post);

  // Get sidebar data
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 5);
  const categories = getCategories();
  const tags = getTags();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogLayout post={post} recentPosts={recentPosts} categories={categories} tags={tags}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </BlogLayout>
    </>
  );
}
