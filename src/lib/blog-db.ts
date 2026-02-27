'use server';
import { query, queryOne, isDbEnabled } from './db';

export interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorId?: string;
  authorAvatarUrl?: string;
  authorAvatarHint?: string;
  publishDate: Date;
  status: 'Published' | 'Draft' | 'Scheduled';
  featuredImageUrl: string;
  featuredImageHint: string;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
}

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

interface BlogRow {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_id: string | null;
  author_avatar_url: string | null;
  author_avatar_hint: string | null;
  publish_date: Date;
  status: string;
  featured_image_url: string;
  featured_image_hint: string;
  category: string | null;
  category_slug: string | null;
  tags: string[] | null;
  views: number;
  likes: number;
  comments: number;
}

function rowToPost(row: BlogRow): BlogPost {
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    authorName: row.author_name || '',
    authorId: row.author_id || undefined,
    authorAvatarUrl: row.author_avatar_url || undefined,
    authorAvatarHint: row.author_avatar_hint || undefined,
    publishDate: new Date(row.publish_date),
    status: row.status as BlogPost['status'],
    featuredImageUrl: row.featured_image_url || '',
    featuredImageHint: row.featured_image_hint || '',
    category: row.category || undefined,
    categorySlug: row.category_slug || undefined,
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
    const rows = await query<BlogRow>('SELECT * FROM blog_posts ORDER BY publish_date DESC');
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
    const row = await queryOne<BlogRow>('SELECT * FROM blog_posts WHERE id = $1', [slug]);
    return row ? rowToPost(row) : null;
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
    const row = await queryOne<BlogRow>(
      `INSERT INTO blog_posts (id, title, excerpt, content, author_name, author_id, author_avatar_url, author_avatar_hint, publish_date, status, featured_image_url, featured_image_hint, category, category_slug, tags, views, likes, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 0, 0, 0)
       RETURNING *`,
      [postData.id, postData.title, postData.excerpt, postData.content, postData.authorName, postData.authorId || null, postData.authorAvatarUrl || null, postData.authorAvatarHint || null, publishDate, postData.status, postData.featuredImageUrl, postData.featuredImageHint, postData.category || null, postData.categorySlug || null, postData.tags || []]
    );
    return row ? rowToPost(row) : null;
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
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (postData.title !== undefined) { setClauses.push(`title = $${paramIndex++}`); values.push(postData.title); }
    if (postData.excerpt !== undefined) { setClauses.push(`excerpt = $${paramIndex++}`); values.push(postData.excerpt); }
    if (postData.content !== undefined) { setClauses.push(`content = $${paramIndex++}`); values.push(postData.content); }
    if (postData.authorName !== undefined) { setClauses.push(`author_name = $${paramIndex++}`); values.push(postData.authorName); }
    if (postData.status !== undefined) { setClauses.push(`status = $${paramIndex++}`); values.push(postData.status); }
    if (postData.featuredImageUrl !== undefined) { setClauses.push(`featured_image_url = $${paramIndex++}`); values.push(postData.featuredImageUrl); }
    if (postData.featuredImageHint !== undefined) { setClauses.push(`featured_image_hint = $${paramIndex++}`); values.push(postData.featuredImageHint); }
    if (postData.category !== undefined) { setClauses.push(`category = $${paramIndex++}`); values.push(postData.category); }
    if (postData.categorySlug !== undefined) { setClauses.push(`category_slug = $${paramIndex++}`); values.push(postData.categorySlug); }
    if (postData.tags !== undefined) { setClauses.push(`tags = $${paramIndex++}`); values.push(postData.tags); }
    if (postData.publishDateString) { setClauses.push(`publish_date = $${paramIndex++}`); values.push(new Date(postData.publishDateString)); }

    if (setClauses.length === 0) return null;

    values.push(postId);
    const row = await queryOne<BlogRow>(
      `UPDATE blog_posts SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return row ? rowToPost(row) : null;
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
    const result = await query<{ id: string }>('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [postId]);
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}
