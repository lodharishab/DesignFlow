
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Newspaper, PackageSearch } from 'lucide-react';
import { getAllBlogPosts, type BlogPost, deleteBlogPost } from '@/lib/blog-db'; // Ensure this path is correct
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { revalidatePath } from 'next/cache';

// Server Action for deletion (can be in actions.ts too)
async function handleDeletePost(postId: string) {
  "use server";
  const success = await deleteBlogPost(postId);
  if (success) {
    revalidatePath('/admin/blog/posts');
    revalidatePath('/blog'); // Revalidate public blog listing
    // Revalidating individual post pages is harder without knowing all slugs, 
    // but good enough for now for the admin list and main blog page.
  }
  // Toast messages should be handled on the client-side if needed after action.
  return success;
}


export default async function AdminBlogPostsPage() {
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
          <CardDescription>View, add, edit, or remove blog posts. Deletions are simulated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                    No blog posts found. Start by creating one!
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium hover:text-primary">
                        <Link href={`/blog/${post.id}`} target="_blank" title={`View "${post.title}" on site`}>
                         {post.title}
                        </Link>
                    </TableCell>
                    <TableCell>
                      {post.category ? <Badge variant="outline">{post.category}</Badge> : <span className="text-muted-foreground italic">N/A</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{post.authorName}</TableCell>
                    <TableCell className="text-muted-foreground">{format(post.publishDate, 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" asChild className="hover:text-primary">
                        <Link href={`/admin/blog/posts/edit/${post.id}`} aria-label={`Edit ${post.title}`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                       <form action={async () => { await handleDeletePost(post.id); }} className="inline-block">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="hover:text-destructive" aria-label={`Delete ${post.title}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the blog post
                                "{post.title}". (This is a simulation).
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction type="submit">
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
