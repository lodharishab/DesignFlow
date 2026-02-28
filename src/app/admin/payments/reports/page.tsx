
"use client";

import { useState, useEffect, useMemo, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PieChart as PieChartIcon, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Legend, Cell } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { format } from 'date-fns';
import { getAllTransactions, type Transaction } from '@/lib/transactions-db';

export default function AdminReportsPage(): ReactElement {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
      getAllTransactions().then(setAllTransactions);
    }, []);

    const revenueByMonthData = useMemo(() => {
        const sales = allTransactions.filter(t => t.type === 'Sale' && t.status === 'Completed');
        const monthlyRevenue: { [key: string]: number } = {};

        sales.forEach(sale => {
            const month = format(sale.date, 'MMM yyyy');
            if (!monthlyRevenue[month]) {
                monthlyRevenue[month] = 0;
            }
            monthlyRevenue[month] += sale.amount;
        });
        
        return Object.entries(monthlyRevenue)
            .map(([month, revenue]) => ({ month, revenue }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()); // Sort by date
    }, [allTransactions]);
    const revenueChartConfig = {
      revenue: {
        label: "Revenue (₹)",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig;
    
    const fundsChartData = useMemo(() => {
      const released = allTransactions
        .filter(t => t.type === 'Payout' && t.status === 'Completed')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const escrow = allTransactions
        .filter(t => t.type === 'Sale' && t.status === 'On Hold')
        .reduce((sum, t) => sum + t.amount, 0);
      return [{ name: 'Funds', escrow, released }];
    }, [allTransactions]);
    const fundsChartConfig = {
      escrow: { label: "In Escrow", color: "hsl(var(--chart-2))" },
      released: { label: "Released", color: "hsl(var(--chart-3))" },
    } satisfies ChartConfig;

    const statusChartConfig = {
        'On Hold': { label: 'On Hold', color: 'hsl(var(--chart-2))' },
        'Completed': { label: 'Completed', color: 'hsl(var(--chart-1))' },
        'Failed': { label: 'Failed', color: 'hsl(var(--chart-5))' },
        'Refunded': { label: 'Refunded', color: 'hsl(var(--chart-4))' },
        'Pending': { label: 'Pending', color: 'hsl(var(--chart-3))' },
    } satisfies ChartConfig;
    
    const statusChartData = useMemo(() => {
        const statusCounts = allTransactions.reduce((acc, t) => {
            if (t.type !== 'Sale') return acc;
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value,
            fill: statusChartConfig[name as keyof typeof statusChartConfig]?.color || 'hsl(var(--muted))'
        }));
    }, [allTransactions]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <PieChartIcon className="mr-3 h-8 w-8 text-primary" />
                    Reports &amp; Analytics
                </h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/payments"><ArrowLeft className="mr-2 h-4 w-4" />Back to Payments Dashboard</Link>
                </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                    <CardDescription>Monthly revenue from completed sales.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                        <LineChart data={revenueByMonthData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>Sales Transaction Statuses</CardTitle>
                    <CardDescription>Breakdown of all sale transactions by their current status.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                    <ChartContainer config={statusChartConfig} className="h-[300px] w-full">
                        <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={statusChartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                             {statusChartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </PieChart>
                    </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2 shadow-lg">
                    <CardHeader>
                        <CardTitle>Escrow vs. Released Funds</CardTitle>
                        <CardDescription>Comparison of funds currently held in escrow versus funds paid out to designers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={fundsChartConfig} className="h-[300px] w-full">
                        <BarChart data={fundsChartData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8}/>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="escrow" fill="var(--color-escrow)" radius={4} />
                            <Bar dataKey="released" fill="var(--color-released)" radius={4} />
                        </BarChart>
                        </ChartContainer>
                    </CardContent>
                    </Card>
            </div>
        </div>
    )
}
