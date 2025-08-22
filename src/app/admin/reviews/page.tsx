
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, EyeOff, User, Briefcase, FileText, UserCog, UserCircle, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { updateReviewStatusAction, type Review } from '@/app/admin/reviews/actions';
import { mockReviewsData } from '@/app/admin/reviews/data';


export default function AdminReviewsPage(): ReactElement {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockReviewsData);
  const [statusFilter, setStatusFilter] = useState<'All' | Review['status']>('All');

  const handleUpdateStatus = async (reviewId: string, newStatus: Review['status']) => {
    // Optimistic UI update
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );

    const result = await updateReviewStatusAction(reviewId, newStatus);
    
    if (result.success) {
      toast({
        title: "Review Status Updated",
        description: `Review ${reviewId} has been set to ${newStatus}.`,
      });
    } else {
      // Revert UI on failure
       setReviews(mockReviewsData); // or re-fetch from source
       toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const filteredReviews = reviews.filter(review => 
    statusFilter === 'All' || review.status === statusFilter
  );

  const getStatusBadgeVariant = (status: Review['status']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Hidden': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role: Review['authorRole']) => {
    switch(role) {
      case 'Client': return <UserCircle className="mr-1.5 h-3 w-3 text-blue-500" />;
      case 'Designer': return <UserCog className="mr-1.5 h-3 w-3 text-green-500" />;
      default: return <User className="mr-1.5 h-3 w-3" />;
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Star className="mr-3 h-8 w-8 text-primary" />
          Manage Reviews
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Client & Designer Reviews</CardTitle>
          <CardDescription>Approve, hide, or manage feedback. Approved reviews will be visible on relevant public profiles.</CardDescription>
           <div className="pt-4 flex items-center gap-4">
            <Label htmlFor="statusFilter" className="font-semibold">Filter by status:</Label>
             <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'All' | Review['status'])}>
              <SelectTrigger id="statusFilter" className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
           </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Review</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-center w-[120px]">Rating</TableHead>
                  <TableHead className="text-center w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24">No reviews match the current filter.</TableCell></TableRow>
                ) : (
                  filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <p className="text-sm text-foreground italic">{review.reviewText ? `"${review.reviewText}"` : <span className="text-muted-foreground">No written review.</span>}</p>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-semibold flex items-center">
                          {getRoleIcon(review.authorRole)}
                          {review.authorName} ({review.authorRole})
                      </p>
                      <p className="flex items-center text-muted-foreground">
                          <User className="mr-1.5 h-3 w-3" /> Review for: {review.recipientName}
                      </p>
                      <p className="flex items-center text-muted-foreground"><FileText className="mr-1.5 h-3 w-3" /> <Link href={`/admin/orders/details/${review.orderId}`} className="text-primary hover:underline">Order: {review.orderId}</Link></p>
                      <p className="text-muted-foreground mt-1" title={format(review.reviewDate, 'PPpp')}>
                          {formatDistanceToNow(review.reviewDate, { addSuffix: true })}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("h-5 w-5", i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(review.status)}>{review.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleUpdateStatus(review.id, 'Approved')} disabled={review.status === 'Approved'}>
                              <ThumbsUp className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Approve Review</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="icon" onClick={() => handleUpdateStatus(review.id, 'Hidden')} disabled={review.status === 'Hidden'}>
                              <EyeOff className="h-4 w-4" />
                              <span className="sr-only">Hide</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Hide / Unapprove</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/reviews/edit/${review.id}`}>
                                <Edit3 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit Review</p></TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
