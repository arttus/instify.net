import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
      featured ? 'border-cyan/30 bg-gradient-to-br from-background to-cyan/5' : ''
    }`}>
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-cyan/20 via-purple/20 to-pink/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-xs font-medium">Cover Image</p>
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          {post.featured && (
            <Badge className="bg-gradient-to-r from-cyan to-purple text-white text-xs">
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className={`group-hover:text-cyan transition-colors ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
