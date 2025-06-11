
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save, XCircle, Newspaper, Image as ImageIcon, Tag, CalendarDays, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { addBlogPostAction, type BlogActionResult } from '@/app/admin/blog/actions'; // Ensure path is correct

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Save className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'Publishing Post...' : 'Publish Post'}
    </Button>
  );
}

const initialState: BlogActionResult = {
  success: false,
  message: '',
};

export default function AdminAddNewBlogPostPage() {
  const [state, formAction] = useFormState(addBlogPostAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success && state.post) {
        router.push('/admin/blog/posts'); 
      }
    }
  }, [state, toast, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug from title if slug field is empty
    if (!slug || slug === title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, -1)) {
        setSlug(newTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0,70));
    }
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.toLowerCase().replace(/[^\w-]/g, '').replace(/\s+/g, '-').slice(0,70));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <PlusCircle className="mr-3 h-8 w-8 text-primary" />
          Add New Blog Post
        </h1>
      </div>

      <form action={formAction}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>New Post Details</CardTitle>
            <CardDescription>Fill in the information for your new blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title*</Label>
                <Input id="title" name="title" value={title} onChange={handleTitleChange} required placeholder="Enter a catchy title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Post Slug (URL)*</Label>
                <Input id="slug" name="slug" value={slug} onChange={handleSlugChange} required placeholder="e.g., my-awesome-post" />
                <p className="text-xs text-muted-foreground">URL: /blog/{slug || 'your-post-slug'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt / Short Summary*</Label>
              <Textarea id="excerpt" name="excerpt" rows={3} required placeholder="A brief summary that appears in post listings." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Main Content (HTML or Markdown)*</Label>
              <Textarea id="content" name="content" rows={10} required placeholder="Write your blog post content here. You can use HTML tags for formatting." />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="featuredImageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image URL*</Label>
                    <Input id="featuredImageUrl" name="featuredImageUrl" type="url" required placeholder="https://placehold.co/800x450.png" defaultValue="https://placehold.co/800x450.png"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="featuredImageHint"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image AI Hint</Label>
                    <Input id="featuredImageHint" name="featuredImageHint" placeholder="e.g., abstract design background" defaultValue="blog post image"/>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category</Label>
                    <Input id="category" name="category" placeholder="e.g., Design Trends, Tutorials" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tags"><ExternalLink className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="e.g., branding, ui, figma" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="publishDate"><CalendarDays className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Publish Date (YYYY-MM-DD)</Label>
                <Input id="publishDate" name="publishDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <p className="text-xs text-muted-foreground">Defaults to today if left blank. Past dates publish immediately.</p>
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
