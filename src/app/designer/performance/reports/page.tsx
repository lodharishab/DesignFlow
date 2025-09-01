
"use client";

import { useMemo, useState, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PieChart as PieChartIcon, ArrowLeft, BarChart2, Award } from "lucide-react";
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Legend, Cell, LabelList } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { format, sub } from 'date-fns';
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';


const categoryChartConfig = {
    avgRating: { label: "Avg. Rating", color: "hsl(var(--chart-1))" },
    avgRevisions: { label: "Avg. Revisions", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const starDistributionChartConfig = {
  count: { label: "Count" },
  "5": { label: "5 Stars", color: "hsl(var(--chart-5))" },
  "4": { label: "4 Stars", color: "hsl(var(--chart-4))" },
  "3": { label: "3 Stars", color: "hsl(var(--chart-3))" },
  "2": { label: "2 Stars", color: "hsl(var(--chart-2))" },
  "1": { label: "1 Star", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

function AnalyticsCard() {
    const [timeframe, setTimeframe] = useState("lifetime");

    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = new Date(0); // Default to all time
        if (timeframe === "30d") startDate = sub(now, { days: 30 });
        else if (timeframe === "6m") startDate = sub(now, { months: 6 });

        return mockDesignerReviews.filter(r => r.reviewDate >= startDate);
    }, [timeframe]);
    
    const analytics = useMemo(() => {
        if (filteredData.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                starDistribution: [
                    { rating: 5, count: 0 }, { rating: 4, count: 0 },
                    { rating: 3, count: 0 }, { rating: 2, count: 0 }, { rating: 1, count: 0 },
                ],
                ratingTrend: [],
            };
        }
        
        const totalReviews = filteredData.length;
        const totalRating = filteredData.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / totalReviews;

        const starDistribution = [5, 4, 3, 2, 1].map(star => ({
            rating: star,
            count: filteredData.filter(r => r.rating === star).length,
        }));
        
        const ratingTrend = filteredData
            .map(r => ({ date: format(r.reviewDate, 'MMM d'), rating: r.rating }))
            .slice(-10) // show last 10 reviews trend
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return { averageRating, totalReviews, starDistribution, ratingTrend };

    }, [filteredData]);
    
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Reviews Analytics</CardTitle>
                <CardDescription>Your performance overview based on client feedback.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
                        <TabsTrigger value="6m">Last 6 Months</TabsTrigger>
                        <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                    </TabsList>
                    <TabsContent value={timeframe} className="mt-4">
                        {analytics.totalReviews === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No reviews in this period.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-primary">{analytics.averageRating.toFixed(2)}</p>
                                                <p className="text-sm text-muted-foreground">Average Rating</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-primary">{analytics.totalReviews}</p>
                                                <p className="text-sm text-muted-foreground">Total Reviews</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Star Distribution</h4>
                                            <ChartContainer config={starDistributionChartConfig} className="h-[200px] w-full">
                                                <BarChart data={analytics.starDistribution} layout="vertical" margin={{ left: -10 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="rating" type="category" tickLine={false} axisLine={false} tickMargin={5} width={50} tick={({y, payload}) => <text y={y} dy={4} textAnchor="end" fill="hsl(var(--muted-foreground))" className="text-xs">{payload.value}★</text>} />
                                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                                    <Bar dataKey="count" layout="vertical" radius={4}>
                                                        {analytics.starDistribution.map((entry) => (
                                                            <Cell key={`cell-${entry.rating}`} fill={starDistributionChartConfig[entry.rating]?.color} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ChartContainer>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Recent Rating Trend</h4>
                                        <ChartContainer config={{rating: {label: 'Rating', color: 'hsl(var(--chart-1))'}}} className="h-[250px] w-full">
                                            <LineChart data={analytics.ratingTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0,6)} />
                                                <YAxis domain={[1, 5]} tickCount={5} />
                                                <RechartsTooltip content={<ChartTooltipContent />} />
                                                <Line type="monotone" dataKey="rating" stroke="var(--color-rating)" strokeWidth={2} dot={{r:4}} />
                                            </LineChart>
                                        </ChartContainer>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}


export default function DesignerReportsPage(): ReactElement {

    const categoryPerformance = useMemo(() => {
        const categoryPerformanceMap: Record<string, { totalRating: number, totalRevisions: number, count: number }> = {};
        mockDesignerReviews.forEach(review => {
            if (!categoryPerformanceMap[review.category]) {
                categoryPerformanceMap[review.category] = { totalRating: 0, totalRevisions: 0, count: 0 };
            }
            categoryPerformanceMap[review.category].totalRating += review.rating;
            categoryPerformanceMap[review.category].totalRevisions += review.revisions;
            categoryPerformanceMap[review.category].count += 1;
        });

        return Object.entries(categoryPerformanceMap).map(([category, data]) => ({
            category,
            avgRating: parseFloat((data.totalRating / data.count).toFixed(2)),
            avgRevisions: parseFloat((data.totalRevisions / data.count).toFixed(2)),
        }));
    }, []);

  return (
    <div className="space-y-8">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Award className="mr-2 h-5 w-5"/>Your Quality Score</CardTitle>
                <CardDescription>
                    This score is a summary of your client ratings, on-time delivery, and dispute history.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <Progress value={85} className="h-3 flex-grow" />
                    <span className="text-xl font-bold text-primary">85%</span>
                </div>
                <p className="text-sm text-center font-medium text-green-600 dark:text-green-500 mt-2">
                    You are 85% ready for Top Tier status
                </p>
            </CardContent>
        </Card>
        <AnalyticsCard />
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>Performance by Category</CardTitle>
                <CardDescription>
                    Comparison of your average rating and average revision rounds across different service categories.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {categoryPerformance.length > 0 ? (
                    <ChartContainer config={categoryChartConfig} className="h-[400px] w-full">
                        <BarChart data={categoryPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" domain={[0, 5]} tickCount={6} />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" domain={[0, 'dataMax + 1']} tickCount={4} />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="avgRating" fill="var(--color-avgRating)" name="Avg. Rating" radius={4} />
                            <Bar yAxisId="right" dataKey="avgRevisions" fill="var(--color-avgRevisions)" name="Avg. Revisions" radius={4} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        No review data available to generate category performance reports.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

