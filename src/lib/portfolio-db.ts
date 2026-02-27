'use server';
import { query, queryOne, isDbEnabled } from './db';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
import { allPortfolioItemsData } from '@/app/portfolio/page';

export interface PortfolioItemRecord extends Omit<PortfolioItem, '_id' | 'id'> {
  _id?: string;
  id: string;
  designerId: string;
}

interface PortfolioRow {
  id: string;
  designer_id: string;
  title: string;
  category: string;
  category_slug: string;
  client_name: string | null;
  project_date: string | null;
  cover_image_url: string;
  cover_image_hint: string;
  project_description: string;
  gallery_images: Array<{ url: string; hint: string; caption?: string }>;
  tags: string[] | null;
  views: number;
  likes: number;
  designer: { id: string; slug: string; name: string; avatarUrl?: string; imageHint?: string } | null;
}

function rowToItem(row: PortfolioRow): PortfolioItem {
  return {
    _id: row.id,
    id: row.id,
    designerId: row.designer_id,
    title: row.title,
    category: row.category,
    categorySlug: row.category_slug,
    clientName: row.client_name || undefined,
    projectDate: row.project_date || undefined,
    coverImageUrl: row.cover_image_url,
    coverImageHint: row.cover_image_hint,
    projectDescription: row.project_description,
    galleryImages: row.gallery_images || [],
    tags: row.tags || [],
    views: row.views || 0,
    likes: row.likes || 0,
    designer: row.designer || undefined,
  };
}

export async function getPortfolioItemsByDesignerId(designerId: string): Promise<PortfolioItem[]> {
  if (!isDbEnabled()) {
    return allPortfolioItemsData.filter(item => item.designer?.id === designerId);
  }
  try {
    const rows = await query<PortfolioRow>(
      'SELECT * FROM portfolio_items WHERE designer_id = $1 ORDER BY project_date DESC',
      [designerId]
    );
    return rows.map(rowToItem);
  } catch (error) {
    console.error('Error fetching portfolio items by designer ID:', error);
    return [];
  }
}

export async function getPortfolioItemById(itemId: string): Promise<PortfolioItem | null> {
  if (!isDbEnabled()) {
    return allPortfolioItemsData.find(item => item.id === itemId) || null;
  }
  try {
    const row = await queryOne<PortfolioRow>('SELECT * FROM portfolio_items WHERE id = $1', [itemId]);
    return row ? rowToItem(row) : null;
  } catch (error) {
    console.error('Error fetching portfolio item by ID:', error);
    return null;
  }
}

export async function createPortfolioItem(
  itemData: Omit<PortfolioItem, '_id'> & { designerId: string }
): Promise<PortfolioItem | null> {
  const itemWithStats = {
    ...itemData,
    views: Math.floor(Math.random() * 500),
    likes: Math.floor(Math.random() * 100),
  };

  if (!isDbEnabled()) {
    allPortfolioItemsData.unshift(itemWithStats as PortfolioItem);
    return {
      ...itemWithStats,
      _id: `mock_${Date.now()}`,
    };
  }

  try {
    const row = await queryOne<PortfolioRow>(
      `INSERT INTO portfolio_items (id, designer_id, title, category, category_slug, client_name, project_date, cover_image_url, cover_image_hint, project_description, gallery_images, tags, views, likes, designer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [itemWithStats.id, itemWithStats.designerId, itemWithStats.title, itemWithStats.category, itemWithStats.categorySlug, itemWithStats.clientName || null, itemWithStats.projectDate || null, itemWithStats.coverImageUrl, itemWithStats.coverImageHint, itemWithStats.projectDescription, JSON.stringify(itemWithStats.galleryImages || []), itemWithStats.tags || [], itemWithStats.views, itemWithStats.likes, JSON.stringify(itemWithStats.designer || null)]
    );
    return row ? rowToItem(row) : null;
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return null;
  }
}

export async function updatePortfolioItem(
  itemId: string,
  designerId: string,
  itemData: Partial<Omit<PortfolioItem, '_id' | 'id' | 'designerId'>>
): Promise<PortfolioItem | null> {
  if (!isDbEnabled()) {
    return null;
  }
  try {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (itemData.title !== undefined) { setClauses.push(`title = $${paramIndex++}`); values.push(itemData.title); }
    if (itemData.category !== undefined) { setClauses.push(`category = $${paramIndex++}`); values.push(itemData.category); }
    if (itemData.categorySlug !== undefined) { setClauses.push(`category_slug = $${paramIndex++}`); values.push(itemData.categorySlug); }
    if (itemData.projectDescription !== undefined) { setClauses.push(`project_description = $${paramIndex++}`); values.push(itemData.projectDescription); }
    if (itemData.coverImageUrl !== undefined) { setClauses.push(`cover_image_url = $${paramIndex++}`); values.push(itemData.coverImageUrl); }
    if (itemData.coverImageHint !== undefined) { setClauses.push(`cover_image_hint = $${paramIndex++}`); values.push(itemData.coverImageHint); }
    if (itemData.galleryImages !== undefined) { setClauses.push(`gallery_images = $${paramIndex++}`); values.push(JSON.stringify(itemData.galleryImages)); }
    if (itemData.tags !== undefined) { setClauses.push(`tags = $${paramIndex++}`); values.push(itemData.tags); }

    if (setClauses.length === 0) return null;

    values.push(itemId, designerId);
    const row = await queryOne<PortfolioRow>(
      `UPDATE portfolio_items SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} AND designer_id = $${paramIndex} RETURNING *`,
      values
    );
    return row ? rowToItem(row) : null;
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return null;
  }
}

export async function deletePortfolioItem(itemId: string, designerId: string): Promise<boolean> {
  if (!isDbEnabled()) {
    return false;
  }
  try {
    const result = await query<{ id: string }>('DELETE FROM portfolio_items WHERE id = $1 AND designer_id = $2 RETURNING id', [itemId, designerId]);
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return false;
  }
}
