
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Newspaper } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog-db';
import { BlogPostsTable } from './components/blog-posts-table';


export const dynamic = 'force-dynamic';

export default async function AdminBlogPostsPage() {
  // Fetch initial data on the server
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Newspaper className="mr-3 h-8 w-8 text-primary" />
          Manage Blog Posts
        </h1>
        <Button asChild>
          <Link href="/admin/blog/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>View, filter, sort, and manage all your blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
           {/* Pass the server-fetched data to the client component */}
           <BlogPostsTable initialPosts={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
