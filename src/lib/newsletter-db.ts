'use server';

import { db, isDbEnabled } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface NewsletterResult {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    if (isDbEnabled()) {
      // Check for existing subscriber
      const existing = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, trimmed))
        .limit(1);

      if (existing.length > 0) {
        if (existing[0].status === 'Active') {
          return { success: true, message: "You're already subscribed! 🎉" };
        }
        // Reactivate unsubscribed user
        await db
          .update(newsletterSubscribers)
          .set({ status: 'Active', subscribedAt: new Date() })
          .where(eq(newsletterSubscribers.email, trimmed));
        return { success: true, message: "Welcome back! You've been re-subscribed. 🎉" };
      }

      const id = `nl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await db.insert(newsletterSubscribers).values({
        id,
        email: trimmed,
        status: 'Active',
        source: 'website',
      });
    }

    console.log('[Newsletter Subscribe]', { email: trimmed, timestamp: new Date().toISOString() });
    return { success: true, message: 'Thanks for subscribing! 🎉' };
  } catch (error) {
    console.error('Newsletter subscribe failed:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
