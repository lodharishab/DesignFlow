
"use client";

import { useMemo, useState, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PieChart as PieChartIcon, ArrowLeft, BarChart2, Award, FileText, Calendar as CalendarIcon, Check, FileDown, Settings } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Legend, Cell, LabelList } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { format, sub, startOfDay, endOfDay } from 'date-fns';
import { mockDesignerReviews, type DesignerReview } from '@/lib/reviews-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import type { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';


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

type ReportView = 'monthly' | 'category' | 'clients' | 'revisions' | 'turnaround';

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

function PlaceholderCard({ title }: { title: string }) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>This report is under development. Data will appear here soon.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground italic">Report coming soon...</p>
            </CardContent>
        </Card>
    )
}

interface ReportConfig {
  metrics: {
    ratings: boolean;
    revenue: boolean;
    repeatClients: boolean;
    revisions: boolean;
  };
  dateRange?: DateRange;
}

function CustomReportDialog() {
  const { toast } = useToast();
  const [reportConfig, setReportConfig] = useState<ReportConfig['metrics']>({
    ratings: true, revenue: false, repeatClients: false, revisions: true,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: sub(new Date(), { days: 29 }),
    to: new Date(),
  });
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMetricChange = (metric: keyof ReportConfig['metrics'], checked: boolean) => {
    setReportConfig(prev => ({ ...prev, [metric]: checked }));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setGeneratedReport(null);
    console.log("Generating report with config:", { ...reportConfig, dateRange });
    setTimeout(() => {
      // Mock data generation
      const mockData = [
        { name: 'Week 1', Ratings: 4.8, Revenue: 2400 },
        { name: 'Week 2', Ratings: 4.5, Revenue: 1398 },
        { name: 'Week 3', Ratings: 4.9, Revenue: 9800 },
        { name: 'Week 4', Ratings: 4.7, Revenue: 3908 },
      ];
      setGeneratedReport({
        data: mockData,
        config: {
          Ratings: { label: 'Avg. Rating', color: 'hsl(var(--chart-1))' },
          Revenue: { label: 'Revenue (₹)', color: 'hsl(var(--chart-2))' },
        }
      });
      toast({ title: "Report Generated", description: "Your custom report preview is ready." });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Generate Custom Report</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Custom Performance Report</DialogTitle>
          <DialogDescription>Select metrics and a date range to generate a personalized report.</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-semibold">Select Metrics</Label>
                    <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
                        {Object.keys(reportConfig).map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                            <Checkbox
                            id={metric}
                            checked={reportConfig[metric as keyof typeof reportConfig]}
                            onCheckedChange={(checked) => handleMetricChange(metric as keyof typeof reportConfig, !!checked)}
                            />
                            <Label htmlFor={metric} className="text-sm font-normal capitalize">
                            {metric.replace(/([A-Z])/g, ' $1')}
                            </Label>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold">Select Date Range</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                                ) : (
                                format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BarChart2 className="mr-2 h-4 w-4"/>}
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
            </div>
            <div className="border-l pl-6">
                <h3 className="font-semibold mb-2">Report Preview</h3>
                {generatedReport ? (
                    <div className="space-y-4">
                         <ChartContainer config={generatedReport.config} className="h-[200px] w-full">
                            <BarChart data={generatedReport.data}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="Ratings" fill="var(--color-Ratings)" radius={4} />
                                <Bar dataKey="Revenue" fill="var(--color-Revenue)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Period</TableHead>
                                    <TableHead className="text-right">Ratings</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {generatedReport.data.map((row: any) => (
                                    <TableRow key={row.name}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell className="text-right">{row.Ratings}</TableCell>
                                        <TableCell className="text-right">₹{row.Revenue.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/50 rounded-md">
                        <p>Your report preview will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function DesignerReportsPage(): ReactElement {
    const [reportView, setReportView] = useState<ReportView>('category');

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

    const renderReport = () => {
        switch(reportView) {
            case 'monthly':
                return <PlaceholderCard title="Monthly Performance Report" />;
            case 'category':
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
            case 'clients':
                return <PlaceholderCard title="Client Cohorts Report" />;
            case 'revisions':
                return <PlaceholderCard title="Revisions Impact Report" />;
            case 'turnaround':
                return <PlaceholderCard title="Turnaround Time Report" />;
            default:
                return null;
        }
    }

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Card className="shadow-lg flex-grow">
                <CardHeader>
                    <CardTitle className="flex items-center text-lg"><Award className="mr-2 h-5 w-5"/>Your Quality Score</CardTitle>
                    <CardDescription>
                        A summary of your client ratings, on-time delivery, and dispute history.
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
            <CustomReportDialog />
        </div>
        <AnalyticsCard />

        <Card>
            <CardHeader>
                <Label htmlFor="report-select">Select Report View</Label>
                <Select value={reportView} onValueChange={(v) => setReportView(v as ReportView)}>
                    <SelectTrigger id="report-select" className="w-full md:w-[300px]">
                        <SelectValue placeholder="Select a report..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="category">Category Breakdown</SelectItem>
                        <SelectItem value="monthly">Monthly Performance</SelectItem>
                        <SelectItem value="clients">Client Cohorts</SelectItem>
                        <SelectItem value="revisions">Revisions Impact</SelectItem>
                        <SelectItem value="turnaround">Turnaround Time</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {renderReport()}
            </CardContent>
        </Card>
    </div>
  );
}
