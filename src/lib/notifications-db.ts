'use server';
import { db, isDbEnabled } from './db';
import { notifications } from './schema';
import { eq, desc, and } from 'drizzle-orm';

// ============================================================================
// Types
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message?: string;
  relatedOrderId?: string;
  relatedPortfolioId?: string;
  priority: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
}

// ============================================================================
// Row mapper
// ============================================================================

function rowToNotification(row: typeof notifications.$inferSelect): Notification {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    title: row.title,
    message: row.message || undefined,
    relatedOrderId: row.relatedOrderId || undefined,
    relatedPortfolioId: row.relatedPortfolioId || undefined,
    priority: row.priority || 'Medium',
    isRead: row.isRead || false,
    isArchived: row.isArchived || false,
    createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
  };
}

// ============================================================================
// Notifications CRUD
// ============================================================================

export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isArchived, false),
      ))
      .orderBy(desc(notifications.createdAt));
    return rows.map(rowToNotification);
  } catch (e) {
    console.error('Error fetching notifications:', e);
    return [];
  }
}

export async function getAllNotifications(): Promise<Notification[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    return rows.map(rowToNotification);
  } catch (e) {
    console.error('Error fetching all notifications:', e);
    return [];
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!isDbEnabled()) return 0;
  try {
    const rows = await db.select().from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
        eq(notifications.isArchived, false),
      ));
    return rows.length;
  } catch (e) {
    console.error('Error counting unread notifications:', e);
    return 0;
  }
}

export async function createNotification(data: Notification): Promise<Notification | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(notifications).values({
      id: data.id,
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message || null,
      relatedOrderId: data.relatedOrderId || null,
      relatedPortfolioId: data.relatedPortfolioId || null,
      priority: data.priority || 'Medium',
      isRead: false,
      isArchived: false,
      createdAt: data.createdAt || new Date(),
    }).returning();
    return rows[0] ? rowToNotification(rows[0]) : null;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning({ id: notifications.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    await db.update(notifications).set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

export async function archiveNotification(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.update(notifications).set({ isArchived: true }).where(eq(notifications.id, id)).returning({ id: notifications.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error archiving notification:', error);
    return false;
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(notifications).where(eq(notifications.id, id)).returning({ id: notifications.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}
