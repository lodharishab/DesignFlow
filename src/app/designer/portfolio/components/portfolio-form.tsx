
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addPortfolioItemAction, type AddPortfolioResult } from '@/app/designer/portfolio/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const serviceCategories = [
  { name: 'Logo Design', slug: 'logo-design' },
  { name: 'Web UI/UX', slug: 'web-ui-ux' },
  { name: 'App Design', slug: 'app-design' },
  { name: 'Print Design', slug: 'print-design' },
  { name: 'Illustration', slug: 'illustration' },
  { name: 'Packaging Design', slug: 'packaging-design' },
  { name: 'Animation & Motion', slug: 'animation-motion' },
  { name: 'Presentation Design', slug: 'presentation-design' },
  { name: 'Social Media Graphics', slug: 'social-media-graphics' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Adding Project...' : 'Add Portfolio Project'}
    </Button>
  );
}

const initialState: AddPortfolioResult = {
  success: false,
  message: '',
};

export function PortfolioForm() {
  const [state, formAction] = useFormState(addPortfolioItemAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        // Optionally reset form or redirect
        // For redirection, it's better to do it after revalidation is complete
        // Consider using router.push if formAction returns a redirect instruction or success flag
        router.push('/designer/portfolio');
      }
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="title">Project Title*</Label>
        <Input id="title" name="title" required placeholder="e.g., Modern E-commerce Platform UI" />
      </div>

      <div>
        <Label htmlFor="category">Category*</Label>
        <Select name="category" required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map(cat => (
              <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="projectDescription">Project Description*</Label>
        <Textarea id="projectDescription" name="projectDescription" rows={5} required placeholder="Describe the project, your role, and the outcome..." />
      </div>
      
      <div>
        <Label htmlFor="clientName">Client Name (Optional)</Label>
        <Input id="clientName" name="clientName" placeholder="e.g., Acme Corp" />
      </div>

      <div>
        <Label htmlFor="projectDate">Project Completion Date (Optional)</Label>
        <Input id="projectDate" name="projectDate" type="month" placeholder="e.g., June 2024" />
      </div>

      <div>
        <Label htmlFor="coverImageUrl">Cover Image URL*</Label>
        <Input id="coverImageUrl" name="coverImageUrl" type="url" required placeholder="https://example.com/your-cover-image.png" />
      </div>
      <div>
        <Label htmlFor="coverImageHint">Cover Image AI Hint</Label>
        <Input id="coverImageHint" name="coverImageHint" placeholder="e.g., modern website homepage" />
      </div>

      <div className="space-y-2 border p-4 rounded-md bg-secondary/30">
        <h3 className="text-sm font-medium">Gallery Images (Optional - Max 2 for now)</h3>
        <div>
            <Label htmlFor="galleryImageUrl1">Gallery Image 1 URL</Label>
            <Input id="galleryImageUrl1" name="galleryImageUrl1" type="url" placeholder="https://example.com/gallery-image1.png" />
            <Label htmlFor="galleryImageHint1" className="text-xs mt-1">Hint for Image 1</Label>
            <Input id="galleryImageHint1" name="galleryImageHint1" placeholder="e.g., dashboard analytics view" className="mt-1" />
        </div>
         <div className="mt-2">
            <Label htmlFor="galleryImageUrl2">Gallery Image 2 URL</Label>
            <Input id="galleryImageUrl2" name="galleryImageUrl2" type="url" placeholder="https://example.com/gallery-image2.png" />
             <Label htmlFor="galleryImageHint2" className="text-xs mt-1">Hint for Image 2</Label>
            <Input id="galleryImageHint2" name="galleryImageHint2" placeholder="e.g., product listing page" className="mt-1" />
        </div>
        <p className="text-xs text-muted-foreground">To add more gallery images, edit the project after creation (feature coming soon).</p>
      </div>


      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" placeholder="e.g., ui design, figma, branding, e-commerce" />
      </div>

      <SubmitButton />
      
    </form>
  );
}
