
"use client";

import { useState, type ReactElement, useMemo, ChangeEvent, FormEvent, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { 
    IndianRupee, 
    ArrowDown, 
    ArrowUp, 
    Link as LinkIcon, 
    BarChart3, 
    Hourglass, 
    History,
    FileText,
    Download,
    Calendar as CalendarIcon,
    CircleHelp,
    PiggyBank,
    Receipt,
    Wallet,
    Search,
    HandCoins,
    Upload,
    Loader2,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon,
    Users as UsersIcon,
    Eye,
    Expand,
    Minimize
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { initialOrdersData, type Order } from '@/components/admin/orders/orders-table-view';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Tooltip as RechartsTooltip, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


type TransactionStatus = 'Completed' | 'Pending' | 'On Hold' | 'Processing' | 'Cancelled';
type TransactionType = 'Earning' | 'Payout' | 'Fee' | 'Advance' | 'Refund';

interface Transaction {
  id: string;
  orderId: string;
  date: Date;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
}

const mockTransactions: Transaction[] = [
    { id: 'txn_e_ps01', orderId: 'ORD2945S', date: new Date('2024-07-20T10:00:00Z'), type: 'Earning', status: 'Completed', amount: 19999, description: 'Startup Logo & Brand Identity' },
    { id: 'txn_f_ps01', orderId: 'ORD2945S', date: new Date('2024-07-20T10:05:00Z'), type: 'Fee', status: 'Completed', amount: -1999.90, description: 'Platform Fee (10%)' },
    { id: 'txn_p_ps01', orderId: 'ORD2945S', date: new Date('2024-07-20T10:05:00Z'), type: 'Payout', status: 'Completed', amount: -17999.10, description: 'Payout to bank account' },
    { id: 'txn_e_vs01', orderId: 'ORD6531A', date: new Date('2024-07-19T11:00:00Z'), type: 'Earning', status: 'On Hold', amount: 6999, description: 'Restaurant Menu Design' },
    { id: 'txn_a_vs01', orderId: 'ORD6531A', date: new Date('2024-07-21T09:00:00Z'), type: 'Advance', status: 'Processing', amount: -2000, description: 'Advance for software' },
    { id: 'txn_e_rk01', orderId: 'ORD7361P', date: new Date('2024-07-22T14:00:00Z'), type: 'Earning', status: 'On Hold', amount: 24999, description: 'E-commerce Website UI/UX' },
    { id: 'txn_refund_rk01', orderId: 'ORDREF01', date: new Date('2024-07-18T16:00:00Z'), type: 'Refund', status: 'Completed', amount: -1000, description: 'Partial Refund for ORDABC' },
    // Adding more historical data for charts
    { id: 'txn_e_old1', orderId: 'ORDOLD01', date: subMonths(new Date('2024-07-25'), 1), type: 'Earning', status: 'Completed', amount: 15000, description: 'Old Project Earning'},
    { id: 'txn_e_old2', orderId: 'ORDOLD02', date: subMonths(new Date('2024-07-25'), 2), type: 'Earning', status: 'Completed', amount: 22000, description: 'Another Old Project'},
    { id: 'txn_e_old3', orderId: 'ORDOLD03', date: subMonths(new Date('2024-07-25'), 2), type: 'Earning', status: 'Completed', amount: 8000, description: 'Small Old Project'},
    { id: 'txn_e_old4', orderId: 'ORDOLD04', date: subMonths(new Date('2024-07-25'), 3), type: 'Earning', status: 'Completed', amount: 35000, description: 'Large Old Project'},
    { id: 'txn_e_old5', orderId: 'ORDOLD05', date: subMonths(new Date('2024-07-25'), 4), type: 'Earning', status: 'Completed', amount: 12000, description: 'Archived Project Earning'},
    { id: 'txn_e_old6', orderId: 'ORDOLD06', date: subMonths(new Date('2024-07-25'), 5), type: 'Earning', status: 'Completed', amount: 18000, description: 'Very Old Project'},
];

const allTransactionStatuses: TransactionStatus[] = ['Completed', 'Pending', 'On Hold', 'Processing', 'Cancelled'];

const MOCK_DESIGNER_ID = 'des002'; // For filtering orders

type PayoutRequestStatus = 'Pending' | 'Approved' | 'Rejected';
interface PayoutRequest {
  id: string;
  orderId: string;
  orderName: string;
  amount: number;
  reason: string;
  status: PayoutRequestStatus;
  requestDate: Date;
  repaidAmount: number;
}

const mockPayoutRequests: PayoutRequest[] = [
  { id: 'ADV001', orderId: 'ORD7361P', orderName: 'E-commerce Website UI/UX', amount: 5000, reason: 'Software subscription renewal (Adobe CC)', status: 'Approved', requestDate: new Date(2024, 6, 19), repaidAmount: 2500 },
  { id: 'ADV002', orderId: 'ORD1038K', orderName: 'Social Media Campaign Graphics', amount: 1000, reason: 'Stock photo subscription', status: 'Pending', requestDate: new Date(2024, 7, 1), repaidAmount: 0 },
  { id: 'ADV003', orderId: 'ORD6531A', orderName: 'Restaurant Menu Design', amount: 3000, reason: 'Marketing materials for personal brand', status: 'Rejected', requestDate: new Date(2024, 6, 12), repaidAmount: 0 },
];


export default function DesignerEarningsPage(): ReactElement {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(mockPayoutRequests);
  const [isSubmittingPayoutRequest, setIsSubmittingPayoutRequest] = useState(false);
  const [payoutRequestForm, setPayoutRequestForm] = useState({ orderId: '', amount: '', reason: '', attachment: null as File | null });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TransactionStatus>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // State for chart expansion
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'On Hold':
      case 'Pending':
      case 'Processing': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPayoutRequestStatusBadgeVariant = (status: PayoutRequestStatus) => {
      switch (status) {
        case 'Approved': return 'default';
        case 'Pending': return 'secondary';
        case 'Rejected': return 'destructive';
      }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
        case 'Earning': return <ArrowUp className="text-green-500"/>;
        case 'Payout': return <ArrowDown className="text-blue-500"/>;
        case 'Fee': return <ArrowDown className="text-red-500"/>;
        case 'Advance': return <ArrowDown className="text-orange-500"/>
        case 'Refund': return <ArrowDown className="text-destructive"/>;
        default: return <IndianRupee/>;
    }
  }

  const displayedTransactions = useMemo(() => {
    return transactions.filter(txn => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const searchMatch = !searchTerm || 
                            txn.id.toLowerCase().includes(lowerSearchTerm) ||
                            txn.orderId.toLowerCase().includes(lowerSearchTerm);
        const statusMatch = statusFilter === 'All' || txn.status === statusFilter;
        const dateMatch = !dateRange || (dateRange.from && dateRange.to && txn.date >= dateRange.from && txn.date <= dateRange.to) ||
                          (dateRange.from && !dateRange.to && txn.date >= dateRange.from) ||
                          (!dateRange.from && dateRange.to && txn.date <= dateRange.to);

        return searchMatch && statusMatch && dateMatch;
    }).sort((a,b) => b.date.getTime() - a.date.getTime());
  }, [transactions, searchTerm, statusFilter, dateRange]);


  const totalEarnings = useMemo(() => transactions.filter(t => t.type === 'Earning' && t.status === 'Completed').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const thisMonthEarnings = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return transactions.filter(t => t.type === 'Earning' && t.status === 'Completed' && t.date >= start && t.date <= end).reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);
  const pendingPayouts = useMemo(() => transactions.filter(t => t.type === 'Earning' && t.status === 'On Hold').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const upcomingPayouts = useMemo(() => transactions.filter(t => t.type === 'Payout' && t.status === 'Processing').reduce((acc, t) => acc + Math.abs(t.amount), 0), [transactions]);
  const refundsDeductions = useMemo(() => transactions.filter(t => t.type === 'Refund' || t.type === 'Fee').reduce((acc, t) => acc + Math.abs(t.amount), 0), [transactions]);

  const statCards = [
    { title: "Total Earnings", value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: PiggyBank, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" },
    { title: "This Month’s Earnings", value: `₹${thisMonthEarnings.toLocaleString('en-IN')}`, icon: CalendarIcon, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Pending Payouts", value: `₹${pendingPayouts.toLocaleString('en-IN')}`, icon: Hourglass, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    { title: "Upcoming Payouts", value: `₹${upcomingPayouts.toLocaleString('en-IN')}`, icon: Wallet, color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "Refunds/Deductions", value: `₹${refundsDeductions.toLocaleString('en-IN')}`, icon: Receipt, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" },
  ];
  
  // --- Chart Data Processing ---
  const lineChartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    const months = Array.from({length: 6}, (_, i) => format(subMonths(new Date(), 5 - i), 'MMM yyyy'));
    months.forEach(month => monthlyData[month] = 0); // Initialize all months

    transactions
      .filter(t => t.type === 'Earning' && t.status === 'Completed')
      .forEach(t => {
        const month = format(t.date, 'MMM yyyy');
        if (monthlyData.hasOwnProperty(month)) {
          monthlyData[month] += t.amount;
        }
      });

    return Object.entries(monthlyData)
      .map(([month, earnings]) => ({ month: month.slice(0,3), earnings }))
  }, [transactions]);
  
  const lineChartConfig: ChartConfig = {
    earnings: { label: "Earnings", color: "hsl(var(--chart-1))" },
  };
  
  const pieChartData = useMemo(() => {
    const categoryData: { [key: string]: number } = {};
    const categoryColors = [
        'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 
        'hsl(var(--chart-4))', 'hsl(var(--chart-5))'
    ];
    let colorIndex = 0;

    transactions
      .filter(t => t.type === 'Earning' && t.status === 'Completed')
      .forEach(t => {
        const order = initialOrdersData.find(o => o.id === t.orderId);
        if (order) {
          const category = order.serviceName.includes('Logo') ? 'Logo Design' :
                           order.serviceName.includes('UI/UX') ? 'UI/UX' :
                           order.serviceName.includes('Social') ? 'Social Media' :
                           order.serviceName.includes('Brochure') ? 'Branding' : 'Illustrations';
          if (!categoryData[category]) {
            categoryData[category] = 0;
          }
          categoryData[category] += t.amount;
        }
      });
    return Object.entries(categoryData).map(([name, value]) => ({
        name,
        value,
        fill: categoryColors[colorIndex++ % categoryColors.length],
    }));
  }, [transactions]);
  
  const pieChartConfig: ChartConfig = useMemo(() => {
    return pieChartData.reduce((acc, entry) => {
        acc[entry.name] = { label: entry.name, color: entry.fill };
        return acc;
    }, {} as ChartConfig);
  }, [pieChartData]);
  
   const barChartData = useMemo(() => {
    const clientData: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'Earning' && t.status === 'Completed')
      .forEach(t => {
        const order = initialOrdersData.find(o => o.id === t.orderId);
        if (order) {
          const client = order.clientName;
          if (!clientData[client]) {
            clientData[client] = 0;
          }
          clientData[client] += t.amount;
        }
      });

    return Object.entries(clientData)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [transactions]);
  
   const barChartConfig: ChartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
  };

  const activeOrdersForPayoutRequest = useMemo(() => {
    return initialOrdersData.filter(order => order.designerId === MOCK_DESIGNER_ID && order.status === 'In Progress');
  }, []);

  const handlePayoutRequestFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPayoutRequestForm(prev => ({ ...prev, [id]: value }));
  };

  const handlePayoutRequestOrderSelect = (value: string) => {
    setPayoutRequestForm(prev => ({...prev, orderId: value}));
  };

  const handlePayoutRequestFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPayoutRequestForm(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmitPayoutRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!payoutRequestForm.orderId || !payoutRequestForm.amount || !payoutRequestForm.reason) {
      toast({ title: "Error", description: "Please select an order and fill in the amount and reason.", variant: "destructive" });
      return;
    }
    setIsSubmittingPayoutRequest(true);
    console.log("Submitting payout request:", payoutRequestForm);
    setTimeout(() => {
      const orderName = activeOrdersForPayoutRequest.find(o => o.id === payoutRequestForm.orderId)?.serviceName || 'Unknown Order';
      const newRequest: PayoutRequest = {
        id: `ADV${Date.now().toString().slice(-4)}`,
        orderId: payoutRequestForm.orderId,
        orderName,
        amount: parseFloat(payoutRequestForm.amount),
        reason: payoutRequestForm.reason,
        status: 'Pending',
        requestDate: new Date(),
        repaidAmount: 0,
      };
      setPayoutRequests(prev => [newRequest, ...prev]);
      toast({ title: "Payout Request Submitted", description: "Your request has been sent for admin review." });
      setPayoutRequestForm({ orderId: '', amount: '', reason: '', attachment: null });
      setIsSubmittingPayoutRequest(false);
    }, 1500);
  };
  
  const handleExportCsv = useCallback(() => {
    const headers = ["ID", "Order ID", "Date", "Type", "Status", "Amount", "Description"];
    const rows = displayedTransactions.map(txn => [
      txn.id,
      txn.orderId,
      format(txn.date, "yyyy-MM-dd HH:mm:ss"),
      txn.type,
      txn.status,
      txn.amount.toString(),
      `"${txn.description.replace(/"/g, '""')}"`
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [displayedTransactions]);

  const handleChartClick = (chartId: string) => {
    setExpandedChart(prev => (prev === chartId ? null : chartId));
  };


  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-primary" />
          Earnings &amp; Payouts
        </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(stat => (
          <Card key={stat.title} className={`${stat.bgColor} border-none shadow-md hover:shadow-lg transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-5 w-5" />Earnings Insights</CardTitle>
            <CardDescription>Visualize your earnings from different perspectives.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Line Chart */}
                <div className={cn("relative group transition-all duration-300 ease-in-out", expandedChart === 'trend' ? 'lg:col-span-3' : 'lg:col-span-1', !expandedChart || expandedChart === 'trend' ? 'block' : 'hidden')}>
                    <Card className="shadow-inner bg-secondary/30 h-full cursor-pointer" onClick={() => handleChartClick('trend')}>
                        <CardHeader>
                            <CardTitle className="text-base font-headline">Earnings Trend (Last 6 Months)</CardTitle>
                            <CardDescription className="text-xs text-green-600">+15% vs previous period</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={lineChartConfig} className={cn("h-[250px] w-full", expandedChart === 'trend' && "h-[400px]")}>
                                <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${Number(value)/1000}k`} />
                                    <RechartsTooltip 
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            indicator="line" 
                                            formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                                        />} 
                                    />
                                    <Line dataKey="earnings" type="monotone" stroke="var(--color-earnings)" strokeWidth={2} dot={true} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white font-bold flex items-center text-lg">
                           {expandedChart === 'trend' ? <Minimize className="mr-2 h-5 w-5"/> : <Expand className="mr-2 h-5 w-5"/>}
                           {expandedChart === 'trend' ? 'Click to Collapse' : 'Click to Expand'}
                        </span>
                    </div>
                </div>

                {/* Chart 2: Pie Chart */}
                <div className={cn("relative group transition-all duration-300 ease-in-out", expandedChart === 'category' ? 'lg:col-span-3' : 'lg:col-span-1', !expandedChart || expandedChart === 'category' ? 'block' : 'hidden')}>
                    <Card className="shadow-inner bg-secondary/30 h-full cursor-pointer" onClick={() => handleChartClick('category')}>
                        <CardHeader>
                            <CardTitle className="text-base font-headline">Earnings by Service Category</CardTitle>
                            <CardDescription className="text-xs">Breakdown of revenue sources.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ChartContainer config={pieChartConfig} className={cn("h-[250px] w-full", expandedChart === 'category' && "h-[400px]")}>
                                <PieChart>
                                    <RechartsTooltip 
                                        content={<ChartTooltipContent 
                                            nameKey="name" 
                                            formatter={(value, name, item) => {
                                                const total = pieChartData.reduce((acc, curr) => acc + curr.value, 0);
                                                const percentage = total > 0 ? (Number(value) / total * 100).toFixed(0) : 0;
                                                return `₹${Number(value).toLocaleString('en-IN')} (${percentage}%)`;
                                            }}
                                        />} 
                                    />
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={expandedChart === 'category' ? 80 : 50} outerRadius={expandedChart === 'category' ? 120 : 80} paddingAngle={2} strokeWidth={2}>
                                        <LabelList dataKey="name" className="fill-background text-xs" stroke="none" formatter={(value: string) => pieChartConfig[value]?.label} />
                                    </Pie>
                                    <ChartLegend content={<ChartLegendContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white font-bold flex items-center text-lg">
                            {expandedChart === 'category' ? <Minimize className="mr-2 h-5 w-5"/> : <Expand className="mr-2 h-5 w-5"/>}
                           {expandedChart === 'category' ? 'Click to Collapse' : 'Click to Expand'}
                        </span>
                    </div>
                </div>

                {/* Chart 3: Bar Chart */}
                <div className={cn("relative group transition-all duration-300 ease-in-out", expandedChart === 'clients' ? 'lg:col-span-3' : 'lg:col-span-1', !expandedChart || expandedChart === 'clients' ? 'block' : 'hidden')}>
                    <Card className="shadow-inner bg-secondary/30 h-full cursor-pointer" onClick={() => handleChartClick('clients')}>
                        <CardHeader>
                            <CardTitle className="text-base font-headline">Top 5 Clients by Revenue</CardTitle>
                            <CardDescription className="text-xs">Your highest-value clients.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={barChartConfig} className={cn("h-[250px] w-full", expandedChart === 'clients' && "h-[400px]")}>
                                <BarChart data={barChartData} layout="vertical" margin={{ left: 0, right: 40 }}>
                                    <CartesianGrid horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={5} width={80} />
                                    <RechartsTooltip 
                                        cursor={false} 
                                        content={<ChartTooltipContent 
                                            indicator="dot" 
                                            formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                                        />} 
                                    />
                                    <Bar dataKey="revenue" radius={4}>
                                        <LabelList dataKey="revenue" position="right" offset={8} className="fill-foreground text-xs" formatter={(value: number) => `₹${(value/1000).toFixed(1)}k`} />
                                        {barChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white font-bold flex items-center text-lg">
                             {expandedChart === 'clients' ? <Minimize className="mr-2 h-5 w-5"/> : <Expand className="mr-2 h-5 w-5"/>}
                           {expandedChart === 'clients' ? 'Click to Collapse' : 'Click to Expand'}
                        </span>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>


      <Dialog onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Transaction History</CardTitle>
                        <CardDescription>A log of all your earnings, fees, and payouts.</CardDescription>
                    </div>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExportCsv}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as CSV
                        </DropdownMenuItem>
                         <DropdownMenuItem disabled>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as PDF (Soon)
                        </DropdownMenuItem>
                         <DropdownMenuItem disabled>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as Excel (Soon)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by Order/Txn ID" className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                        <SelectTrigger><SelectValue placeholder="Filter by status"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            {allTransactionStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-12">Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount (INR)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayedTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                        <TableCell className="w-12">{getTypeIcon(txn.type)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{format(txn.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                            <p className="font-medium">{txn.description}</p>
                            <Link href={`/designer/orders/${txn.orderId}`} onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center">
                                Order: {txn.orderId} <LinkIcon className="ml-1 h-3 w-3"/>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusBadgeVariant(txn.status)} className="capitalize">{txn.status}</Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                           <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(txn)}>
                                    <Eye className="mr-2 h-4 w-4" /> Details
                                </Button>
                            </DialogTrigger>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {displayedTransactions.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">No transactions match your filters.</div>
            )}
            </CardContent>
        </Card>
        
        {selectedTransaction && (
             <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline">Transaction Details</DialogTitle>
                    <DialogDescription>
                        Details for Transaction ID: {selectedTransaction.id}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className={`font-semibold ${selectedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedTransaction.amount > 0 ? '+' : ''}₹{Math.abs(selectedTransaction.amount).toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{format(selectedTransaction.date, 'PPpp')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant={selectedTransaction.type === 'Earning' ? 'default' : 'secondary'} className="capitalize">{selectedTransaction.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusBadgeVariant(selectedTransaction.status)} className="capitalize">{selectedTransaction.status}</Badge>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Description:</p>
                        <p>{selectedTransaction.description}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Related Order:</p>
                        <Link href={`/designer/orders/${selectedTransaction.orderId}`} className="text-primary hover:underline flex items-center">
                            {selectedTransaction.orderId} <LinkIcon className="ml-1 h-3 w-3"/>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        )}
      </Dialog>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><HandCoins className="mr-2 h-5 w-5"/>Payout Requests</CardTitle>
          <CardDescription>Request a payout for a completed milestone or track your existing requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tracker">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracker">Request Tracker</TabsTrigger>
              <TabsTrigger value="request">Request Payout</TabsTrigger>
            </TabsList>
            <TabsContent value="tracker" className="mt-4">
              <div className="space-y-4">
                {payoutRequests.map(req => (
                  <Card key={req.id} className="bg-secondary/30">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">₹{req.amount.toLocaleString('en-IN')}</p>
                          <Badge variant={getPayoutRequestStatusBadgeVariant(req.status)}>{req.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Order: {req.orderName} ({req.orderId})</p>
                        <p className="text-xs text-muted-foreground mt-1">Requested: {format(req.requestDate, 'PP')}</p>
                      </div>
                      <div className="w-full sm:w-1/3">
                         <Label className="text-xs">Repayment Progress</Label>
                         <Progress value={(req.repaidAmount / req.amount) * 100} className="h-2 mt-1"/>
                         <p className="text-xs text-muted-foreground text-right mt-1">₹{req.repaidAmount.toLocaleString('en-IN')} / ₹{req.amount.toLocaleString('en-IN')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="request" className="mt-4">
              <form onSubmit={handleSubmitPayoutRequest} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Select Order*</Label>
                    <Select value={payoutRequestForm.orderId} onValueChange={handlePayoutRequestOrderSelect} required>
                      <SelectTrigger id="orderId"><SelectValue placeholder="Choose an active order..." /></SelectTrigger>
                      <SelectContent>
                        {activeOrdersForPayoutRequest.length > 0 ? activeOrdersForPayoutRequest.map(order => (
                          <SelectItem key={order.id} value={order.id}>{order.serviceName} ({order.id})</SelectItem>
                        )) : (
                          <SelectItem value="none" disabled>No active orders eligible for payout requests.</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Requested (INR)*</Label>
                    <Input id="amount" type="number" placeholder="e.g., 5000" value={payoutRequestForm.amount} onChange={handlePayoutRequestFormChange} required/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request*</Label>
                  <Textarea id="reason" placeholder="e.g., Requesting payout for Phase 1 completion." value={payoutRequestForm.reason} onChange={handlePayoutRequestFormChange} required/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <Input id="attachment" type="file" onChange={handlePayoutRequestFileChange} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingPayoutRequest || activeOrdersForPayoutRequest.length === 0}>
                    {isSubmittingPayoutRequest && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isSubmittingPayoutRequest ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
