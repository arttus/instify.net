import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { BlogPostMeta } from '@/lib/blog';

interface BlogSidebarProps {
  recentPosts: BlogPostMeta[];
  categories: string[];
  tags: string[];
}

export function BlogSidebar({ recentPosts, categories, tags }: BlogSidebarProps) {
  const popularTags = tags.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get the latest insights on AI automation for law firms delivered to your inbox.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan/20"
            />
            <Button className="w-full bg-gradient-to-r from-cyan to-purple hover:from-cyan/90 hover:to-purple/90">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-cyan transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <span className="text-sm group-hover:text-cyan transition-colors">
                  {category}
                </span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
              >
                <Badge 
                  variant="secondary" 
                  className="hover:bg-cyan/10 hover:text-cyan hover:border-cyan/20 transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-br from-cyan/5 to-purple/5 border-cyan/20">
        <CardHeader>
          <CardTitle className="text-lg">Ready to Get Started?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            See how ODEUO AI can transform your law practice with intelligent automation.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full bg-gradient-to-r from-cyan to-purple hover:from-cyan/90 hover:to-purple/90">
              <Link href="tel:8449634740">
                <Phone className="h-4 w-4 mr-2" />
                Call for Demo
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics/Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">By the Numbers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan">24/7</div>
              <div className="text-xs text-muted-foreground">Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple">95%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink">3x</div>
              <div className="text-xs text-muted-foreground">More Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan">$0</div>
              <div className="text-xs text-muted-foreground">Setup Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
