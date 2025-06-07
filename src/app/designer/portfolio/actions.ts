
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPortfolioItem } from '@/lib/portfolio-db';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card'; // Ensure this path is correct

// Hardcoded designerId for now, replace with actual auth logic
const MOCK_DESIGNER_ID = "des001"; 
const MOCK_DESIGNER_SLUG = "alice-wonderland";
const MOCK_DESIGNER_NAME = "Alice Wonderland";
const MOCK_DESIGNER_AVATAR = "https://placehold.co/40x40.png";
const MOCK_DESIGNER_AVATAR_HINT = "woman avatar";

export interface AddPortfolioResult {
  success: boolean;
  message?: string;
  item?: PortfolioItem;
}

export async function addPortfolioItemAction(prevState: any, formData: FormData): Promise<AddPortfolioResult> {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const projectDescription = formData.get('projectDescription') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const coverImageHint = formData.get('coverImageHint') as string;
  const tagsString = formData.get('tags') as string;
  const clientName = formData.get('clientName') as string || undefined;
  const projectDate = formData.get('projectDate') as string || undefined;

  // Simplified gallery images handling from form
  const galleryImages: PortfolioItem['galleryImages'] = [];
  const galleryImageUrl1 = formData.get('galleryImageUrl1') as string;
  const galleryImageHint1 = formData.get('galleryImageHint1') as string;
  if (galleryImageUrl1) {
    galleryImages.push({ url: galleryImageUrl1, hint: galleryImageHint1 || 'gallery image' });
  }
  const galleryImageUrl2 = formData.get('galleryImageUrl2') as string;
  const galleryImageHint2 = formData.get('galleryImageHint2') as string;
  if (galleryImageUrl2) {
    galleryImages.push({ url: galleryImageUrl2, hint: galleryImageHint2 || 'gallery image' });
  }

  if (!title || !category || !projectDescription || !coverImageUrl) {
    return { success: false, message: 'Missing required fields.' };
  }

  const newItemData: Omit<PortfolioItem, '_id'> & { designerId: string } = {
    id: `${categorySlug}-${title.toLowerCase().replace(/\s+/g, '-').slice(0,20)}-${Date.now().toString().slice(-5)}`, // auto-generate slug-like id
    designerId: MOCK_DESIGNER_ID,
    title,
    category,
    categorySlug,
    projectDescription,
    coverImageUrl,
    coverImageHint: coverImageHint || title, // Default hint
    galleryImages,
    tags: tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    clientName,
    projectDate,
    designer: { // Include designer info for consistency, though designerId is the key for DB
        id: MOCK_DESIGNER_ID,
        slug: MOCK_DESIGNER_SLUG,
        name: MOCK_DESIGNER_NAME,
        avatarUrl: MOCK_DESIGNER_AVATAR,
        imageHint: MOCK_DESIGNER_AVATAR_HINT
    }
  };

  try {
    const createdItem = await createPortfolioItem(newItemData);
    if (createdItem) {
      revalidatePath('/designer/portfolio');
      revalidatePath('/portfolio'); // Revalidate public portfolio page too
      // Redirect handled by form's useFormState if successful
      return { success: true, message: 'Portfolio item added successfully!', item: createdItem };
    } else {
      return { success: false, message: 'Failed to create portfolio item in database.' };
    }
  } catch (error) {
    console.error("Error in addPortfolioItemAction:", error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
  // This part for redirection is typically handled by the client after a success state
  // redirect('/designer/portfolio'); // For Server Actions v1, redirect is fine. For vNext, useFormState handles it.
}

// Placeholder for future actions
export async function updatePortfolioItemAction(itemId: string, formData: FormData) {
  // ... logic to update item ...
  console.log("Update action called for", itemId, formData.get('title'));
  revalidatePath('/designer/portfolio');
  revalidatePath(`/portfolio/${formData.get('id')}`); // if 'id' is the slug
  redirect('/designer/portfolio');
}

export async function deletePortfolioItemAction(itemId: string) {
  // ... logic to delete item, ensuring it belongs to the logged-in designer ...
  // const success = await deletePortfolioItem(itemId, MOCK_DESIGNER_ID);
  console.log("Delete action called for", itemId);
  revalidatePath('/designer/portfolio');
  revalidatePath('/portfolio'); // Revalidate public portfolio page too
  // No redirect needed if deleting from the list page with optimistic UI or full refresh
}
