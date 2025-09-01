
"use client";

import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, BarChart2 } from 'lucide-react';
import { useMemo } from 'react';
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data';
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, XAxis, YAxis } from "recharts";


const categoryChartConfig = {
    avgRating: { label: "Avg. Rating", color: "hsl(var(--chart-1))" },
    avgRevisions: { label: "Avg. Revisions", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


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
  );
}
