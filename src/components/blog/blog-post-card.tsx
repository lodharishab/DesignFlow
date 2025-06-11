
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/blog-db';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden">
      <Link href={`/blog/${post.id}`} passHref legacyBehavior>
        <a className="block relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={post.featuredImageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </a>
      </Link>
      <CardHeader className="pb-3">
        {post.category && (
          <Link href={`/blog?category=${post.categorySlug}`} passHref legacyBehavior>
            <a className="inline-block mb-1">
              <Badge variant="secondary">{post.category}</Badge>
            </a>
          </Link>
        )}
        <CardTitle className="text-xl font-headline leading-tight group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-3 pb-4 border-t items-center">
        <div className="flex items-center mr-4">
          {post.authorAvatarUrl ? (
            <Image src={post.authorAvatarUrl} alt={post.authorName} width={24} height={24} className="rounded-full mr-2" data-ai-hint={post.authorAvatarHint || 'author avatar'}/>
          ) : (
            <UserCircle className="h-5 w-5 mr-1.5" />
          )}
          <span>{post.authorName}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          <time dateTime={post.publishDate.toISOString()}>
            {format(post.publishDate, 'MMM d, yyyy')}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}
