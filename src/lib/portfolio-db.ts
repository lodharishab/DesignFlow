'use server';
import { db, isDbEnabled } from './db';
import { portfolioItems } from './schema';
import { eq, desc } from 'drizzle-orm';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';
export type { PortfolioItem };
import { allPortfolioItemsData } from '@/app/portfolio/page';

export interface PortfolioItemRecord extends Omit<PortfolioItem, '_id' | 'id'> {
  _id?: string;
  id: string;
  designerId: string;
}

function rowToItem(row: typeof portfolioItems.$inferSelect): PortfolioItem {
  return {
    _id: row.id,
    id: row.id,
    designerId: row.designerId || undefined,
    title: row.title,
    category: row.category || '',
    categorySlug: row.categorySlug || '',
    clientName: row.clientName || undefined,
    projectDate: row.projectDate || undefined,
    coverImageUrl: row.coverImageUrl || '',
    coverImageHint: row.coverImageHint || '',
    projectDescription: row.projectDescription || '',
    galleryImages: row.galleryImages || [],
    tags: row.tags || [],
    views: row.views || 0,
    likes: row.likes || 0,
    designer: row.designer || undefined,
  };
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  if (!isDbEnabled()) return allPortfolioItemsData;
  try {
    const rows = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.projectDate));
    return rows.map(rowToItem);
  } catch (error) {
    console.error('Error fetching all portfolio items:', error);
    return [];
  }
}

export async function getPortfolioItemsByDesignerId(designerId: string): Promise<PortfolioItem[]> {
  if (!isDbEnabled()) {
    return allPortfolioItemsData.filter(item => item.designer?.id === designerId);
  }
  try {
    const rows = await db.select().from(portfolioItems)
      .where(eq(portfolioItems.designerId, designerId))
      .orderBy(desc(portfolioItems.projectDate));
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
    const rows = await db.select().from(portfolioItems).where(eq(portfolioItems.id, itemId));
    return rows[0] ? rowToItem(rows[0]) : null;
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
    const rows = await db.insert(portfolioItems).values({
      id: itemWithStats.id,
      designerId: itemWithStats.designerId,
      title: itemWithStats.title,
      category: itemWithStats.category,
      categorySlug: itemWithStats.categorySlug,
      clientName: itemWithStats.clientName || null,
      projectDate: itemWithStats.projectDate || null,
      coverImageUrl: itemWithStats.coverImageUrl,
      coverImageHint: itemWithStats.coverImageHint,
      projectDescription: itemWithStats.projectDescription,
      galleryImages: itemWithStats.galleryImages || [],
      tags: itemWithStats.tags || [],
      views: itemWithStats.views,
      likes: itemWithStats.likes,
      designer: itemWithStats.designer || null,
    }).returning();
    return rows[0] ? rowToItem(rows[0]) : null;
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
    const updateValues: Record<string, unknown> = {};
    if (itemData.title !== undefined) updateValues.title = itemData.title;
    if (itemData.category !== undefined) updateValues.category = itemData.category;
    if (itemData.categorySlug !== undefined) updateValues.categorySlug = itemData.categorySlug;
    if (itemData.projectDescription !== undefined) updateValues.projectDescription = itemData.projectDescription;
    if (itemData.coverImageUrl !== undefined) updateValues.coverImageUrl = itemData.coverImageUrl;
    if (itemData.coverImageHint !== undefined) updateValues.coverImageHint = itemData.coverImageHint;
    if (itemData.galleryImages !== undefined) updateValues.galleryImages = itemData.galleryImages;
    if (itemData.tags !== undefined) updateValues.tags = itemData.tags;

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(portfolioItems)
      .set(updateValues)
      .where(eq(portfolioItems.id, itemId))
      .returning();

    // Verify designer ownership
    if (rows[0] && rows[0].designerId !== designerId) return null;

    return rows[0] ? rowToItem(rows[0]) : null;
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
    const rows = await db.delete(portfolioItems)
      .where(eq(portfolioItems.id, itemId))
      .returning({ id: portfolioItems.id, designerId: portfolioItems.designerId });

    // Verify designer ownership
    return rows.length > 0 && rows[0].designerId === designerId;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return false;
  }
}
