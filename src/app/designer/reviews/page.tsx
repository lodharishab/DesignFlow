
"use client";

import { useState, useMemo, type ReactElement } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ListFilter, Search, ArrowUpDown, ChevronDown, ChevronUp, Calendar as CalendarIcon, ThumbsUp, EyeOff, Edit, PackageSearch } from 'lucide-react';
import { format, formatDistanceToNow, sub } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Mock data adapted for a designer's view
interface DesignerReview {
  id: string;
  orderId: string;
  clientName: string;
  clientAvatarUrl: string;
  clientAvatarHint: string;
  serviceName: string;
  category: string;
  rating: number; // 1-5
  reviewText?: string;
  reviewDate: Date;
}

const mockDesignerReviews: DesignerReview[] = [
  { id: 'rev001', orderId: 'ORD2945S', clientName: 'Sunita Rao', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman corporate', serviceName: 'Startup Logo & Brand Identity', category: 'Logo & Branding', rating: 5, reviewText: 'Priya was absolutely amazing! She understood the vision for SwasthyaLink perfectly and delivered a brand identity that exceeded all our expectations. The process was smooth and collaborative. Highly recommend!', reviewDate: new Date(2024, 6, 14) },
  { id: 'rev002', orderId: 'ORDXXXX1', clientName: 'Arun Kumar', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man startup founder', serviceName: 'E-commerce Website UI/UX', category: 'Web UI/UX', rating: 4, reviewText: 'The UI design was clean and modern. There were some minor delays but the end result was great and Priya was very responsive to feedback.', reviewDate: new Date(2024, 6, 12) },
  { id: 'rev004', orderId: 'ORDXXXX3', clientName: 'Vijay Patil', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man small business owner', serviceName: 'Modern Logo Design', category: 'Logo & Branding', rating: 5, reviewText: 'Fantastic work on the logo. Quick turnaround and very creative.', reviewDate: new Date(2024, 6, 10) },
   { id: 'rev005', orderId: 'ORDYYYY1', clientName: 'Rina Desai', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'woman professional', serviceName: 'Social Media Campaign Graphics', category: 'Social Media Graphics', rating: 5, reviewText: 'The festival creatives were vibrant and perfect for our target audience. We saw a great engagement boost. Will definitely work with Priya again!', reviewDate: new Date(2024, 5, 18) },
   { id: 'rev006', orderId: 'ORDZZZZ2', clientName: 'Amit Singh', clientAvatarUrl: 'https://placehold.co/100x100.png', clientAvatarHint: 'man entrepreneur', serviceName: 'Business Card Design', category: 'Print Design', rating: 4, reviewText: 'The business cards were high quality and delivered on time. The design was professional and exactly what we asked for.', reviewDate: new Date(2024, 4, 25) },
];

const uniqueCategories = Array.from(new Set(mockDesignerReviews.map(r => r.category))).sort();

type SortableReviewKeys = 'reviewDate' | 'rating' | 'clientName';
type DateFilter = 'All' | '1m' | '3m' | '1y';


export default function DesignerReviewsPage(): ReactElement {
  const [reviews, setReviews] = useState<DesignerReview[]>(mockDesignerReviews);
  
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
          <CardDescription>Here's what clients are saying about your work.</CardDescription>
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
                <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                  <SelectTrigger id="dateFilter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Time</SelectItem>
                    <SelectItem value="1m">Last Month</SelectItem>
                    <SelectItem value="3m">Last 3 Months</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
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
                <Card key={review.id} className="p-4 bg-secondary/30">
                  <div className="flex flex-col sm:flex-row gap-4">
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
                      <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("h-5 w-5", i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                            ))}
                          </div>
                      </div>
                       <p className="text-sm italic text-foreground mt-2">{review.reviewText ? `"${review.reviewText}"` : 'No written comment provided.'}</p>
                       <div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                          For: <Link href={`/designer/orders/${review.orderId}`} className="text-primary hover:underline">{review.serviceName}</Link>
                       </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
