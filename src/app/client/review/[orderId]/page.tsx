
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ArrowLeft, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getOrderById, type Order } from '@/lib/orders-db';
import { createReview } from '@/lib/reviews-db';

function LeaveReviewContent() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(found => {
        setOrder(found && found.status === 'Completed' ? found : null);
        setIsLoading(false);
      });
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const reviewId = `rev-${orderId}-${Date.now()}`;
      const result = await createReview({
        id: reviewId,
        orderId,
        authorId: 'client001',
        authorName: 'Client User',
        authorRole: 'Client',
        recipientId: order?.designerId || undefined,
        recipientName: order?.designerName || undefined,
        serviceName: order?.serviceName || undefined,
        rating,
        reviewText: reviewText || undefined,
        reviewDate: new Date(),
      });
      if (result) {
        toast({
          title: "Review Submitted!",
          description: "Thank you for your feedback. Your review has been saved.",
        });
      } else {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback, but it could not be saved to the database.",
          variant: "destructive",
        });
      }
      router.push(`/client/orders/${orderId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }
  
  if (!order) {
     return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Order Not Found</CardTitle>
                <CardDescription className="text-center">
                    This order was not found, or it is not yet complete. You can only review completed orders.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/client/orders">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Orders
                    </Link>
                </Button>
            </CardFooter>
        </Card>
     )
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Leave a Review</CardTitle>
        <CardDescription>
          Share your experience for order <span className="font-semibold text-primary">{order.id}</span> ({order.serviceName}).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Your Rating</Label>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewText" className="text-lg font-medium">Your Review (Optional)</Label>
            <Textarea
              id="reviewText"
              rows={5}
              placeholder="Tell us about your experience with the designer and the final result..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
                <Link href={`/client/orders/${orderId}`}>Cancel</Link>
            </Button>
          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LeaveReviewPage() {
    return (
        <div className="space-y-8">
             <h1 className="text-3xl font-bold font-headline flex items-center">
                <Star className="mr-3 h-8 w-8 text-primary" />
                Project Review
            </h1>
            <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
                <LeaveReviewContent />
            </Suspense>
        </div>
    )
}
