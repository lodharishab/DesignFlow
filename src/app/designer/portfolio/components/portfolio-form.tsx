
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addPortfolioItemAction, updatePortfolioItemAction, type AddPortfolioResult } from '@/app/designer/portfolio/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { PortfolioItem } from '@/lib/portfolio-db';

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

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending
        ? (isEditMode ? 'Saving Changes...' : 'Adding Project...')
        : (isEditMode ? 'Save Changes' : 'Add Portfolio Project')}
    </Button>
  );
}

const initialState: AddPortfolioResult = {
  success: false,
  message: '',
  errors: {},
};

interface PortfolioFormProps {
  existingItem?: PortfolioItem;
}

export function PortfolioForm({ existingItem }: PortfolioFormProps = {}) {
  const isEditMode = !!existingItem;

  const boundUpdateAction = isEditMode
    ? async (prevState: AddPortfolioResult, formData: FormData) => {
        return updatePortfolioItemAction(existingItem!.id, formData);
      }
    : addPortfolioItemAction;

  const [state, formAction] = useActionState(boundUpdateAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

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
      router.push('/designer/portfolio');
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-6">
      {state.errors?.general && <p className="text-sm text-destructive">{state.errors.general}</p>}
      <div>
        <Label htmlFor="title">Project Title*</Label>
        <Input id="title" name="title" required placeholder="e.g., Modern E-commerce Platform UI" defaultValue={existingItem?.title || ''} aria-describedby="title-error"/>
        {state.errors?.title && <p id="title-error" className="text-sm text-destructive">{state.errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category*</Label>
        <Select name="category" required defaultValue={existingItem?.category || undefined}>
          <SelectTrigger id="category" aria-describedby="category-error">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map(cat => (
              <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.category && <p id="category-error" className="text-sm text-destructive">{state.errors.category}</p>}
      </div>

      <div>
        <Label htmlFor="projectDescription">Project Description*</Label>
        <Textarea id="projectDescription" name="projectDescription" rows={5} required placeholder="Describe the project, your role, and the outcome..." defaultValue={existingItem?.projectDescription || ''} aria-describedby="desc-error"/>
        {state.errors?.projectDescription && <p id="desc-error" className="text-sm text-destructive">{state.errors.projectDescription}</p>}
      </div>
      
      <div>
        <Label htmlFor="clientName">Client Name (Optional)</Label>
        <Input id="clientName" name="clientName" placeholder="e.g., Acme Corp" defaultValue={existingItem?.clientName || ''} aria-describedby="clientName-error"/>
        {state.errors?.clientName && <p id="clientName-error" className="text-sm text-destructive">{state.errors.clientName}</p>}
      </div>

      <div>
        <Label htmlFor="projectDate">Project Completion Date (Optional - YYYY-MM)</Label>
        <Input id="projectDate" name="projectDate" type="month" placeholder="e.g., 2024-06" defaultValue={existingItem?.projectDate || ''} aria-describedby="projectDate-error"/>
        {state.errors?.projectDate && <p id="projectDate-error" className="text-sm text-destructive">{state.errors.projectDate}</p>}
      </div>

      {!isEditMode && (
        <>
          <div>
            <Label htmlFor="coverImageFile">Cover Image File*</Label>
            <Input id="coverImageFile" name="coverImageFile" type="file" required accept=".png, .jpg, .jpeg, .pdf" aria-describedby="coverFile-error"/>
            {state.errors?.coverImageFile && <p id="coverFile-error" className="text-sm text-destructive">{state.errors.coverImageFile}</p>}
          </div>
        </>
      )}
      <div>
        <Label htmlFor="coverImageHint">Cover Image AI Hint</Label>
        <Input id="coverImageHint" name="coverImageHint" placeholder="e.g., modern website homepage" defaultValue={existingItem?.coverImageHint || ''} aria-describedby="coverHint-error"/>
        {state.errors?.coverImageHint && <p id="coverHint-error" className="text-sm text-destructive">{state.errors.coverImageHint}</p>}
      </div>

      {!isEditMode && (
        <div className="space-y-2 border p-4 rounded-md bg-secondary/30">
          <h3 className="text-sm font-medium">Gallery Images (Optional - Max 2 for now)</h3>
          <div>
              <Label htmlFor="galleryImageFile1">Gallery Image 1 File</Label>
              <Input id="galleryImageFile1" name="galleryImageFile1" type="file" accept=".png, .jpg, .jpeg, .pdf" aria-describedby="galleryFile1-error"/>
              {state.errors?.galleryImageFile1 && <p id="galleryFile1-error" className="text-sm text-destructive">{state.errors.galleryImageFile1}</p>}
              <Label htmlFor="galleryImageHint1" className="text-xs mt-1">Hint for Image 1</Label>
              <Input id="galleryImageHint1" name="galleryImageHint1" placeholder="e.g., dashboard analytics view" className="mt-1" aria-describedby="galleryHint1-error"/>
              {state.errors?.galleryImageHint1 && <p id="galleryHint1-error" className="text-sm text-destructive">{state.errors.galleryImageHint1}</p>}
          </div>
          <div className="mt-2">
              <Label htmlFor="galleryImageFile2">Gallery Image 2 File</Label>
              <Input id="galleryImageFile2" name="galleryImageFile2" type="file" accept=".png, .jpg, .jpeg, .pdf" aria-describedby="galleryFile2-error"/>
              {state.errors?.galleryImageFile2 && <p id="galleryFile2-error" className="text-sm text-destructive">{state.errors.galleryImageFile2}</p>}
              <Label htmlFor="galleryImageHint2" className="text-xs mt-1">Hint for Image 2</Label>
              <Input id="galleryImageHint2" name="galleryImageHint2" placeholder="e.g., product listing page" className="mt-1" aria-describedby="galleryHint2-error"/>
              {state.errors?.galleryImageHint2 && <p id="galleryHint2-error" className="text-sm text-destructive">{state.errors.galleryImageHint2}</p>}
          </div>
          <p className="text-xs text-muted-foreground">To add more gallery images, edit the project after creation (feature coming soon).</p>
        </div>
      )}

      <div>
        <Label htmlFor="tags">Tags (comma-separated, max 5)</Label>
        <Input id="tags" name="tags" placeholder="e.g., ui design, figma, branding, e-commerce" defaultValue={existingItem?.tags?.join(', ') || ''} aria-describedby="tags-error"/>
        {state.errors?.tagsString && <p id="tags-error" className="text-sm text-destructive">{state.errors.tagsString}</p>}
      </div>

      <SubmitButton isEditMode={isEditMode} />
      
    </form>
  );
}
