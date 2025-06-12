
'use server';

import { revalidatePath } from 'next/cache';
import { createPortfolioItem } from '@/lib/portfolio-db';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';

const MOCK_DESIGNER_ID = "des001"; 
const MOCK_DESIGNER_SLUG = "alice-wonderland"; // Assuming this maps to des001 for consistency
const MOCK_DESIGNER_NAME = "Priya Sharma"; // Match designerData
const MOCK_DESIGNER_AVATAR = "https://placehold.co/150x150.png"; // Match designerData
const MOCK_DESIGNER_AVATAR_HINT = "indian woman designer smiling"; // Match designerData

export interface AddPortfolioResult {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof Omit<PortfolioItem, '_id'> | 'general' | 'tagsString' | 'galleryImageUrl1' | 'galleryImageUrl2' | 'galleryImageHint1' | 'galleryImageHint2', string>>;
  item?: PortfolioItem;
}

function validateUrl(url: string): boolean {
  if (!url) return true; // Optional URLs are fine
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export async function addPortfolioItemAction(prevState: any, formData: FormData): Promise<AddPortfolioResult> {
  const errors: AddPortfolioResult['errors'] = {};

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const projectDescription = formData.get('projectDescription') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const coverImageHint = formData.get('coverImageHint') as string;
  const tagsString = formData.get('tags') as string;
  const clientName = formData.get('clientName') as string || undefined;
  const projectDate = formData.get('projectDate') as string || undefined; // YYYY-MM format

  const galleryImageUrl1 = formData.get('galleryImageUrl1') as string;
  const galleryImageHint1 = formData.get('galleryImageHint1') as string;
  const galleryImageUrl2 = formData.get('galleryImageUrl2') as string;
  const galleryImageHint2 = formData.get('galleryImageHint2') as string;

  // Title validation
  if (!title) errors.title = 'Project Title is required.';
  else if (title.length < 5) errors.title = 'Title must be at least 5 characters long.';
  else if (title.length > 100) errors.title = 'Title cannot exceed 100 characters.';

  // Category validation
  if (!category) errors.category = 'Category is required.';

  // Project Description validation
  if (!projectDescription) errors.projectDescription = 'Project Description is required.';
  else if (projectDescription.length < 20) errors.projectDescription = 'Description must be at least 20 characters long.';
  else if (projectDescription.length > 1000) errors.projectDescription = 'Description cannot exceed 1000 characters.';

  // Cover Image URL validation
  if (!coverImageUrl) errors.coverImageUrl = 'Cover Image URL is required.';
  else if (!validateUrl(coverImageUrl)) errors.coverImageUrl = 'Cover Image URL must be a valid URL.';
  if (coverImageHint && coverImageHint.length > 50) errors.coverImageHint = 'Cover Image Hint cannot exceed 50 characters.';
  
  // Gallery Images Validation
  const galleryImages: PortfolioItem['galleryImages'] = [];
  if (galleryImageUrl1) {
    if (!validateUrl(galleryImageUrl1)) errors.galleryImageUrl1 = 'Gallery Image 1 URL must be a valid URL.';
    else galleryImages.push({ url: galleryImageUrl1, hint: galleryImageHint1 || 'gallery image' });
    if (galleryImageHint1 && galleryImageHint1.length > 50) errors.galleryImageHint1 = 'Gallery Image 1 Hint cannot exceed 50 characters.';
  }
  if (galleryImageUrl2) {
    if (!validateUrl(galleryImageUrl2)) errors.galleryImageUrl2 = 'Gallery Image 2 URL must be a valid URL.';
    else galleryImages.push({ url: galleryImageUrl2, hint: galleryImageHint2 || 'gallery image' });
    if (galleryImageHint2 && galleryImageHint2.length > 50) errors.galleryImageHint2 = 'Gallery Image 2 Hint cannot exceed 50 characters.';
  }
  
  // Tags validation
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  if (tags.length > 5) errors.tagsString = 'You can add a maximum of 5 tags.';
  if (tags.some(tag => tag.length > 25)) errors.tagsString = 'Each tag cannot exceed 25 characters.';

  if (clientName && clientName.length > 100) errors.clientName = 'Client Name cannot exceed 100 characters.';
  if (projectDate && !/^\d{4}-\d{2}$/.test(projectDate)) errors.projectDate = 'Project Date must be in YYYY-MM format.';


  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Validation failed. Please check the fields.', errors };
  }
  
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const newItemData: Omit<PortfolioItem, '_id'> & { designerId: string } = {
    id: `${categorySlug}-${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0,20)}-${Date.now().toString().slice(-5)}`,
    designerId: MOCK_DESIGNER_ID,
    title,
    category,
    categorySlug,
    projectDescription,
    coverImageUrl,
    coverImageHint: coverImageHint || title,
    galleryImages,
    tags,
    clientName,
    projectDate,
    designer: {
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
      revalidatePath('/portfolio');
      revalidatePath(`/portfolio/${createdItem.id}`);
      return { success: true, message: 'Portfolio item added successfully!', item: createdItem };
    } else {
      return { success: false, message: 'Failed to create portfolio item in database.', errors: {general: 'Database error.'}};
    }
  } catch (error) {
    console.error("Error in addPortfolioItemAction:", error);
    return { success: false, message: 'An unexpected error occurred.', errors: {general: 'Server error.'} };
  }
}

export async function updatePortfolioItemAction(itemId: string, formData: FormData) {
  console.log("Update action called for", itemId, formData.get('title'));
  revalidatePath('/designer/portfolio');
  revalidatePath(`/portfolio/${itemId}`); 
  // Consider redirecting after successful update via useFormState
}

export async function deletePortfolioItemAction(itemId: string) {
  console.log("Delete action called for", itemId);
  revalidatePath('/designer/portfolio');
  revalidatePath('/portfolio');
}
