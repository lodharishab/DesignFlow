
'use server';

import { revalidatePath } from 'next/cache';
import { mockReviewsData } from './data';
import type { Review } from './data';


export interface ReviewActionResult {
  success: boolean;
  message: string;
  review?: Review;
}

export async function updateReviewStatusAction(reviewId: string, newStatus: Review['status']): Promise<ReviewActionResult> {
  // This is a simulation. In a real app, you would update the database.
  console.log(`Simulating update for review ${reviewId} to status ${newStatus}`);
  
  const reviewIndex = mockReviewsData.findIndex(r => r.id === reviewId);
  if (reviewIndex === -1) {
    return { success: false, message: "Review not found." };
  }
  
  mockReviewsData[reviewIndex].status = newStatus;
  
  // Revalidate paths to reflect changes
  revalidatePath('/admin/reviews');
  // You might also revalidate public pages where reviews are shown
  
  return { success: true, message: "Status updated successfully." };
}


export async function updateReviewDetailsAction(reviewId: string, formData: FormData): Promise<ReviewActionResult> {
  const rating = Number(formData.get('rating'));
  const reviewText = formData.get('reviewText') as string;

  if (isNaN(rating) || rating < 0 || rating > 5) {
    return { success: false, message: "Invalid rating value." };
  }

  console.log(`Simulating update for review ${reviewId} with rating: ${rating} and text: "${reviewText}"`);

  const reviewIndex = mockReviewsData.findIndex(r => r.id === reviewId);
  if (reviewIndex === -1) {
    return { success: false, message: "Review not found." };
  }

  // Update the mock data
  mockReviewsData[reviewIndex].rating = rating;
  mockReviewsData[reviewIndex].reviewText = reviewText;

  revalidatePath('/admin/reviews');
  revalidatePath(`/admin/reviews/edit/${reviewId}`);
  
  return { success: true, message: "Review details updated successfully.", review: mockReviewsData[reviewIndex] };
}
