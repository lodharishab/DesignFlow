'use server';
import { db, isDbEnabled } from './db';
import { blogPosts } from './schema';
import { eq, desc } from 'drizzle-orm';
import type { BlogPost } from './types';
export type { BlogPost };

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    _id: 'mock_id_1',
    id: 'first-post-welcome-to-designflow',
    title: 'Welcome to DesignFlow: Your Creative Hub in India!',
    excerpt: 'Discover how DesignFlow is revolutionizing the way clients and designers collaborate in India. Learn about our mission and vision.',
    content: `<p>Welcome to the official DesignFlow blog!</p>`,
    authorName: 'The DesignFlow Team',
    authorAvatarUrl: 'https://placehold.co/40x40.png',
    authorAvatarHint: 'team logo',
    publishDate: new Date('2024-07-20T10:00:00Z'),
    status: 'Published',
    featuredImageUrl: 'https://placehold.co/800x450.png',
    featuredImageHint: 'creative design abstract',
    category: 'Announcements',
    categorySlug: 'announcements',
    tags: ['welcome', 'designflow', 'indian design'],
    views: 1250,
    likes: 150,
    comments: 22,
  },
];

function rowToPost(row: typeof blogPosts.$inferSelect): BlogPost {
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    authorName: row.authorName || '',
    authorId: row.authorId || undefined,
    authorAvatarUrl: row.authorAvatarUrl || undefined,
    authorAvatarHint: row.authorAvatarHint || undefined,
    publishDate: row.publishDate ? new Date(row.publishDate) : new Date(),
    status: (row.status as BlogPost['status']) || 'Draft',
    featuredImageUrl: row.featuredImageUrl || '',
    featuredImageHint: row.featuredImageHint || '',
    category: row.category || undefined,
    categorySlug: row.categorySlug || undefined,
    tags: row.tags || [],
    views: row.views || 0,
    likes: row.likes || 0,
    comments: row.comments || 0,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!isDbEnabled()) {
    return MOCK_BLOG_POSTS.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  try {
    const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate));
    return rows.map(rowToPost);
  } catch (e) {
    console.error("Error fetching blog posts from DB, returning mock data:", e);
    return MOCK_BLOG_POSTS.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isDbEnabled()) {
    return MOCK_BLOG_POSTS.find(p => p.id === slug) || null;
  }

  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, slug));
    return rows[0] ? rowToPost(rows[0]) : null;
  } catch (e) {
    console.error(`Error fetching post ${slug} from DB:`, e);
    return MOCK_BLOG_POSTS.find(p => p.id === slug) || null;
  }
}

export async function createBlogPost(postData: Omit<BlogPost, '_id' | 'publishDate'> & { publishDateString?: string }): Promise<BlogPost | null> {
  if (!isDbEnabled()) {
    const newPost: BlogPost = {
      _id: `mock_${Date.now()}`,
      ...postData,
      publishDate: postData.publishDateString ? new Date(postData.publishDateString) : new Date(),
      views: 0,
      likes: 0,
      comments: 0,
    };
    MOCK_BLOG_POSTS.unshift(newPost);
    return newPost;
  }

  try {
    const publishDate = postData.publishDateString ? new Date(postData.publishDateString) : new Date();
    const rows = await db.insert(blogPosts).values({
      id: postData.id,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      authorName: postData.authorName,
      authorId: postData.authorId || null,
      authorAvatarUrl: postData.authorAvatarUrl || null,
      authorAvatarHint: postData.authorAvatarHint || null,
      publishDate,
      status: postData.status,
      featuredImageUrl: postData.featuredImageUrl,
      featuredImageHint: postData.featuredImageHint,
      category: postData.category || null,
      categorySlug: postData.categorySlug || null,
      tags: postData.tags || [],
      views: 0,
      likes: 0,
      comments: 0,
    }).returning();
    return rows[0] ? rowToPost(rows[0]) : null;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
}

export async function updateBlogPost(postId: string, postData: Partial<Omit<BlogPost, '_id' | 'id' | 'publishDate'>> & { publishDateString?: string }): Promise<BlogPost | null> {
  if (!isDbEnabled()) {
    const postIndex = MOCK_BLOG_POSTS.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;
    const updatedFields: Partial<BlogPost> = { ...postData };
    if (postData.publishDateString) {
      updatedFields.publishDate = new Date(postData.publishDateString);
    }
    MOCK_BLOG_POSTS[postIndex] = { ...MOCK_BLOG_POSTS[postIndex], ...updatedFields };
    return MOCK_BLOG_POSTS[postIndex];
  }

  try {
    const updateValues: Record<string, unknown> = {};
    if (postData.title !== undefined) updateValues.title = postData.title;
    if (postData.excerpt !== undefined) updateValues.excerpt = postData.excerpt;
    if (postData.content !== undefined) updateValues.content = postData.content;
    if (postData.authorName !== undefined) updateValues.authorName = postData.authorName;
    if (postData.status !== undefined) updateValues.status = postData.status;
    if (postData.featuredImageUrl !== undefined) updateValues.featuredImageUrl = postData.featuredImageUrl;
    if (postData.featuredImageHint !== undefined) updateValues.featuredImageHint = postData.featuredImageHint;
    if (postData.category !== undefined) updateValues.category = postData.category;
    if (postData.categorySlug !== undefined) updateValues.categorySlug = postData.categorySlug;
    if (postData.tags !== undefined) updateValues.tags = postData.tags;
    if (postData.publishDateString) updateValues.publishDate = new Date(postData.publishDateString);

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(blogPosts).set(updateValues).where(eq(blogPosts.id, postId)).returning();
    return rows[0] ? rowToPost(rows[0]) : null;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

export async function deleteBlogPost(postId: string): Promise<boolean> {
  if (!isDbEnabled()) {
    const indexToRemove = MOCK_BLOG_POSTS.findIndex(p => p.id === postId);
    if (indexToRemove > -1) {
      MOCK_BLOG_POSTS.splice(indexToRemove, 1);
      return true;
    }
    return false;
  }

  try {
    const rows = await db.delete(blogPosts).where(eq(blogPosts.id, postId)).returning({ id: blogPosts.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}
