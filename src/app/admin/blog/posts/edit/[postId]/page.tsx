
"use client";

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useActionState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, XCircle, Newspaper, Image as ImageIcon, Tag, CalendarDays, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { updateBlogPostAction, type BlogActionResult } from '@/app/admin/blog/actions';
import { getBlogPostBySlug, type BlogPost } from '@/lib/blog-db';
import { format } from 'date-fns';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Save className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'Saving Changes...' : 'Save Changes'}
    </Button>
  );
}

const initialState: BlogActionResult = {
  success: false,
  message: '',
  errors: {},
};

export default function AdminEditBlogPostPage() {
  const params = useParams();
  const postId = params.postId as string; 
  
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateBlogPostActionWithId = updateBlogPostAction.bind(null, postId);
  const [state, formAction] = useActionState(updateBlogPostActionWithId, initialState);
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      if (postId) {
        setIsLoading(true);
        const post = await getBlogPostBySlug(postId);
        if (post) {
          setCurrentPost(post);
        } else {
          toast({ title: "Error", description: "Blog post not found.", variant: "destructive" });
          router.push('/admin/blog/posts');
        }
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [postId, router, toast]);

  useEffect(() => {
    if (state.message && !state.success && state.errors && Object.keys(state.errors).length > 0) {
      // Handled by per-field error display
    } else if (state.message) {
       toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
    if (state.success) {
      router.push('/admin/blog/posts');
    }
  }, [state, toast, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading post data...</p>
      </div>
    );
  }

  if (!currentPost) {
    return <p>Blog post not found. It may have been deleted.</p>;
  }
  
  const formattedPublishDate = currentPost.publishDate ? format(new Date(currentPost.publishDate), 'yyyy-MM-dd') : '';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Newspaper className="mr-3 h-8 w-8 text-primary" />
          Edit Blog Post
        </h1>
      </div>

      <form action={formAction}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Editing: {currentPost.title}</CardTitle>
            <CardDescription>Modify the details for this blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {state.errors?.general && <p className="text-sm text-destructive">{state.errors.general}</p>}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title*</Label>
                <Input id="title" name="title" defaultValue={currentPost.title} required aria-describedby="title-error"/>
                {state.errors?.title && <p id="title-error" className="text-sm text-destructive">{state.errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Post Slug (URL)</Label>
                <Input id="slug" name="slug" defaultValue={currentPost.id} disabled />
                 <p className="text-xs text-muted-foreground">URL: /blog/{currentPost.id} (Slug cannot be changed after creation)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt / Short Summary*</Label>
              <Textarea id="excerpt" name="excerpt" rows={3} defaultValue={currentPost.excerpt} required aria-describedby="excerpt-error"/>
              {state.errors?.excerpt && <p id="excerpt-error" className="text-sm text-destructive">{state.errors.excerpt}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Main Content (HTML or Markdown)*</Label>
              <Textarea id="content" name="content" rows={10} defaultValue={currentPost.content} required aria-describedby="content-error"/>
              {state.errors?.content && <p id="content-error" className="text-sm text-destructive">{state.errors.content}</p>}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="featuredImageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image URL*</Label>
                    <Input id="featuredImageUrl" name="featuredImageUrl" type="url" defaultValue={currentPost.featuredImageUrl} required aria-describedby="imageUrl-error"/>
                    {state.errors?.featuredImageUrl && <p id="imageUrl-error" className="text-sm text-destructive">{state.errors.featuredImageUrl}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="featuredImageHint"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image AI Hint</Label>
                    <Input id="featuredImageHint" name="featuredImageHint" defaultValue={currentPost.featuredImageHint} aria-describedby="imageHint-error"/>
                    {state.errors?.featuredImageHint && <p id="imageHint-error" className="text-sm text-destructive">{state.errors.featuredImageHint}</p>}
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category</Label>
                    <Input id="category" name="category" defaultValue={currentPost.category || ''} placeholder="e.g., Design Trends, Tutorials" aria-describedby="category-error"/>
                    {state.errors?.category && <p id="category-error" className="text-sm text-destructive">{state.errors.category}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tags"><ExternalLink className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Tags (comma-separated, max 5)</Label>
                    <Input id="tags" name="tags" defaultValue={currentPost.tags?.join(', ') || ''} placeholder="e.g., branding, ui, figma" aria-describedby="tags-error"/>
                    {state.errors?.tags && <p id="tags-error" className="text-sm text-destructive">{state.errors.tags}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="publishDate"><CalendarDays className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Publish Date (YYYY-MM-DD)</Label>
                <Input id="publishDate" name="publishDate" type="date" defaultValue={formattedPublishDate} aria-describedby="publishDate-error"/>
                 {state.errors?.publishDateString && <p id="publishDate-error" className="text-sm text-destructive">{state.errors.publishDateString}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button variant="outline" asChild type="button">
              <Link href="/admin/blog/posts">
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
