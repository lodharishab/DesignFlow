'use server';
import { db, isDbEnabled } from './db';
import { reviews } from './schema';
import { eq, desc, and } from 'drizzle-orm';
import type { DesignerReview, AdminReview } from './types';
export type { DesignerReview, AdminReview };

/** Import the hardcoded fallback data — will be removed once all data is in DB */
import { mockDesignerReviews as MOCK_REVIEWS } from './reviews-data';

function rowToDesignerReview(row: typeof reviews.$inferSelect): DesignerReview {
  return {
    id: row.id,
    orderId: row.orderId || '',
    clientName: row.authorName,
    clientAvatarUrl: row.clientAvatarUrl || 'https://placehold.co/100x100.png',
    clientAvatarHint: row.clientAvatarHint || '',
    serviceName: row.serviceName || '',
    category: row.category || '',
    rating: row.rating,
    reviewText: row.reviewText || undefined,
    reviewDate: row.reviewDate ? new Date(row.reviewDate) : new Date(),
    isFeatured: row.isFeatured || false,
    isReported: row.isReported || false,
    revisions: row.revisions || 0,
  };
}

function rowToAdminReview(row: typeof reviews.$inferSelect): AdminReview {
  return {
    id: row.id,
    orderId: row.orderId || '',
    authorName: row.authorName,
    authorRole: row.authorRole || 'Client',
    recipientName: row.recipientName || '',
    serviceName: row.serviceName || '',
    rating: row.rating,
    reviewText: row.reviewText || undefined,
    reviewDate: row.reviewDate ? new Date(row.reviewDate) : new Date(),
    status: (row.status as AdminReview['status']) || 'Pending',
  };
}

export async function getReviewsByDesignerId(designerId: string): Promise<DesignerReview[]> {
  if (!isDbEnabled()) {
    return MOCK_REVIEWS;
  }
  try {
    const rows = await db.select().from(reviews)
      .where(eq(reviews.recipientId, designerId))
      .orderBy(desc(reviews.reviewDate));
    if (rows.length === 0) return MOCK_REVIEWS; // Fallback if DB is empty
    return rows.map(rowToDesignerReview);
  } catch (e) {
    console.error('Error fetching reviews for designer:', e);
    return MOCK_REVIEWS;
  }
}

export async function getReviewsByOrderId(orderId: string): Promise<DesignerReview[]> {
  if (!isDbEnabled()) {
    return MOCK_REVIEWS.filter(r => r.orderId === orderId);
  }
  try {
    const rows = await db.select().from(reviews)
      .where(eq(reviews.orderId, orderId))
      .orderBy(desc(reviews.reviewDate));
    return rows.map(rowToDesignerReview);
  } catch (e) {
    console.error('Error fetching reviews for order:', e);
    return MOCK_REVIEWS.filter(r => r.orderId === orderId);
  }
}

export async function getAllReviews(): Promise<AdminReview[]> {
  if (!isDbEnabled()) {
    return MOCK_REVIEWS.map(r => ({
      id: r.id,
      orderId: r.orderId,
      authorName: r.clientName,
      authorRole: 'Client' as const,
      recipientName: '',
      serviceName: r.serviceName,
      rating: r.rating,
      reviewText: r.reviewText,
      reviewDate: r.reviewDate,
      status: 'Approved' as const,
    }));
  }
  try {
    const rows = await db.select().from(reviews).orderBy(desc(reviews.reviewDate));
    return rows.map(rowToAdminReview);
  } catch (e) {
    console.error('Error fetching all reviews:', e);
    return [];
  }
}

export async function getFeaturedReviews(limit: number = 3): Promise<DesignerReview[]> {
  if (!isDbEnabled()) {
    return MOCK_REVIEWS.filter(r => r.isFeatured).slice(0, limit);
  }
  try {
    const rows = await db.select().from(reviews)
      .where(eq(reviews.isFeatured, true))
      .orderBy(desc(reviews.reviewDate))
      .limit(limit);
    if (rows.length === 0) return MOCK_REVIEWS.filter(r => r.isFeatured).slice(0, limit);
    return rows.map(rowToDesignerReview);
  } catch (e) {
    console.error('Error fetching featured reviews:', e);
    return [];
  }
}

export async function createReview(data: {
  id: string;
  orderId: string;
  authorId?: string;
  authorName: string;
  authorRole?: string;
  recipientId?: string;
  recipientName?: string;
  serviceName?: string;
  category?: string;
  rating: number;
  reviewText?: string;
  reviewDate?: Date;
  clientAvatarUrl?: string;
  clientAvatarHint?: string;
  revisions?: number;
}): Promise<DesignerReview | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(reviews).values({
      id: data.id,
      orderId: data.orderId,
      authorId: data.authorId || null,
      authorName: data.authorName,
      authorRole: data.authorRole || 'Client',
      recipientId: data.recipientId || null,
      recipientName: data.recipientName || null,
      serviceName: data.serviceName || null,
      category: data.category || null,
      rating: data.rating,
      reviewText: data.reviewText || null,
      reviewDate: data.reviewDate || new Date(),
      status: 'Pending',
      isFeatured: false,
      isReported: false,
      revisions: data.revisions || 0,
      clientAvatarUrl: data.clientAvatarUrl || null,
      clientAvatarHint: data.clientAvatarHint || null,
    }).returning();
    return rows[0] ? rowToDesignerReview(rows[0]) : null;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
}

export async function updateReview(id: string, data: Partial<{
  rating: number;
  reviewText: string;
  status: string;
  isFeatured: boolean;
  isReported: boolean;
}>): Promise<AdminReview | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.rating !== undefined) updateValues.rating = data.rating;
    if (data.reviewText !== undefined) updateValues.reviewText = data.reviewText;
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.isFeatured !== undefined) updateValues.isFeatured = data.isFeatured;
    if (data.isReported !== undefined) updateValues.isReported = data.isReported;

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(reviews).set(updateValues).where(eq(reviews.id, id)).returning();
    return rows[0] ? rowToAdminReview(rows[0]) : null;
  } catch (error) {
    console.error('Error updating review:', error);
    return null;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).returning({ id: reviews.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
}
