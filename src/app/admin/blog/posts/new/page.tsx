
"use client";

import { useFormStatus } from 'react-dom';
import { useEffect, useState, Suspense, useActionState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, XCircle, Newspaper, Image as ImageIcon, Tag, CalendarDays, ExternalLink, Activity, Wand2, Sparkles, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { addBlogPostAction, type BlogActionResult } from '@/app/admin/blog/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { generateBlogPostIdeas } from '@/ai/flows/blog-post-flow';
import type { BlogPostRequest, BlogPostResponse } from '@/ai/flows/blog-post-types';
import type { BlogPost } from '@/lib/blog-db';
import Image from 'next/image';


function AiAssistDialog({ onAccept }: { onAccept: (content: BlogPostResponse) => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<BlogPostResponse | null>(null);
  const { toast } = useToast();
  const quickPrompts = ["Top 5 UI Trends", "Why Branding Matters", "Choosing a Color Palette", "Design for Startups"];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt is empty", description: "Please enter a topic for the blog post.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateBlogPostIdeas({ topic: prompt });
      setGeneratedContent(result);
    } catch (error) {
      console.error(error);
      toast({ title: "AI Generation Failed", description: "Could not generate content. Please try again.", variant: "destructive" });
    }
    setIsGenerating(false);
  };
  
  const handleAccept = () => {
    if (generatedContent) {
      onAccept(generatedContent);
    }
  };


  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-3 h-6 w-6 text-primary"/> AI Blog Post Assistant</DialogTitle>
        <DialogDescription>Provide a topic and let AI draft a title and excerpt for your next blog post.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">Blog Post Topic</Label>
          <Input id="ai-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., The impact of color psychology in branding" />
          <div className="flex flex-wrap gap-2 pt-2">
            {quickPrompts.map(p => (
              <Button key={p} variant="outline" size="sm" onClick={() => setPrompt(p)}>{p}</Button>
            ))}
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
          {isGenerating ? 'Generating...' : 'Generate Ideas'}
        </Button>
        
        {generatedContent && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Suggested Content:</h3>
            <div className="space-y-1">
              <Label>Generated Title</Label>
              <p className="p-3 border rounded-md bg-muted text-sm">{generatedContent.title}</p>
            </div>
            <div className="space-y-1">
              <Label>Generated Excerpt/Summary</Label>
              <p className="p-3 border rounded-md bg-muted text-sm whitespace-pre-wrap">{generatedContent.excerpt}</p>
            </div>
          </div>
        )}
         <p className="text-xs text-muted-foreground flex items-center pt-2">
            <AlertCircle className="h-3 w-3 mr-1.5"/>Powered by AI — please review carefully before publishing.
        </p>
      </div>
       <DialogFooter className="sm:justify-between gap-2">
        <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>Regenerate</Button>
          <DialogClose asChild>
            <Button onClick={handleAccept} disabled={!generatedContent}>Accept & Insert</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}


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

const blogTemplates = [
  {
    name: 'Full Article Layout',
    description: 'A structured template for a complete blog post.',
    thumbnailUrl: 'https://placehold.co/150x100.png',
    thumbnailHint: 'blog layout article',
    content: `
<h2 class="font-headline text-2xl mt-6 mb-2">[Your Main Section Title]</h2>
<p>This is the opening paragraph for your first main section. Introduce the key ideas you'll be discussing here. Keep it engaging to draw the reader in.</p>
<p>You can add another paragraph here to elaborate on the topic before introducing a visual element.</p>

<div class="my-6">
  <img src="https://placehold.co/800x400.png" alt="Placeholder for your relevant image" class="rounded-lg shadow-md" data-ai-hint="placeholder relevant image">
  <p class="text-center text-sm text-muted-foreground mt-2"><em>Optional: A caption for your image.</em></p>
</div>

<h3 class="font-headline text-xl mt-4 mb-2">A. Sub-heading for a Key Point</h3>
<p>Discuss the first key point of your section here. Use clear, concise language. This is a great place to use bullet points to break up text:</p>
<ul class="list-disc list-inside space-y-1 my-4">
  <li>First important point or feature.</li>
  <li>Second important point or feature.</li>
  <li>Third important point, elaborating further.</li>
</ul>

<blockquote class="border-l-4 border-primary pl-4 italic my-6">
  "This is a great spot for a powerful quote, a key takeaway, or a customer testimonial that supports your point."
</blockquote>

<h3 class="font-headline text-xl mt-4 mb-2">B. Sub-heading for Another Key Point</h3>
<p>Introduce another aspect of your topic. Maybe this is a good place for a numbered list to show a process or steps:</p>
<ol class="list-decimal list-inside space-y-1 my-4">
  <li>The first step in the process.</li>
  <li>The second step, which builds on the first.</li>
  <li>The final step to achieve the result.</li>
</ol>

<h2 class="font-headline text-2xl mt-6 mb-2">Conclusion & Call to Action</h2>
<p>Summarize the main points of your article here. Reiterate the key message you want your reader to remember. End with a clear call to action.</p>
<p>For example, encourage them to check out a related service, contact you for more information, or leave a comment below.</p>
`
  },
  {
    name: 'How-To Guide',
    description: 'A step-by-step guide to help users achieve a goal.',
    thumbnailUrl: 'https://placehold.co/150x100.png',
    thumbnailHint: 'checklist tutorial',
    content: `<p>Start with a brief introduction about what this guide will help the user accomplish.</p>
<h3 class="font-headline text-xl mt-4 mb-2">Step 1: [Your First Step]</h3>
<p>Provide a detailed explanation of the first step. Use clear language and be concise.</p>
<p><em>Optional: Add an image or a screenshot here to illustrate the step.</em></p>
<h3 class="font-headline text-xl mt-4 mb-2">Step 2: [Your Second Step]</h3>
<p>Explain the second step in the process. Break down complex parts into smaller, manageable actions.</p>
<h3 class="font-headline text-xl mt-4 mb-2">Step 3: [Your Third Step]</h3>
<p>Continue with the subsequent steps required to complete the task.</p>
<h2 class="font-headline text-2xl mt-6 mb-2">Conclusion</h2>
<p>Summarize the process and reiterate the benefits or the final outcome. Encourage users to try it out.</p>`
  },
  {
    name: 'News Update',
    description: 'Announce a new feature, event, or company news.',
    thumbnailUrl: 'https://placehold.co/150x100.png',
    thumbnailHint: 'newspaper announcement',
    content: `<p>We're thrilled to announce an exciting new update for our community! [Briefly state the main news here].</p>
<h3 class="font-headline text-xl mt-4 mb-2">What's New?</h3>
<p>Provide more details about the update. What problem does it solve? How does it benefit the user? Be specific.</p>
<ul class="list-disc list-inside space-y-1 my-4">
  <li>Key benefit or feature 1.</li>
  <li>Key benefit or feature 2.</li>
  <li>Key benefit or feature 3.</li>
</ul>
<h3 class="font-headline text-xl mt-4 mb-2">What's Next?</h3>
<p>Briefly mention what this update means for the future or what users can look forward to next. Thank your community for their continued support.</p>`
  },
];


function AddNewBlogPostPageContent() {
  const [state, formAction] = useActionState(addBlogPostAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for form fields to be controlled
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<BlogPost['status']>('Draft');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('https://placehold.co/800x450.png');
  const [featuredImageHint, setFeaturedImageHint] = useState('blog post image');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);

  // Effect to handle duplication from query params
  useEffect(() => {
    const duplicateDataString = searchParams.get('duplicate');
    if (duplicateDataString) {
      try {
        const data = JSON.parse(duplicateDataString);
        setTitle(data.title || '');
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setCategory(data.category || '');
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setStatus(data.status || 'Draft');
        setFeaturedImageUrl(data.featuredImageUrl || 'https://placehold.co/800x450.png');
        setFeaturedImageHint(data.featuredImageHint || 'blog post image');
        setPublishDate(data.publishDateString || new Date().toISOString().split('T')[0]);
        setSlug(''); // Clear slug to force regeneration on save
        toast({
          title: "Post Duplicated",
          description: "Content from the original post has been copied. Please review and save.",
        });
      } catch (error) {
        console.error("Failed to parse duplicate data:", error);
        toast({
          title: "Error",
          description: "Could not load duplicated post data.",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, toast]);

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
  
  const handleAcceptAiContent = (aiContent: BlogPostResponse) => {
    setTitle(aiContent.title);
    setExcerpt(aiContent.excerpt);
    
    const newSlug = aiContent.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0,70);
    setSlug(newSlug);
  };

  const handleSelectTemplate = (templateContent: string) => {
    setContent(templateContent);
    // Note: The DialogClose with asChild on the button will close the dialog.
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="title">Post Title*</Label>
                   <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="secondary" size="sm"><Wand2 className="mr-1.5 h-4 w-4"/> AI Assist</Button>
                    </DialogTrigger>
                    <AiAssistDialog onAccept={handleAcceptAiContent} />
                  </Dialog>
                </div>
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
              <Textarea id="excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} required placeholder="A brief summary that appears in post listings." aria-describedby="excerpt-error"/>
              {state.errors?.excerpt && <p id="excerpt-error" className="text-sm text-destructive">{state.errors.excerpt}</p>}
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <Label htmlFor="content">Main Content (HTML or Markdown)*</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="secondary" size="sm"><BookOpen className="mr-1.5 h-4 w-4"/> Choose Template</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Select a Blog Post Template</DialogTitle>
                            <DialogDescription>
                                Start with a pre-defined structure to write your post faster.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {blogTemplates.map(template => (
                                <DialogClose key={template.name} asChild>
                                    <Card 
                                        className="hover:shadow-lg hover:border-primary cursor-pointer transition-all flex flex-col text-left"
                                        onClick={() => handleSelectTemplate(template.content)}
                                    >
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-video w-full">
                                                 <Image src={template.thumbnailUrl} alt={template.name} fill style={{objectFit: 'cover'}} className="rounded-t-lg" data-ai-hint={template.thumbnailHint} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 flex-grow">
                                            <p className="font-semibold text-sm">{template.name}</p>
                                            <p className="text-xs text-muted-foreground">{template.description}</p>
                                        </CardContent>
                                    </Card>
                                </DialogClose>
                            ))}
                        </div>
                    </DialogContent>
                  </Dialog>
              </div>
              <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} required placeholder="Write your blog post content here. You can use HTML tags for formatting." aria-describedby="content-error"/>
              {state.errors?.content && <p id="content-error" className="text-sm text-destructive">{state.errors.content}</p>}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="featuredImageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image URL*</Label>
                    <Input id="featuredImageUrl" name="featuredImageUrl" type="url" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} required placeholder="https://placehold.co/800x450.png" aria-describedby="imageUrl-error"/>
                    {state.errors?.featuredImageUrl && <p id="imageUrl-error" className="text-sm text-destructive">{state.errors.featuredImageUrl}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="featuredImageHint"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Featured Image AI Hint</Label>
                    <Input id="featuredImageHint" name="featuredImageHint" value={featuredImageHint} onChange={(e) => setFeaturedImageHint(e.target.value)} placeholder="e.g., abstract design background" aria-describedby="imageHint-error"/>
                    {state.errors?.featuredImageHint && <p id="imageHint-error" className="text-sm text-destructive">{state.errors.featuredImageHint}</p>}
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category</Label>
                    <Input id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Design Trends, Tutorials" aria-describedby="category-error"/>
                    {state.errors?.category && <p id="category-error" className="text-sm text-destructive">{state.errors.category}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tags"><ExternalLink className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Tags (comma-separated, max 5)</Label>
                    <Input id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., branding, ui, figma" aria-describedby="tags-error"/>
                    {state.errors?.tags && <p id="tags-error" className="text-sm text-destructive">{state.errors.tags}</p>}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="publishDate"><CalendarDays className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Publish Date (YYYY-MM-DD)</Label>
                    <Input id="publishDate" name="publishDate" type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} aria-describedby="publishDate-error"/>
                    <p className="text-xs text-muted-foreground">Past dates publish immediately. Future dates are scheduled.</p>
                    {state.errors?.publishDateString && <p id="publishDate-error" className="text-sm text-destructive">{state.errors.publishDateString}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status"><Activity className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Status*</Label>
                    <Select name="status" value={status} onValueChange={(v) => setStatus(v as BlogPost['status'])}>
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


export default function AdminAddNewBlogPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNewBlogPostPageContent />
    </Suspense>
  )
}
