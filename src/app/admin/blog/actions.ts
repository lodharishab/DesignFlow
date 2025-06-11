
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createBlogPost, updateBlogPost, type BlogPost } from '@/lib/blog-db'; // Ensure path is correct

export interface BlogActionResult {
  success: boolean;
  message?: string;
  post?: BlogPost;
}

// Hardcoded author details for now
const MOCK_ADMIN_AUTHOR_NAME = "Admin Author";
const MOCK_ADMIN_AUTHOR_AVATAR_URL = "https://placehold.co/40x40.png";
const MOCK_ADMIN_AUTHOR_AVATAR_HINT = "admin avatar";

export async function addBlogPostAction(prevState: any, formData: FormData): Promise<BlogActionResult> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string; // Custom slug
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const featuredImageUrl = formData.get('featuredImageUrl') as string;
  const featuredImageHint = formData.get('featuredImageHint') as string;
  const category = formData.get('category') as string || undefined;
  const categorySlug = category ? category.toLowerCase().replace(/\s+/g, '-') : undefined;
  const tagsString = formData.get('tags') as string;
  const publishDateString = formData.get('publishDate') as string;


  if (!title || !content || !excerpt || !featuredImageUrl) {
    return { success: false, message: 'Missing required fields: Title, Excerpt, Content, and Featured Image URL.' };
  }
  
  const newPostData = {
    id: slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0,70), // Auto-generate slug if not provided
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
    tags: tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    publishDateString: publishDateString || new Date().toISOString().split('T')[0], // Default to today if not provided
  };

  try {
    const createdPost = await createBlogPost(newPostData);
    if (createdPost) {
      revalidatePath('/admin/blog/posts');
      revalidatePath('/blog');
      revalidatePath(`/blog/${createdPost.id}`);
      // Redirect is handled by useFormState on client for success
      return { success: true, message: 'Blog post added successfully!', post: createdPost };
    } else {
      return { success: false, message: 'Failed to create blog post in database.' };
    }
  } catch (error) {
    console.error("Error in addBlogPostAction:", error);
    return { success: false, message: 'An unexpected error occurred while creating the post.' };
  }
}

export async function updateBlogPostAction(postId: string, prevState: any, formData: FormData): Promise<BlogActionResult> {
  const title = formData.get('title') as string;
  // Slug (id) should not be updatable for existing posts to maintain URL integrity
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const featuredImageUrl = formData.get('featuredImageUrl') as string;
  const featuredImageHint = formData.get('featuredImageHint') as string;
  const category = formData.get('category') as string || undefined;
  const categorySlug = category ? category.toLowerCase().replace(/\s+/g, '-') : undefined;
  const tagsString = formData.get('tags') as string;
  const publishDateString = formData.get('publishDate') as string;

  if (!title || !content || !excerpt || !featuredImageUrl) {
    return { success: false, message: 'Missing required fields: Title, Excerpt, Content, and Featured Image URL.' };
  }

  const updatedPostData = {
    title,
    excerpt,
    content,
    featuredImageUrl,
    featuredImageHint: featuredImageHint || title,
    category,
    categorySlug,
    tags: tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    publishDateString,
    // Author details are not updated here, assuming they remain constant or are managed elsewhere
  };

  try {
    const updatedPost = await updateBlogPost(postId, updatedPostData);
    if (updatedPost) {
      revalidatePath('/admin/blog/posts');
      revalidatePath(`/admin/blog/posts/edit/${postId}`);
      revalidatePath('/blog');
      revalidatePath(`/blog/${postId}`); // Use original postId (slug)
      return { success: true, message: 'Blog post updated successfully!', post: updatedPost };
    } else {
      return { success: false, message: 'Failed to update blog post in database or post not found.' };
    }
  } catch (error) {
    console.error(`Error in updateBlogPostAction for post ${postId}:`, error);
    return { success: false, message: 'An unexpected error occurred while updating the post.' };
  }
}

// Note: deleteBlogPostAction would be similar, calling deleteBlogPost from blog-db.ts
// and then revalidating paths. For brevity, it's omitted here but would follow the pattern.
