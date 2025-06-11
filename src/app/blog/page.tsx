
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog-db';
import { Newspaper } from 'lucide-react';

export const metadata = {
  title: 'DesignFlow Blog - Insights, Trends & Tips',
  description: 'Stay updated with the latest design trends, tips for clients and designers, and news from DesignFlow India.',
};

// This page will be server-rendered or statically generated
export default async function BlogListingPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <div className="text-center mb-12">
          <Newspaper className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">DesignFlow Blog</h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Insights, trends, and stories from the world of design, tailored for the Indian creative community.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground text-xl py-10">No blog posts published yet. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
