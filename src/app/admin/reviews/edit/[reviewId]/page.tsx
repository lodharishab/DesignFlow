
"use client";

import { useState, useEffect, Suspense, useActionState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ArrowLeft, Loader2, Save, Edit3, PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updateReviewDetailsAction, type ReviewActionResult } from '@/app/admin/reviews/actions';
import { mockReviewsData } from '@/app/admin/reviews/data';
import type { Review } from '@/app/admin/reviews/data';

function EditReviewForm({ review }: { review: Review }) {
  const updateReviewActionWithId = updateReviewDetailsAction.bind(null, review.id);
  const [state, formAction] = useActionState(updateReviewActionWithId, { success: false, message: '' });
  const { toast } = useToast();
  const router = useRouter();

  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        router.push('/admin/reviews');
      }
    }
  }, [state, toast, router]);

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    );
  }

  return (
    <form action={formAction}>
       <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Rating</Label>
            <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-8 w-8 cursor-pointer transition-all",
                    (hoverRating >= star || rating >= star)
                      ? "text-yellow-400 fill-current"
                      : "text-muted-foreground/30"
                  )}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {/* Hidden input to pass rating value to form action */}
            <input type="hidden" name="rating" value={rating} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewText" className="text-lg font-medium">Review Text</Label>
            <Textarea
              id="reviewText"
              name="reviewText"
              rows={5}
              placeholder="e.g., The client provided a clear brief..."
              defaultValue={review.reviewText}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
                <Link href="/admin/reviews">Cancel</Link>
            </Button>
          <SubmitButton />
        </CardFooter>
    </form>
  )
}


function EditReviewContent() {
  const params = useParams();
  const reviewId = params.reviewId as string;
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reviewId) {
      const foundReview = mockReviewsData.find(r => r.id === reviewId);
      setReview(foundReview || null);
      setIsLoading(false);
    }
  }, [reviewId]);

  if (isLoading) {
    return <div className="text-center py-10">Loading review...</div>;
  }
  
  if (!review) {
     return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Review Not Found</CardTitle>
                <CardDescription className="text-center">
                    This review does not exist or has been deleted.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/admin/reviews">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Reviews
                    </Link>
                </Button>
            </CardFooter>
        </Card>
     )
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Review</CardTitle>
        <CardDescription>
          Modifying review for order <span className="font-semibold text-primary">{review.orderId}</span> by <span className="font-semibold text-primary">{review.authorName}</span>.
        </CardDescription>
      </CardHeader>
      <EditReviewForm review={review} />
    </Card>
  );
}

export default function EditReviewPage() {
    return (
        <div className="space-y-8">
             <h1 className="text-3xl font-bold font-headline flex items-center">
                <Edit3 className="mr-3 h-8 w-8 text-primary" />
                Edit Review
            </h1>
            <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
                <EditReviewContent />
            </Suspense>
        </div>
    )
}
