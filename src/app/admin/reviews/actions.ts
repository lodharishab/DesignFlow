
'use server';

import { revalidatePath } from 'next/cache';
import { updateReview } from '@/lib/reviews-db';
import type { AdminReview } from '@/lib/types';

export interface ReviewActionResult {
  success: boolean;
  message: string;
  review?: AdminReview;
}

export async function updateReviewStatusAction(reviewId: string, newStatus: 'Pending' | 'Approved' | 'Hidden'): Promise<ReviewActionResult> {
  try {
    const updated = await updateReview(reviewId, { status: newStatus });
    if (!updated) {
      return { success: false, message: "Review not found or update failed." };
    }
    
    revalidatePath('/admin/reviews');
    revalidatePath(`/admin/reviews/edit/${reviewId}`);
    
    return { success: true, message: "Status updated successfully.", review: updated };
  } catch (error) {
    console.error(`Failed to update review ${reviewId} status:`, error);
    return { success: false, message: "An unexpected error occurred while updating the review status." };
  }
}


export async function updateReviewDetailsAction(
    prevState: ReviewActionResult,
    formData: FormData
): Promise<ReviewActionResult> {

  const reviewId = formData.get('reviewId') as string;
  const rating = Number(formData.get('rating'));
  const reviewText = formData.get('reviewText') as string;

  if (!reviewId) {
    return { success: false, message: "Review ID is missing from the form." };
  }

  if (isNaN(rating) || rating < 0 || rating > 5) {
    return { success: false, message: "Invalid rating value." };
  }

  try {
    const updated = await updateReview(reviewId, {
      rating,
      reviewText: reviewText || '',
    });

    if (!updated) {
      return { success: false, message: "Review not found or update failed." };
    }

    revalidatePath('/admin/reviews');
    revalidatePath(`/admin/reviews/edit/${reviewId}`);
    
    return { success: true, message: "Review details updated successfully.", review: updated };
  } catch (error) {
    console.error(`Failed to update review ${reviewId} details:`, error);
    return { success: false, message: "An unexpected error occurred while updating the review." };
  }
}
