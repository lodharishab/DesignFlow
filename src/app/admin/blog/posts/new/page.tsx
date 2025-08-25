
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, XCircle, Newspaper, Image as ImageIcon, Tag, CalendarDays, ExternalLink, Activity } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { addBlogPostAction, type BlogActionResult } from '@/app/admin/blog/actions';
import type { BlogPost } from '@/lib/blog-db';

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
  errors: {},
};

export default function AdminAddNewBlogPostPage() {
  const [state, formAction] = useFormState(addBlogPostAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');

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
    if (state.success && state.post) {
      router.push('/admin/blog/posts'); 
    }
  }, [state, toast, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug from title if slug field is empty or was auto-generated from previous title
    const currentGeneratedSlug = newTitle.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0,70);
    const previousGeneratedSlug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0,70);
    
    if (!slug || slug === previousGeneratedSlug) {
        setSlug(currentGeneratedSlug);
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
            {state.errors?.general && <p className="text-sm text-destructive">{state.errors.general}</p>}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title*</Label>
                <Input id="title" name="title" value={title} onChange={handleTitleChange} required placeholder="Enter a catchy title" aria-describedby="title-error"/>
                {state.errors?.title && <p id="title-error" className="text-sm text-destructive">{state.errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Post Slug (URL - leave blank to auto-generate)</Label>
                <Input id="slug" name="slug" value={slug} onChange={handleSlugChange} placeholder="e.g., my-awesome-post" aria-describedby="slug-error"/>
                <p className="text-xs text-muted-foreground">URL: /blog/{slug || 'your-post-slug'}</p>
                {state.errors?.slug && <p id="slug-error" className="text-sm text-destructive">{state.errors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt / Short Summary*</Label>
              <Textarea id="excerpt" name="excerpt" rows={3} required placeholder="A brief summary that appears in post listings." aria-describedby="excerpt-error"/>
              {state.errors?.excerpt && <p id="excerpt-error" className="text-sm text-destructive">{state.errors.excerpt}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Main Content (HTML or Markdown)*</Label>
              <Textarea id="content" name="content" rows={10} required placeholder="Write your blog post content here. You can use HTML tags for formatting." aria-describedby="content-error"/>
              {state.errors?.content && <p id="content-error" className="text-sm text-destructive">{state.errors.content}</p>}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="featuredImageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image URL*</Label>
                    <Input id="featuredImageUrl" name="featuredImageUrl" type="url" required placeholder="https://placehold.co/800x450.png" defaultValue="https://placehold.co/800x450.png" aria-describedby="imageUrl-error"/>
                    {state.errors?.featuredImageUrl && <p id="imageUrl-error" className="text-sm text-destructive">{state.errors.featuredImageUrl}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="featuredImageHint"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image AI Hint</Label>
                    <Input id="featuredImageHint" name="featuredImageHint" placeholder="e.g., abstract design background" defaultValue="blog post image" aria-describedby="imageHint-error"/>
                    {state.errors?.featuredImageHint && <p id="imageHint-error" className="text-sm text-destructive">{state.errors.featuredImageHint}</p>}
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category</Label>
                    <Input id="category" name="category" placeholder="e.g., Design Trends, Tutorials" aria-describedby="category-error"/>
                    {state.errors?.category && <p id="category-error" className="text-sm text-destructive">{state.errors.category}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tags"><ExternalLink className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Tags (comma-separated, max 5)</Label>
                    <Input id="tags" name="tags" placeholder="e.g., branding, ui, figma" aria-describedby="tags-error"/>
                    {state.errors?.tags && <p id="tags-error" className="text-sm text-destructive">{state.errors.tags}</p>}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="publishDate"><CalendarDays className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Publish Date (YYYY-MM-DD)</Label>
                    <Input id="publishDate" name="publishDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} aria-describedby="publishDate-error"/>
                    <p className="text-xs text-muted-foreground">Past dates publish immediately. Future dates are scheduled.</p>
                    {state.errors?.publishDateString && <p id="publishDate-error" className="text-sm text-destructive">{state.errors.publishDateString}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status"><Activity className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Status*</Label>
                    <Select name="status" defaultValue="Draft">
                        <SelectTrigger id="status" aria-describedby="status-error">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>
                     {state.errors?.status && <p id="status-error" className="text-sm text-destructive">{state.errors.status}</p>}
                </div>
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
