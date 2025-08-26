
"use client";

import { useMemo, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PieChart as PieChartIcon, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Legend, Cell } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { format } from 'date-fns';

type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'On Hold';
type TransactionType = 'Sale' | 'Payout' | 'Refund' | 'Fee';

interface Transaction {
  id: string;
  orderId: string;
  date: Date;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  paymentMethod?: 'Razorpay' | 'PhonePe' | 'Bank Transfer';
  clientName: string;
  designerName?: string;
}

const mockTransactions: Transaction[] = [
  { id: 'txn_Olcftg87sHjkl', orderId: 'ORD7361P', date: new Date(2024, 6, 1), type: 'Sale', status: 'On Hold', amount: 24999, paymentMethod: 'Razorpay', clientName: 'Priya Sharma', designerName: 'Rohan Kapoor' },
  { id: 'txn_HghtrDEWAq789', orderId: 'ORD1038K', date: new Date(2024, 6, 5), type: 'Sale', status: 'On Hold', amount: 7999, paymentMethod: 'PhonePe', clientName: 'Rajesh Kumar', designerName: 'Priya Sharma' },
  { id: 'txn_Nnbvcxz87Uyt', orderId: 'ORD2945S', date: new Date(2024, 5, 20), type: 'Sale', status: 'Completed', amount: 19999, paymentMethod: 'Razorpay', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_payout_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 14), type: 'Payout', status: 'Completed', amount: -17999.10, paymentMethod: 'Bank Transfer', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_fee_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 14), type: 'Fee', status: 'Completed', amount: -1999.90, clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_Kkjhgf56Qwe', orderId: 'ORD8872V', date: new Date(2024, 6, 8), type: 'Sale', status: 'Failed', amount: 2499, paymentMethod: 'Razorpay', clientName: 'Vikram Mehta' },
  { id: 'txn_Qoiuyt09Mnb', orderId: 'ORD6531A', date: new Date(2024, 6, 10), type: 'Sale', status: 'Completed', amount: 6999, paymentMethod: 'PhonePe', clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_payout_vs01', orderId: 'ORD6531A', date: new Date(2024, 6, 18), type: 'Payout', status: 'Pending', amount: -6299.10, paymentMethod: 'Bank Transfer', clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_fee_vs01', orderId: 'ORD6531A', date: new Date(2024, 6, 18), type: 'Fee', status: 'Pending', amount: -699.90, clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_Xyz123abcDef', orderId: 'ORD4011M', date: new Date(2024, 5, 25), type: 'Sale', status: 'Refunded', amount: 4999, paymentMethod: 'Razorpay', clientName: 'Mohan Das', designerName: 'Sunita Reddy' },
  { id: 'txn_refund_md01', orderId: 'ORD4011M', date: new Date(2024, 6, 2), type: 'Refund', status: 'Completed', amount: -4999, clientName: 'Mohan Das' },
  { id: 'txn_BT_WEDINV_RIYA01', orderId: 'ORD9274R', date: new Date(2024, 4, 15), type: 'Sale', status: 'On Hold', amount: 9999, paymentMethod: 'Bank Transfer', clientName: 'Riya Sen', designerName: 'Arjun Mehta' },
];

export default function AdminReportsPage(): ReactElement {

    const revenueByMonthData = useMemo(() => {
        const sales = mockTransactions.filter(t => t.type === 'Sale' && t.status === 'Completed');
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
    }, []);
    const revenueChartConfig = {
      revenue: {
        label: "Revenue (₹)",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig;
    
    const fundsChartData = useMemo(() => {
      const released = mockTransactions
        .filter(t => t.type === 'Payout' && t.status === 'Completed')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const escrow = mockTransactions
        .filter(t => t.type === 'Sale' && t.status === 'On Hold')
        .reduce((sum, t) => sum + t.amount, 0);
      return [{ name: 'Funds', escrow, released }];
    }, []);
    const fundsChartConfig = {
      escrow: { label: "In Escrow", color: "hsl(var(--chart-2))" },
      released: { label: "Released", color: "hsl(var(--chart-3))" },
    } satisfies ChartConfig;

    const statusChartConfig = {
        'On Hold': { label: 'On Hold', color: 'hsl(var(--chart-2))' },
        Completed: { label: 'Completed', color: 'hsl(var(--chart-1))' },
        Failed: { label: 'Failed', color: 'hsl(var(--chart-5))' },
        Refunded: { label: 'Refunded', color: 'hsl(var(--chart-4))' },
        Pending: { label: 'Pending', color: 'hsl(var(--chart-3))' }, // Added for completeness
    } satisfies ChartConfig;
    
    const statusChartData = useMemo(() => {
        const statusCounts = mockTransactions.reduce((acc, t) => {
            if (t.type !== 'Sale') return acc;
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {} as Record<TransactionStatus, number>);
        
        // Map the data and assign a fill color from the config
        return Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value,
            fill: `var(--color-${name.toLowerCase().replace(/ /g, '-')})`,
        }));
    }, []);

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
