
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { getBlogPostBySlug, getAllBlogPosts, type BlogPost } from '@/lib/blog-db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarDays, UserCircle, Tag, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${post.title} | DesignFlow Blog`,
    description: post.excerpt,
    openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [
            {
                url: post.featuredImageUrl,
                width: 800,
                height: 450,
                alt: post.title,
            },
        ],
        type: 'article',
        publishedTime: post.publishDate.toISOString(),
        authors: [post.authorName],
        tags: [post.tags],
    },
  };
}

// Optional: Generate static paths for blog posts if using SSG
// export async function generateStaticParams() {
//   const posts = await getAllBlogPosts();
//   return posts.map((post) => ({
//     slug: post.id,
//   }));
// }

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-5 max-w-3xl">
          <article>
            <header className="mb-8">
              <Button variant="outline" size="sm" asChild className="mb-6">
                <Link href="/blog">
                  <ChevronLeft className="mr-1.5 h-4 w-4" /> Back to Blog
                </Link>
              </Button>
              {post.category && (
                 <Link href={`/blog?category=${post.categorySlug}`} className="inline-block">
                    <Badge variant="default" className="mb-2 text-sm">{post.category}</Badge>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-4 text-foreground">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-4">
                <div className="flex items-center">
                  {post.authorAvatarUrl ? (
                    <Image src={post.authorAvatarUrl} alt={post.authorName} width={28} height={28} className="rounded-full mr-2" data-ai-hint={post.authorAvatarHint || 'author avatar'} />
                  ) : (
                    <UserCircle className="h-6 w-6 mr-1.5" />
                  )}
                  <span>By {post.authorName}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  <time dateTime={post.publishDate.toISOString()}>
                    {format(post.publishDate, 'MMMM d, yyyy')}
                  </time>
                </div>
              </div>
            </header>

            {post.featuredImageUrl && (
              <div className="relative aspect-[16/9] w-full mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={post.featuredImageUrl}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  data-ai-hint={post.featuredImageHint}
                />
              </div>
            )}

            <div
              className="prose dark:prose-invert max-w-none text-foreground prose-headings:font-headline prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />

            {post.tags && post.tags.length > 0 && (
              <footer className="mt-10 pt-6 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">TAGS:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" className="capitalize">{tag}</Badge>
                    </Link>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
