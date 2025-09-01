
"use client";

import { useMemo, useState, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CheckCheck, GitCommitHorizontal, ShieldAlert, Cloud, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data';

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


export default function DesignerReviewsPage(): ReactElement {
  return (
    <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
        </div>

        <ReviewTagCloud />

        <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Client Feedback</CardTitle>
          <CardDescription>This is a placeholder page. The full reviews list will be implemented here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">Full reviews list coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
