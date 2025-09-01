
"use client";

import { useMemo, useState, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CheckCheck, GitCommitHorizontal, ShieldAlert, Cloud, MessageSquare, Reply, UserCircle, Link as LinkIconLucide, MoreHorizontal, FileText, Languages, Award, ThumbsUp, PackageSearch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow, subDays } from 'date-fns';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';


// --- KPI Data & Component ---
const kpiData = [
    { title: 'On-Time Delivery', value: 95, unit: '%', icon: Clock, description: 'Based on meeting original deadlines' },
    { title: 'Completion Rate', value: 98, unit: '%', icon: CheckCheck, description: 'Percentage of started orders completed' },
    { title: 'Avg. Revisions', value: 1.2, icon: GitCommitHorizontal, description: 'Average revision rounds per order' },
    { title: 'Dispute Rate', value: 1, unit: '%', icon: ShieldAlert, description: 'Percentage of orders with disputes' },
    { title: 'Median Response Time', value: 1.5, unit: ' hours', icon: MessageSquare, description: 'To initial client messages' },
];

function KpiCard({ title, value, unit, icon: Icon, description }: { title: string, value: number, unit?: string, icon: React.ElementType, description: string }) {
    const isPercentage = unit === '%';
    const isTime = title.includes('Time');
    
    let isGood = false, isWarning = false, isBad = false;
    let specialBadge = null;

    if (isTime) {
        if (value <= 2) {
            isGood = true;
            specialBadge = "Fast Responder";
        } else if (value <= 8) {
            isWarning = true;
        } else {
            isBad = true;
        }
    } else if (title.includes('Rate')) { 
        if(title === 'Dispute Rate') {
             isGood = value <= 1;
             isWarning = value > 1 && value <= 3;
             isBad = value > 3;
        } else { // On-time, Completion
             isGood = value >= 95;
             isWarning = value >= 80 && value < 95;
             isBad = value < 80;
        }
    } else { // Avg Revisions
        isGood = value <= 1.5;
        isWarning = value > 1.5 && value <= 2.5;
        isBad = value > 2.5;
    }
    
    const valueColor = cn(
        isGood && 'text-green-600 dark:text-green-500',
        isWarning && 'text-yellow-600 dark:text-yellow-500',
        isBad && 'text-red-600 dark:text-red-500',
    );
    const iconColor = cn(
        isGood && 'text-green-500',
        isWarning && 'text-yellow-500',
        isBad && 'text-red-500',
    );
    
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{title}</span>
                    <Icon className={cn("h-4 w-4 text-muted-foreground", iconColor)} />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-3xl font-bold flex items-baseline gap-2", valueColor)}>
                   <span>{value}{unit}</span>
                   {specialBadge && <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700">{specialBadge}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
// --- END KPI Data & Component ---

// --- Tag Cloud Data & Component ---
const positiveKeywords = ['amazing', 'great', 'professional', 'excellent', 'fantastic', 'fast', 'quick', 'easy', 'love', 'happy', 'pleasure', 'perfect'];
const negativeKeywords = ['delay', 'issue', 'problem', 'slow', 'difficult', 'bad', 'poor', 'unprofessional', 'revisions'];

function ReviewTagCloud() {
    const keywordData = useMemo(() => {
        const counts: Record<string, { count: number, sentiment: 'positive' | 'negative' | 'neutral' }> = {};

        mockDesignerReviews.forEach(review => {
            const text = (review.reviewText || '').toLowerCase();
            const words = text.replace(/[.,!]/g, '').split(/\s+/);
            words.forEach(word => {
                if (positiveKeywords.includes(word)) {
                    if (!counts[word]) counts[word] = { count: 0, sentiment: 'positive' };
                    counts[word].count++;
                } else if (negativeKeywords.includes(word)) {
                    if (!counts[word]) counts[word] = { count: 0, sentiment: 'negative' };
                    counts[word].count++;
                } else {
                    // Simple logic for neutral common words, can be expanded
                    if (['design', 'logo', 'brand', 'work', 'project', 'client', 'communication'].includes(word)) {
                         if (!counts[word]) counts[word] = { count: 0, sentiment: 'neutral' };
                         counts[word].count++;
                    }
                }
            });
        });

        const sortedKeywords = Object.entries(counts)
            .map(([text, data]) => ({ text, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15); // Take top 15 most frequent
        
        // Normalize font sizes
        const maxCount = Math.max(...sortedKeywords.map(k => k.count), 1);
        const minCount = Math.min(...sortedKeywords.map(k => k.count), 1);

        return sortedKeywords.map(keyword => ({
            ...keyword,
            fontSize: 12 + ( (keyword.count - minCount) / (maxCount - minCount + 1) ) * 16, // scale from 12px to 28px
        }));

    }, []);
    
    const getSentimentClass = (sentiment: 'positive' | 'negative' | 'neutral') => {
        switch (sentiment) {
            case 'positive': return 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20';
            case 'negative': return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20';
            default: return 'border-border bg-secondary text-secondary-foreground hover:bg-secondary/80';
        }
    };

    if(keywordData.length === 0) return null;
    
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Cloud className="mr-2 h-5 w-5"/>Review Keyword Cloud</CardTitle>
                 <CardDescription>
                    Common keywords from your client reviews. Size indicates frequency.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        {keywordData.map(keyword => (
                             <Tooltip key={keyword.text}>
                                <TooltipTrigger asChild>
                                    <Badge
                                        className={cn("capitalize transition-all duration-300 cursor-default", getSentimentClass(keyword.sentiment))}
                                        style={{ fontSize: `${keyword.fontSize}px`, padding: `${keyword.fontSize / 3}px ${keyword.fontSize / 1.5}px` }}
                                    >
                                        {keyword.text}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Mentioned {keyword.count} time{keyword.count > 1 ? 's' : ''}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}

// --- END Tag Cloud ---

type RatingFilter = 'all' | '5' | '3-4' | '1-2';
type StatusFilter = 'all' | 'featured' | 'needsAction';
type DateFilter = 'all' | '30d';

export default function DesignerReviewsPage(): ReactElement {
  const [reviews, setReviews] = useState<DesignerReview[]>(mockDesignerReviews);
  const { toast } = useToast();

  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredReviews = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return reviews.filter(review => {
      const ratingMatch = ratingFilter === 'all' || 
                           (ratingFilter === '5' && review.rating === 5) ||
                           (ratingFilter === '3-4' && review.rating >= 3 && review.rating <= 4) ||
                           (ratingFilter === '1-2' && review.rating <= 2);
      
      const statusMatch = statusFilter === 'all' ||
                          (statusFilter === 'featured' && review.isFeatured) ||
                          (statusFilter === 'needsAction' && !review.isFeatured);
                          
      const dateMatch = dateFilter === 'all' || (dateFilter === '30d' && review.reviewDate >= thirtyDaysAgo);

      return ratingMatch && statusMatch && dateMatch;
    });
  }, [reviews, ratingFilter, statusFilter, dateFilter]);
  
  const clearFilters = () => {
    setRatingFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const handleFeatureToggle = (reviewId: string, checked: boolean) => {
    setReviews(prevReviews => 
        prevReviews.map(r => r.id === reviewId ? { ...r, isFeatured: checked } : r)
    );
    toast({
        title: `Review ${checked ? 'Featured' : 'Unfeatured'}`,
        description: `This review will ${checked ? 'now appear' : 'no longer appear'} on your public portfolio.`,
    });
  };

  const FilterChip = ({
    label, value, filterState, setFilterState, children
  }: { label: string; value: string; filterState: string; setFilterState: React.Dispatch<React.SetStateAction<any>>; children?: React.ReactNode }) => (
    <Button 
      variant={filterState === value ? "default" : "outline"} 
      size="sm"
      className="h-8"
      onClick={() => setFilterState(prev => (prev === value ? 'all' : value))}
    >
      {children}
      {label}
    </Button>
  );

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
        </div>

        <ReviewTagCloud />

        <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Client Feedback</CardTitle>
          <CardDescription>A list of all reviews you have received from clients. You can feature them on your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 border rounded-lg bg-muted/50 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium mr-2">Filter by:</p>
                <FilterChip label="⭐ 5" value="5" filterState={ratingFilter} setFilterState={setRatingFilter}/>
                <FilterChip label="⭐ 3-4" value="3-4" filterState={ratingFilter} setFilterState={setRatingFilter}/>
                <FilterChip label="⭐ 1-2" value="1-2" filterState={ratingFilter} setFilterState={setRatingFilter}/>
              </div>
               <Separator />
               <div className="flex flex-wrap items-center gap-2">
                <FilterChip label="Last 30 Days" value="30d" filterState={dateFilter} setFilterState={setDateFilter}/>
                <FilterChip label="Needs Action" value="needsAction" filterState={statusFilter} setFilterState={setStatusFilter}/>
                <FilterChip label="Featured" value="featured" filterState={statusFilter} setFilterState={setStatusFilter}/>
              </div>
          </div>
          <div className="space-y-6">
            {filteredReviews.length > 0 ? filteredReviews.map(review => (
              <div key={review.id} className="p-4 border rounded-lg bg-secondary/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.clientAvatarUrl} alt={review.clientName} data-ai-hint={review.clientAvatarHint}/>
                      <AvatarFallback>{review.clientName.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.clientName}</p>
                      <Link href={`/designer/orders/${review.orderId}`} className="text-xs text-primary hover:underline">
                        For: {review.serviceName}
                      </Link>
                    </div>
                  </div>
                   <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4", i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30')} />
                      ))}
                    </div>
                </div>
                {review.reviewText && (
                  <blockquote className="mt-3 text-sm italic text-foreground border-l-2 pl-3 ml-3">
                    "{review.reviewText}"
                  </blockquote>
                )}
                 <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(review.reviewDate, { addSuffix: true })}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                           <Checkbox 
                                id={`feature-${review.id}`}
                                checked={review.isFeatured}
                                onCheckedChange={(checked) => handleFeatureToggle(review.id, !!checked)}
                           />
                           <Label htmlFor={`feature-${review.id}`} className="text-sm font-medium cursor-pointer">
                            Add to Portfolio
                           </Label>
                        </div>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="ml-2">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage Review</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem asChild>
                               <Link href={`#`} className="flex items-center">
                                <Award className="mr-2 h-4 w-4" /> Feature on Profile
                               </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                               <Link href={`#`} className="flex items-center">
                                 <FileText className="mr-2 h-4 w-4" /> AI Summarize
                               </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                               <Link href={`#`} className="flex items-center">
                                <Languages className="mr-2 h-4 w-4" /> Translate
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <Link href={`#`} className="flex items-center">
                                 <Reply className="mr-2 h-4 w-4" /> Public Reply
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled={review.isReported} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <ShieldAlert className="mr-2 h-4 w-4" /> {review.isReported ? 'Reported' : 'Report Issue'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                 </div>
              </div>
            )) : (
              <Card className="text-center py-16 shadow-lg border-dashed">
                <CardContent className="space-y-4">
                    {reviews.length === 0 ? (
                        <>
                           <ThumbsUp className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
                            <h2 className="text-2xl font-semibold font-headline">No Reviews Yet</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                            Enable auto review requests to get started.
                            </p>
                            <Button asChild className="mt-4">
                            <Link href="/designer/profile">Go to Settings</Link>
                            </Button>
                        </>
                    ) : (
                         <>
                            <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
                            <h2 className="text-2xl font-semibold font-headline">No Reviews Found</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                No reviews match your current filters. Try adjusting or clearing them.
                            </p>
                            <Button variant="link" onClick={clearFilters}>Clear All Filters</Button>
                        </>
                    )}
                </CardContent>
            </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
