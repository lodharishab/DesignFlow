
'use server';

import { revalidatePath } from 'next/cache';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/lib/portfolio-db';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';

const MOCK_DESIGNER_ID = "des001"; 
const MOCK_DESIGNER_SLUG = "alice-wonderland"; // Assuming this maps to des001 for consistency
const MOCK_DESIGNER_NAME = "Priya Sharma"; // Match designerData
const MOCK_DESIGNER_AVATAR = "https://placehold.co/150x150.png"; // Match designerData
const MOCK_DESIGNER_AVATAR_HINT = "indian woman designer smiling"; // Match designerData

export interface AddPortfolioResult {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof Omit<PortfolioItem, '_id'> | 'general' | 'tagsString' | 'galleryImageUrl1' | 'galleryImageUrl2' | 'galleryImageHint1' | 'galleryImageHint2' | 'coverImageFile' | 'galleryImageFile1' | 'galleryImageFile2', string>>;
  item?: PortfolioItem;
}

// This is a mock function for the prototype. In a real app, this would upload the file to cloud storage (e.g., Firebase Storage) and return the URL.
async function uploadFileAndGetURL(file: File): Promise<string> {
  console.log(`Simulating upload for ${file.name}...`);
  // In a real app, you would have logic like:
  // const storageRef = ref(storage, `portfolio-images/${Date.now()}-${file.name}`);
  // await uploadBytes(storageRef, file);
  // const downloadURL = await getDownloadURL(storageRef);
  // return downloadURL;
  return `https://placehold.co/600x450.png?text=${encodeURIComponent(file.name)}`;
}

export async function addPortfolioItemAction(prevState: any, formData: FormData): Promise<AddPortfolioResult> {
  const errors: AddPortfolioResult['errors'] = {};

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const projectDescription = formData.get('projectDescription') as string;
  
  const coverImageFile = formData.get('coverImageFile') as File;
  const coverImageHint = formData.get('coverImageHint') as string;
  
  const tagsString = formData.get('tags') as string;
  const clientName = formData.get('clientName') as string || undefined;
  const projectDate = formData.get('projectDate') as string || undefined;

  const galleryImageFile1 = formData.get('galleryImageFile1') as File;
  const galleryImageHint1 = formData.get('galleryImageHint1') as string;
  const galleryImageFile2 = formData.get('galleryImageFile2') as File;
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

  // Cover Image File validation
  if (!coverImageFile || coverImageFile.size === 0) {
    errors.coverImageFile = 'A cover image file is required.';
  }
  if (coverImageHint && coverImageHint.length > 50) errors.coverImageHint = 'Cover Image Hint cannot exceed 50 characters.';
  
  // Gallery Images Validation
  const galleryImages: PortfolioItem['galleryImages'] = [];

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Validation failed. Please check the fields.', errors };
  }

  try {
    const coverImageUrl = await uploadFileAndGetURL(coverImageFile);
    if (galleryImageFile1 && galleryImageFile1.size > 0) {
        const url = await uploadFileAndGetURL(galleryImageFile1);
        galleryImages.push({ url, hint: galleryImageHint1 || 'gallery image' });
    }
    if (galleryImageFile2 && galleryImageFile2.size > 0) {
        const url = await uploadFileAndGetURL(galleryImageFile2);
        galleryImages.push({ url, hint: galleryImageHint2 || 'gallery image' });
    }

    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    if (tags.length > 5) errors.tagsString = 'You can add a maximum of 5 tags.';
    if (tags.some(tag => tag.length > 25)) errors.tagsString = 'Each tag cannot exceed 25 characters.';
    if (clientName && clientName.length > 100) errors.clientName = 'Client Name cannot exceed 100 characters.';
    if (projectDate && !/^\d{4}-\d{2}$/.test(projectDate)) errors.projectDate = 'Project Date must be in YYYY-MM format.';

    if (Object.keys(errors).length > 0) {
      return { success: false, message: 'Validation failed after file processing.', errors };
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
    return { success: false, message: 'An unexpected error occurred during file upload simulation.', errors: {general: 'Server error.'} };
  }
}

export async function updatePortfolioItemAction(itemId: string, formData: FormData): Promise<AddPortfolioResult> {
  const errors: AddPortfolioResult['errors'] = {};

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const projectDescription = formData.get('projectDescription') as string;
  const coverImageHint = formData.get('coverImageHint') as string;
  const tagsString = formData.get('tags') as string;

  if (!title || title.length < 5) errors.title = 'Title must be at least 5 characters.';
  if (!category) errors.category = 'Category is required.';
  if (!projectDescription || projectDescription.length < 20) errors.projectDescription = 'Description must be at least 20 characters.';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Validation failed. Please check the fields.', errors };
  }

  try {
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

    const updatedItem = await updatePortfolioItem(itemId, MOCK_DESIGNER_ID, {
      title,
      category,
      categorySlug,
      projectDescription,
      coverImageHint: coverImageHint || title,
      tags,
    });

    if (updatedItem) {
      revalidatePath('/designer/portfolio');
      revalidatePath(`/portfolio/${itemId}`);
      revalidatePath('/portfolio');
      return { success: true, message: 'Portfolio item updated successfully!', item: updatedItem };
    } else {
      return { success: false, message: 'Failed to update portfolio item.', errors: { general: 'Database error or item not found.' } };
    }
  } catch (error) {
    console.error("Error in updatePortfolioItemAction:", error);
    return { success: false, message: 'An unexpected error occurred.', errors: { general: 'Server error.' } };
  }
}

export async function deletePortfolioItemAction(itemId: string): Promise<{ success: boolean; message: string }> {
  try {
    const deleted = await deletePortfolioItem(itemId, MOCK_DESIGNER_ID);
    if (deleted) {
      revalidatePath('/designer/portfolio');
      revalidatePath('/portfolio');
      return { success: true, message: 'Portfolio item deleted successfully.' };
    } else {
      return { success: false, message: 'Failed to delete portfolio item. It may not exist.' };
    }
  } catch (error) {
    console.error("Error in deletePortfolioItemAction:", error);
    return { success: false, message: 'An unexpected error occurred while deleting.' };
  }
}
