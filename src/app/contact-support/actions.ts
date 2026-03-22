'use server';

import { db, isDbEnabled } from '@/lib/db';
import { supportTickets } from '@/lib/schema';

export interface ContactFormResult {
  success: boolean;
  message: string;
}

export async function submitContactFormAction(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactFormResult> {
  // Validate inputs
  if (!formData.name || formData.name.length < 2) {
    return { success: false, message: 'Please provide your name (at least 2 characters).' };
  }
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return { success: false, message: 'Please provide a valid email address.' };
  }
  if (!formData.subject || formData.subject.length < 3) {
    return { success: false, message: 'Subject must be at least 3 characters.' };
  }
  if (!formData.message || formData.message.length < 10) {
    return { success: false, message: 'Message must be at least 10 characters.' };
  }

  try {
    // Log the support request
    console.log('[Support Request]', {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString(),
    });

    // Persist to support_tickets table
    if (isDbEnabled()) {
      const ticketId = `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await db.insert(supportTickets).values({
        id: ticketId,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'Open',
      });
    }
    
    return {
      success: true,
      message: 'Your message has been received. Our support team will get back to you within 24 hours.',
    };
  } catch (error) {
    console.error('Failed to process support request:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
}
