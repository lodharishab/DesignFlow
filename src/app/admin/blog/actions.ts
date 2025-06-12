
'use server';

import { revalidatePath } from 'next/cache';
import { createBlogPost, updateBlogPost, type BlogPost } from '@/lib/blog-db'; // Ensure path is correct

export interface BlogActionResult {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof Omit<BlogPost, '_id' | 'publishDate'> | 'publishDateString' | 'general', string>>;
  post?: BlogPost;
}

const MOCK_ADMIN_AUTHOR_NAME = "Admin Author";
const MOCK_ADMIN_AUTHOR_AVATAR_URL = "https://placehold.co/40x40.png";
const MOCK_ADMIN_AUTHOR_AVATAR_HINT = "admin avatar";

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .replace(/\s+/g, '-')    // Replace spaces with hyphens
    .replace(/-+/g, '-')     // Replace multiple hyphens with single hyphen
    .slice(0, 70);           // Truncate to 70 chars
}


export async function addBlogPostAction(prevState: any, formData: FormData): Promise<BlogActionResult> {
  const errors: BlogActionResult['errors'] = {};

  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const featuredImageUrl = formData.get('featuredImageUrl') as string;
  const featuredImageHint = formData.get('featuredImageHint') as string;
  const category = formData.get('category') as string || undefined;
  const tagsString = formData.get('tags') as string;
  const publishDateString = formData.get('publishDate') as string;

  // Title validation
  if (!title) errors.title = 'Title is required.';
  else if (title.length < 5) errors.title = 'Title must be at least 5 characters long.';
  else if (title.length > 100) errors.title = 'Title cannot exceed 100 characters.';

  // Slug validation (if provided)
  if (slug) {
    if (slug.length > 70) errors.slug = 'Custom slug cannot exceed 70 characters.';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.slug = 'Slug must be lowercase, alphanumeric, with hyphens.';
  } else if (title) {
    slug = generateSlug(title); // Auto-generate slug if not provided and title exists
  } else {
    errors.slug = 'Slug is required if title is empty (or auto-generate from title).';
  }

  // Excerpt validation
  if (!excerpt) errors.excerpt = 'Excerpt is required.';
  else if (excerpt.length < 10) errors.excerpt = 'Excerpt must be at least 10 characters long.';
  else if (excerpt.length > 300) errors.excerpt = 'Excerpt cannot exceed 300 characters.';

  // Content validation
  if (!content) errors.content = 'Main content is required.';
  else if (content.length < 50) errors.content = 'Main content must be at least 50 characters long.';

  // Featured Image URL validation
  if (!featuredImageUrl) errors.featuredImageUrl = 'Featured Image URL is required.';
  else if (!validateUrl(featuredImageUrl)) errors.featuredImageUrl = 'Featured Image URL must be a valid URL.';
  
  if (featuredImageHint && featuredImageHint.length > 50) errors.featuredImageHint = 'Featured Image Hint cannot exceed 50 characters.';
  if (category && category.length > 50) errors.category = 'Category name cannot exceed 50 characters.';

  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  if (tags.length > 5) errors.tags = 'You can add a maximum of 5 tags.';
  if (tags.some(tag => tag.length > 25)) errors.tags = 'Each tag cannot exceed 25 characters.';
  
  if (publishDateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDateString) || isNaN(new Date(publishDateString).getTime())) {
        errors.publishDateString = 'Publish date must be a valid date in YYYY-MM-DD format.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Validation failed. Please check the fields.', errors };
  }
  
  const categorySlug = category ? category.toLowerCase().replace(/\s+/g, '-') : undefined;

  const newPostData = {
    id: slug,
    title,
    excerpt,
    content,
    featuredImageUrl,
    featuredImageHint: featuredImageHint || title,
    authorName: MOCK_ADMIN_AUTHOR_NAME,
    authorAvatarUrl: MOCK_ADMIN_AUTHOR_AVATAR_URL,
    authorAvatarHint: MOCK_ADMIN_AUTHOR_AVATAR_HINT,
    category,
    categorySlug,
    tags,
    publishDateString: publishDateString || new Date().toISOString().split('T')[0],
  };

  try {
    const createdPost = await createBlogPost(newPostData);
    if (createdPost) {
      revalidatePath('/admin/blog/posts');
      revalidatePath('/blog');
      revalidatePath(`/blog/${createdPost.id}`);
      return { success: true, message: 'Blog post added successfully!', post: createdPost };
    } else {
      return { success: false, message: 'Failed to create blog post in database.', errors: { general: 'Database error.'} };
    }
  } catch (error) {
    console.error("Error in addBlogPostAction:", error);
    return { success: false, message: 'An unexpected error occurred.', errors: {general: 'Server error.'} };
  }
}

export async function updateBlogPostAction(postId: string, prevState: any, formData: FormData): Promise<BlogActionResult> {
  const errors: BlogActionResult['errors'] = {};

  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const featuredImageUrl = formData.get('featuredImageUrl') as string;
  const featuredImageHint = formData.get('featuredImageHint') as string;
  const category = formData.get('category') as string || undefined;
  const tagsString = formData.get('tags') as string;
  const publishDateString = formData.get('publishDate') as string;

  if (!title) errors.title = 'Title is required.';
  else if (title.length < 5) errors.title = 'Title must be at least 5 characters long.';
  else if (title.length > 100) errors.title = 'Title cannot exceed 100 characters.';

  if (!excerpt) errors.excerpt = 'Excerpt is required.';
  else if (excerpt.length < 10) errors.excerpt = 'Excerpt must be at least 10 characters long.';
  else if (excerpt.length > 300) errors.excerpt = 'Excerpt cannot exceed 300 characters.';

  if (!content) errors.content = 'Main content is required.';
  else if (content.length < 50) errors.content = 'Main content must be at least 50 characters long.';

  if (!featuredImageUrl) errors.featuredImageUrl = 'Featured Image URL is required.';
  else if (!validateUrl(featuredImageUrl)) errors.featuredImageUrl = 'Featured Image URL must be a valid URL.';

  if (featuredImageHint && featuredImageHint.length > 50) errors.featuredImageHint = 'Featured Image Hint cannot exceed 50 characters.';
  if (category && category.length > 50) errors.category = 'Category name cannot exceed 50 characters.';
  
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  if (tags.length > 5) errors.tags = 'You can add a maximum of 5 tags.';
  if (tags.some(tag => tag.length > 25)) errors.tags = 'Each tag cannot exceed 25 characters.';

  if (publishDateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDateString) || isNaN(new Date(publishDateString).getTime())) {
        errors.publishDateString = 'Publish date must be a valid date in YYYY-MM-DD format.';
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Validation failed. Please check the fields.', errors };
  }

  const categorySlug = category ? category.toLowerCase().replace(/\s+/g, '-') : undefined;

  const updatedPostData = {
    title,
    excerpt,
    content,
    featuredImageUrl,
    featuredImageHint: featuredImageHint || title,
    category,
    categorySlug,
    tags,
    publishDateString,
  };

  try {
    const updatedPost = await updateBlogPost(postId, updatedPostData);
    if (updatedPost) {
      revalidatePath('/admin/blog/posts');
      revalidatePath(`/admin/blog/posts/edit/${postId}`);
      revalidatePath('/blog');
      revalidatePath(`/blog/${postId}`);
      return { success: true, message: 'Blog post updated successfully!', post: updatedPost };
    } else {
      return { success: false, message: 'Failed to update blog post in database or post not found.', errors: { general: 'Database error or post not found.'} };
    }
  } catch (error) {
    console.error(`Error in updateBlogPostAction for post ${postId}:`, error);
    return { success: false, message: 'An unexpected error occurred while updating the post.', errors: { general: 'Server error.'} };
  }
}
