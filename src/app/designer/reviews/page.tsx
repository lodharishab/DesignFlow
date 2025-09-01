
"use client";

import { useState, useMemo, type ReactElement } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ListFilter, Search, ArrowUpDown, ChevronDown, ChevronUp, Calendar as CalendarIcon, PackageSearch, Bookmark, ShieldAlert, Languages, Sparkles, X as XIcon, MessageSquare, MoreVertical, ThumbsUp } from 'lucide-react';
import { format, formatDistanceToNow, sub } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data'; // Import from new location


const uniqueCategories = Array.from(new Set(mockDesignerReviews.map(r => r.category))).sort();

type SortableReviewKeys = 'reviewDate' | 'rating' | 'clientName';
type DateFilter = 'All' | '1m' | '3m' | '1y';


export default function DesignerReviewsPage(): ReactElement {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<DesignerReview[]>(mockDesignerReviews);
  const [selectedReview, setSelectedReview] = useState<DesignerReview | null>(null);
  
  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState<'All' | number>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortableReviewKeys; direction: 'ascending' | 'descending' }>({
    key: 'reviewDate',
    direction: 'descending',
  });

  const requestSort = (key: SortableReviewKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortableReviewKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-1 h-4 w-4" /> :
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const handleToggleFeatured = (reviewId: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, isFeatured: !review.isFeatured } : review
      )
    );
    const review = reviews.find(r => r.id === reviewId);
    if(review){
        toast({
            title: `Review ${!review.isFeatured ? 'Featured' : 'Unfeatured'}`,
            description: `This review will ${!review.isFeatured ? 'now appear on your public profile' : 'no longer appear on your public profile'}.`
        });
    }
  };

  const filteredReviews = useMemo(() => {
    let filtered = reviews
      .filter(review => {
        if (categoryFilter !== 'All' && review.category !== categoryFilter) return false;
        if (ratingFilter !== 'All' && review.rating !== ratingFilter) return false;
        if (searchTerm && 
            !review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !review.orderId.toLowerCase().includes(searchTerm.toLowerCase())
           ) {
          return false;
        }
        if (dateFilter !== 'All') {
            const now = new Date();
            let startDate: Date;
            if (dateFilter === '1m') startDate = sub(now, { months: 1 });
            else if (dateFilter === '3m') startDate = sub(now, { months: 3 });
            else if (dateFilter === '1y') startDate = sub(now, { years: 1 });
            else startDate = new Date(0);
            
            return review.reviewDate >= startDate;
        }
        return true;
      });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valB - valA; // Higher rating first for rating sort
        } else if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else {
          comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return filtered;
  }, [reviews, categoryFilter, ratingFilter, searchTerm, dateFilter, sortConfig]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Star className="mr-3 h-8 w-8 text-primary" />
          My Reviews
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Client Feedback</CardTitle>
          <CardDescription>Here's what clients are saying about your work. You can feature your favorite reviews on your public profile.</CardDescription>
           <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
                <Label htmlFor="search" className="text-xs">Search Client/Service</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="e.g., Sunita or Logo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9"/>
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="categoryFilter" className="text-xs">Filter by Service</Label>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                  <SelectTrigger id="categoryFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {uniqueCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="ratingFilter" className="text-xs">Filter by Rating</Label>
                <Select value={String(ratingFilter)} onValueChange={(value) => setRatingFilter(value === 'All' ? 'All' : Number(value))}>
                  <SelectTrigger id="ratingFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Ratings</SelectItem>
                    {[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} Star{r > 1 ? 's' : ''}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="dateFilter" className="text-xs">Filter by Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button id="dateFilter" variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter !== 'All' ? `Last ${dateFilter === '1m' ? 'month' : dateFilter === '3m' ? '3 months' : 'year'}` : 'All Time'}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <div className="flex flex-col p-1">
                           <Button variant="ghost" className="justify-start" onClick={() => setDateFilter('All')}>All Time</Button>
                           <Button variant="ghost" className="justify-start" onClick={() => setDateFilter('1m')}>Last Month</Button>
                           <Button variant="ghost" className="justify-start" onClick={() => setDateFilter('3m')}>Last 3 Months</Button>
                           <Button variant="ghost" className="justify-start" onClick={() => setDateFilter('1y')}>Last Year</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
               <div className="text-center py-16">
                    <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
                    <h2 className="mt-6 text-2xl font-semibold">No Reviews Found</h2>
                    <p className="mt-2 text-muted-foreground">
                        There are no reviews matching your current filters.
                    </p>
                    <Button variant="link" onClick={() => {setSearchTerm(''); setCategoryFilter('All'); setRatingFilter('All')}}>Clear Filters</Button>
                </div>
            ) : (
              filteredReviews.map(review => (
                <Card 
                    key={review.id} 
                    className={cn(
                      "transition-all hover:shadow-md group", 
                      review.isFeatured && "border-yellow-400/50 bg-yellow-500/5"
                    )}
                >
                  <div className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex items-start gap-3 sm:w-1/3 md:w-1/4">
                       <Avatar className="h-10 w-10">
                          <AvatarImage src={review.clientAvatarUrl} alt={review.clientName} data-ai-hint={review.clientAvatarHint} />
                          <AvatarFallback>{review.clientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.clientName}</p>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(review.reviewDate, { addSuffix: true })}</p>
                        </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                         <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("h-5 w-5", i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                            ))}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedReview(review)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleFeatured(review.id)}>
                                    <Star className="mr-2 h-4 w-4"/>
                                    {review.isFeatured ? 'Unfeature Review' : 'Feature on Profile'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                       <p className="text-sm italic text-foreground mt-2 line-clamp-2">{review.reviewText ? `"${review.reviewText}"` : 'No written comment provided.'}</p>
                       <div className="text-xs text-muted-foreground mt-3 pt-2 border-t flex items-center justify-between">
                          <p>For: <Link href={`/designer/orders/${review.orderId}`} className="text-primary hover:underline">{review.serviceName}</Link></p>
                          {review.isFeatured && <Badge variant="secondary" className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400"><Star className="mr-1 h-3 w-3"/>Featured</Badge>}
                       </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
       <Sheet open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
          {selectedReview && (
            <>
              <SheetHeader className="p-6">
                <SheetTitle className="font-headline text-2xl">Review Details</SheetTitle>
                <SheetDescription>
                  Full review from {selectedReview.clientName} for order {selectedReview.orderId}.
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6 space-y-6 overflow-y-auto flex-grow">
                <div className="flex items-center space-x-4">
                   <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedReview.clientAvatarUrl} alt={selectedReview.clientName} data-ai-hint={selectedReview.clientAvatarHint} />
                      <AvatarFallback>{selectedReview.clientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">{selectedReview.clientName}</p>
                       <p className="text-sm text-muted-foreground">{format(selectedReview.reviewDate, 'MMMM d, yyyy')}</p>
                    </div>
                </div>
                 <Separator />
                 <div>
                    <Label className="text-xs uppercase text-muted-foreground">Rating</Label>
                     <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("h-6 w-6", i < selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                        ))}
                    </div>
                 </div>
                 <div>
                    <Label className="text-xs uppercase text-muted-foreground">Service</Label>
                    <p className="font-medium text-foreground">{selectedReview.serviceName}</p>
                    <Link href={`/designer/orders/${selectedReview.orderId}`} className="text-sm text-primary hover:underline">View Order Details</Link>
                 </div>
                 <div>
                    <Label className="text-xs uppercase text-muted-foreground">Full Comment</Label>
                    <p className="text-foreground leading-relaxed mt-1 italic">
                        {selectedReview.reviewText ? `"${selectedReview.reviewText}"` : "No written comment was provided."}
                    </p>
                 </div>
              </div>
              <SheetFooter className="p-6 border-t bg-background flex-row justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(selectedReview.id)}>
                            <Star className="mr-2 h-4 w-4"/>
                            {selectedReview.isFeatured ? 'Unfeature Review' : 'Feature Review'}
                        </DropdownMenuItem>
                        <DropdownMenuItem><ShieldAlert className="mr-2 h-4 w-4"/>Report Review</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled><Languages className="mr-2 h-4 w-4"/>Translate (Soon)</DropdownMenuItem>
                        <DropdownMenuItem disabled><Sparkles className="mr-2 h-4 w-4"/>Summarize (Soon)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => setSelectedReview(null)}>
                    <XIcon className="mr-2 h-4 w-4" /> Close
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
