
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


export async function updateReviewDetailsAction(
    prevState: ReviewActionResult, // Previous state from the hook
    formData: FormData
): Promise<ReviewActionResult> {
  // The reviewId is not directly passed. It must be part of the form data.
  // Let's assume we add it as a hidden input. Or, for this fix, we can assume the binding was intended to work differently.
  // The `bind` method prepends arguments. So the signature becomes (bound_arg, ...original_args).
  // The hook calls the action with (prevState, formData).
  // So when bound, our action receives (reviewId, prevState, formData) but the types are wrong.
  // Let's correct the signature to what the hook expects after binding.
  
  // The user's code had `updateReviewDetailsAction.bind(null, review.id)`.
  // The correct way to handle this with `useActionState` is often to pass the ID in the form.
  // However, a more direct fix is to adjust the action signature to expect the bound argument.
  // The error `formData.get is not a function` indicates that `prevState` is being interpreted as `formData`.
  // Let's fix the action signature. The bound action `updateReviewActionWithId` has the signature `(prevState, formData)`.
  // The original function `updateReviewDetailsAction` when bound with `review.id` will receive `review.id` as its first argument,
  // then the arguments from the hook call.
  // So the signature should be `(reviewId: string, prevState: ReviewActionResult, formData: FormData)`

  // The error message says `formData.get` is not a function. This means the second argument is not FormData.
  // The `useActionState` hook's action receives `(previousState, newPayload)`.
  // The bound action `updateReviewActionWithId` is what the hook calls.
  // So, `updateReviewDetailsAction` receives `reviewId`, then `previousState`, then `newPayload`.
  // The types are getting mixed up. Let's fix the action to correctly handle the arguments.

  const reviewId = formData.get('reviewId') as string;
  const rating = Number(formData.get('rating'));
  const reviewText = formData.get('reviewText') as string;

  if (!reviewId) {
    return { success: false, message: "Review ID is missing from the form." };
  }

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

