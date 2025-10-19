'use client';

import { ReactNode, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { BlogPost, BlogPostMeta } from '@/lib/blog';
import { BlogSidebarServer } from '@/components/blog/blog-sidebar-server';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { trackBlogView, trackBlogShare, trackBlogReadingProgress } from '@/components/analytics';

interface BlogLayoutProps {
  post: BlogPost;
  children: ReactNode;
  recentPosts: BlogPostMeta[];
  categories: string[];
  tags: string[];
}

export function BlogLayout({ post, children, recentPosts, categories, tags }: BlogLayoutProps) {
  useEffect(() => {
    // Track blog view
    const readingTime = parseInt(post.readingTime?.replace(' min read', '') || '5');
    trackBlogView(post.title, post.category, readingTime);

    // Set up reading progress tracking
    let lastProgress = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.round((scrollTop / docHeight) * 100);

      if (progress > lastProgress && (progress === 25 || progress === 50 || progress === 75 || progress === 100)) {
        trackBlogReadingProgress(post.title, progress);
        lastProgress = progress;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.title, post.category, post.readingTime]);

  const handleShare = (platform: string) => {
    trackBlogShare(post.title, platform);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <div className="border-b bg-gradient-to-r from-background to-cyan/5 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-cyan to-purple text-white">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-normal md:leading-normal">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl">
              {post.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime}</span>
              </div>
            </div>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-r from-cyan/20 via-purple/20 to-pink/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/80">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-sm font-medium">Cover Image Placeholder</p>
            <p className="text-xs opacity-75">AI-Powered Legal Technology</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-cyan hover:prose-a:text-cyan/80 prose-blockquote:border-cyan prose-blockquote:text-muted-foreground">
              {children}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Share this article</h3>
                  <p className="text-muted-foreground">Help other law firms discover this content</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => handleShare('generic')}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-cyan/10 to-purple/10 rounded-lg border border-cyan/20">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Ready to Transform Your Practice?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See how ODEUO AI can help you capture every call and never miss another opportunity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gradient-cyan-purple hover:opacity-90 transition-opacity">
                    <Link href="tel:8449634740">Call for Live Demo</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all">
                    <Link href="/contact">Schedule Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebarServer recentPosts={recentPosts} categories={categories} tags={tags} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
