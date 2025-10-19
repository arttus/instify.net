import { Metadata } from 'next';
import { getAllPosts, getFeaturedPosts, getCategories, getTags, getPostsByCategory, getPostsByTag } from '@/lib/blog';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogSidebarServer } from '@/components/blog/blog-sidebar-server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { generateBlogIndexStructuredData } from '@/lib/structured-data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - ODEUO AI | Legal AI Insights & Best Practices',
  description: 'Expert insights on AI for law firms, legal practice automation, and maximizing client capture. Learn how to transform your practice with intelligent technology.',
  keywords: 'legal AI blog, law firm automation, AI receptionist insights, legal practice management, law firm technology',
  openGraph: {
    title: 'Blog - ODEUO AI | Legal AI Insights & Best Practices',
    description: 'Expert insights on AI for law firms, legal practice automation, and maximizing client capture.',
    type: 'website',
  },
};

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const tag = typeof params.tag === 'string' ? params.tag : undefined;

  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const categories = getCategories();
  const tags = getTags();

  // Filter posts based on URL parameters
  let filteredPosts = allPosts;
  let filterTitle = 'Latest Articles';

  if (category) {
    filteredPosts = getPostsByCategory(category);
    filterTitle = `${category} Articles`;
  } else if (tag) {
    filteredPosts = getPostsByTag(tag);
    filterTitle = `Posts tagged "${tag}"`;
  }

  const displayPosts = filteredPosts.slice(0, 6);
  const structuredData = generateBlogIndexStructuredData(allPosts);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-background via-cyan/5 to-purple/5 border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent leading-normal md:leading-normal">
              Legal AI Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert insights on AI for law firms, practice automation, and maximizing client capture. 
              Learn how forward-thinking firms are transforming their operations with intelligent technology.
            </p>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <BlogCard key={post.slug} post={post} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Browse by Category</h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog">
                    <Badge
                      variant={!category && !tag ? "default" : "outline"}
                      className="cursor-pointer hover:bg-cyan/10 hover:border-cyan transition-colors"
                    >
                      All Posts
                    </Badge>
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>
                      <Badge
                        variant={category === cat ? "default" : "outline"}
                        className="cursor-pointer hover:bg-cyan/10 hover:border-cyan transition-colors"
                      >
                        {cat}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Posts */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">{filterTitle}</h2>
                {(category || tag) && (
                  <Link href="/blog">
                    <Button variant="outline">Clear Filter</Button>
                  </Link>
                )}
                {!category && !tag && allPosts.length > 6 && (
                  <Button variant="outline">View All Posts</Button>
                )}
              </div>

              {displayPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {displayPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-semibold mb-4">
                    {category || tag ? 'No posts found' : 'Coming Soon'}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {category || tag
                      ? `No posts found for ${category ? `category "${category}"` : `tag "${tag}"`}. Try browsing other categories or check back later.`
                      : "We're preparing comprehensive insights on AI for law firms, practice automation, and client capture strategies. Check back soon for expert content that will help transform your legal practice."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {(category || tag) && (
                      <Link href="/blog">
                        <Button size="lg" variant="outline" className="border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all">
                          View All Posts
                        </Button>
                      </Link>
                    )}
                    <Button size="lg" className="gradient-cyan-purple hover:opacity-90 transition-opacity">
                      <a href="tel:8449634740">Call for Live Demo</a>
                    </Button>
                    <Button size="lg" variant="outline" className="border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all">
                      <a href="/contact">Schedule Consultation</a>
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebarServer recentPosts={allPosts.slice(0, 6)} categories={categories} tags={tags} />
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
}
