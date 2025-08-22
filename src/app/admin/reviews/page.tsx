
"use client";

import { useState, type ReactElement, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, EyeOff, User, Briefcase, FileText, UserCog, UserCircle, Edit3, Search, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { updateReviewStatusAction, type Review } from '@/app/admin/reviews/actions';
import { mockReviewsData } from '@/app/admin/reviews/data';
import { Input } from '@/components/ui/input';


export default function AdminReviewsPage(): ReactElement {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockReviewsData);
  
  // Filtering and sorting states
  const [statusFilter, setStatusFilter] = useState<'All' | Review['status']>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'All' | number>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [authorRoleFilter, setAuthorRoleFilter] = useState<'All' | Review['authorRole']>('All');


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

  const filteredReviews = useMemo(() => {
    let filtered = reviews
      .filter(review => {
        if (statusFilter !== 'All' && review.status !== statusFilter) return false;
        if (ratingFilter !== 'All' && review.rating !== ratingFilter) return false;
        if (authorRoleFilter !== 'All' && review.authorRole !== authorRoleFilter) return false;
        if (searchTerm && 
            !review.authorName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !review.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !review.orderId.toLowerCase().includes(searchTerm.toLowerCase())
           ) {
          return false;
        }
        return true;
      });

    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
      } else {
        return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
      }
    });

    return filtered;
  }, [reviews, statusFilter, searchTerm, ratingFilter, sortOrder, authorRoleFilter]);

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
           <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
                <Label htmlFor="search" className="text-xs">Search Name/Order ID</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="e.g., Priya or ORD..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9"/>
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="statusFilter" className="text-xs">Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'All' | Review['status'])}>
                  <SelectTrigger id="statusFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="ratingFilter" className="text-xs">Rating</Label>
                <Select value={String(ratingFilter)} onValueChange={(value) => setRatingFilter(value === 'All' ? 'All' : Number(value))}>
                  <SelectTrigger id="ratingFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Ratings</SelectItem>
                    {[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} Star{r > 1 ? 's' : ''}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="authorRoleFilter" className="text-xs">Author Type</Label>
                <Select value={authorRoleFilter} onValueChange={(value) => setAuthorRoleFilter(value as 'All' | Review['authorRole'])}>
                  <SelectTrigger id="authorRoleFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Authors</SelectItem>
                    <SelectItem value="Client">By Client</SelectItem>
                    <SelectItem value="Designer">By Designer</SelectItem>
                  </SelectContent>
                </Select>
            </div>
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
