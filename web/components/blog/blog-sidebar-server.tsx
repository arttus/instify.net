import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { BlogPostMeta } from '@/lib/blog';

interface BlogSidebarServerProps {
  recentPosts: BlogPostMeta[];
  categories: string[];
  tags: string[];
}

export function BlogSidebarServer({ recentPosts, categories, tags }: BlogSidebarServerProps) {
  const popularTags = tags.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest insights on AI automation for law firms delivered to your inbox.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
            />
            <Button className="w-full">Subscribe</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="font-medium text-sm group-hover:text-cyan transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
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
                className="flex items-center justify-between text-sm hover:text-cyan transition-colors"
              >
                <span>{category}</span>
                <ArrowRight className="h-3 w-3" />
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
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="secondary" className="hover:bg-cyan/10 hover:text-cyan transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="bg-gradient-to-br from-cyan/5 to-purple/5 border-cyan/20">
        <CardHeader>
          <CardTitle className="text-lg">Ready to Transform Your Practice?</CardTitle>
        </CardHeader>
        <CardContent>
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
    </div>
  );
}
