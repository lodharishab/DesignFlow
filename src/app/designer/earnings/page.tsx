
"use client";

import { useState, type ReactElement, useMemo, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    Users as UsersIcon
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Tooltip as RechartsTooltip, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";


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
    { id: 'txn_e_ps01', orderId: 'ORD2945S', date: new Date(), type: 'Earning', status: 'Completed', amount: 19999, description: 'Startup Logo & Brand Identity' },
    { id: 'txn_f_ps01', orderId: 'ORD2945S', date: new Date(), type: 'Fee', status: 'Completed', amount: -1999.90, description: 'Platform Fee (10%)' },
    { id: 'txn_p_ps01', orderId: 'ORD2945S', date: new Date(), type: 'Payout', status: 'Completed', amount: -17999.10, description: 'Payout to bank account' },
    { id: 'txn_e_vs01', orderId: 'ORD6531A', date: new Date(), type: 'Earning', status: 'On Hold', amount: 6999, description: 'Restaurant Menu Design' },
    { id: 'txn_a_vs01', orderId: 'ORD6531A', date: new Date(), type: 'Advance', status: 'Processing', amount: -2000, description: 'Advance for software' },
    { id: 'txn_e_rk01', orderId: 'ORD7361P', date: new Date(), type: 'Earning', status: 'On Hold', amount: 24999, description: 'E-commerce Website UI/UX' },
    { id: 'txn_refund_rk01', orderId: 'ORDREF01', date: new Date(), type: 'Refund', status: 'Completed', amount: -1000, description: 'Partial Refund for ORDABC' },
    // Adding more historical data for charts
    { id: 'txn_e_old1', orderId: 'ORDOLD01', date: subMonths(new Date(), 1), type: 'Earning', status: 'Completed', amount: 15000, description: 'Old Project Earning'},
    { id: 'txn_e_old2', orderId: 'ORDOLD02', date: subMonths(new Date(), 2), type: 'Earning', status: 'Completed', amount: 22000, description: 'Another Old Project'},
    { id: 'txn_e_old3', orderId: 'ORDOLD03', date: subMonths(new Date(), 2), type: 'Earning', status: 'Completed', amount: 8000, description: 'Small Old Project'},
    { id: 'txn_e_old4', orderId: 'ORDOLD04', date: subMonths(new Date(), 3), type: 'Earning', status: 'Completed', amount: 35000, description: 'Large Old Project'},
    { id: 'txn_e_old5', orderId: 'ORDOLD05', date: subMonths(new Date(), 4), type: 'Earning', status: 'Completed', amount: 12000, description: 'Archived Project Earning'},
    { id: 'txn_e_old6', orderId: 'ORDOLD06', date: subMonths(new Date(), 5), type: 'Earning', status: 'Completed', amount: 18000, description: 'Very Old Project'},
];

const allTransactionStatuses: TransactionStatus[] = ['Completed', 'Pending', 'On Hold', 'Processing', 'Cancelled'];

const MOCK_DESIGNER_ID = 'des002'; // For filtering orders

type AdvanceRequestStatus = 'Pending' | 'Approved' | 'Rejected';
interface AdvanceRequest {
  id: string;
  orderId: string;
  orderName: string;
  amount: number;
  reason: string;
  status: AdvanceRequestStatus;
  requestDate: Date;
  repaidAmount: number;
}

const mockAdvanceRequests: AdvanceRequest[] = [
  { id: 'ADV001', orderId: 'ORD7361P', orderName: 'E-commerce Website UI/UX', amount: 5000, reason: 'Software subscription renewal (Adobe CC)', status: 'Approved', requestDate: new Date(2024, 6, 19), repaidAmount: 2500 },
  { id: 'ADV002', orderId: 'ORD1038K', orderName: 'Social Media Campaign Graphics', amount: 1000, reason: 'Stock photo subscription', status: 'Pending', requestDate: new Date(2024, 7, 1), repaidAmount: 0 },
  { id: 'ADV003', orderId: 'ORD6531A', orderName: 'Restaurant Menu Design', amount: 3000, reason: 'Marketing materials for personal brand', status: 'Rejected', requestDate: new Date(2024, 6, 12), repaidAmount: 0 },
];


export default function DesignerEarningsPage(): ReactElement {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>(mockAdvanceRequests);
  const [isSubmittingAdvance, setIsSubmittingAdvance] = useState(false);
  const [advanceForm, setAdvanceForm] = useState({ orderId: '', amount: '', reason: '', attachment: null as File | null });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TransactionStatus>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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

  const getAdvanceStatusBadgeVariant = (status: AdvanceRequestStatus) => {
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
    const sixMonthsAgo = subMonths(new Date(), 5);

    transactions
      .filter(t => t.type === 'Earning' && t.status === 'Completed' && t.date >= sixMonthsAgo)
      .forEach(t => {
        const month = format(t.date, 'MMM yyyy');
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += t.amount;
      });

    return Object.entries(monthlyData)
      .map(([month, earnings]) => ({ month, earnings }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [transactions]);
  
  const lineChartConfig: ChartConfig = {
    earnings: {
      label: "Earnings (₹)",
      color: "hsl(var(--chart-1))",
    },
  };
  
  const pieChartData = useMemo(() => {
    const categoryData: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'Earning' && t.status === 'Completed')
      .forEach(t => {
        const order = initialOrdersData.find(o => o.id === t.orderId);
        if (order) {
          const category = order.serviceName; // Using service name for simplicity
          if (!categoryData[category]) {
            categoryData[category] = 0;
          }
          categoryData[category] += t.amount;
        }
      });
    return Object.entries(categoryData).map(([name, value], index) => ({
        name,
        value,
        fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));
  }, [transactions]);
  
  const pieChartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    pieChartData.forEach((entry) => {
        config[entry.name] = {
            label: entry.name,
            color: entry.fill
        };
    });
    return config;
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
    revenue: {
      label: "Revenue (₹)",
      color: "hsl(var(--chart-2))",
    },
  };

  const activeOrdersForAdvance = useMemo(() => {
    return initialOrdersData.filter(order => order.designerId === MOCK_DESIGNER_ID && order.status === 'In Progress');
  }, []);

  const handleAdvanceFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAdvanceForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAdvanceOrderSelect = (value: string) => {
    setAdvanceForm(prev => ({...prev, orderId: value}));
  };

  const handleAdvanceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAdvanceForm(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmitAdvanceRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!advanceForm.orderId || !advanceForm.amount || !advanceForm.reason) {
      toast({ title: "Error", description: "Please select an order and fill in the amount and reason.", variant: "destructive" });
      return;
    }
    setIsSubmittingAdvance(true);
    // Simulate API call
    console.log("Submitting advance request:", advanceForm);
    setTimeout(() => {
      const orderName = activeOrdersForAdvance.find(o => o.id === advanceForm.orderId)?.serviceName || 'Unknown Order';
      const newRequest: AdvanceRequest = {
        id: `ADV${Date.now().toString().slice(-4)}`,
        orderId: advanceForm.orderId,
        orderName,
        amount: parseFloat(advanceForm.amount),
        reason: advanceForm.reason,
        status: 'Pending',
        requestDate: new Date(),
        repaidAmount: 0,
      };
      setAdvanceRequests(prev => [newRequest, ...prev]);
      toast({ title: "Advance Request Submitted", description: "Your request has been sent for admin review." });
      // Reset form
      setAdvanceForm({ orderId: '', amount: '', reason: '', attachment: null });
      setIsSubmittingAdvance(false);
    }, 1500);
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
          <CardTitle className="flex items-center"><HandCoins className="mr-2 h-5 w-5"/>Advances</CardTitle>
          <CardDescription>Request an advance on an active project or track your existing requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tracker">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracker">Advance Tracker</TabsTrigger>
              <TabsTrigger value="request">Request Advance</TabsTrigger>
            </TabsList>
            <TabsContent value="tracker" className="mt-4">
              <div className="space-y-4">
                {advanceRequests.map(req => (
                  <Card key={req.id} className="bg-secondary/30">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">₹{req.amount.toLocaleString('en-IN')}</p>
                          <Badge variant={getAdvanceStatusBadgeVariant(req.status)}>{req.status}</Badge>
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
              <form onSubmit={handleSubmitAdvanceRequest} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Select Order*</Label>
                    <Select value={advanceForm.orderId} onValueChange={handleAdvanceOrderSelect} required>
                      <SelectTrigger id="orderId"><SelectValue placeholder="Choose an active order..." /></SelectTrigger>
                      <SelectContent>
                        {activeOrdersForAdvance.length > 0 ? activeOrdersForAdvance.map(order => (
                          <SelectItem key={order.id} value={order.id}>{order.serviceName} ({order.id})</SelectItem>
                        )) : (
                          <SelectItem value="none" disabled>No active orders eligible for advance.</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Requested (INR)*</Label>
                    <Input id="amount" type="number" placeholder="e.g., 5000" value={advanceForm.amount} onChange={handleAdvanceFormChange} required/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request*</Label>
                  <Textarea id="reason" placeholder="e.g., Need to purchase a software subscription for this project." value={advanceForm.reason} onChange={handleAdvanceFormChange} required/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <Input id="attachment" type="file" onChange={handleAdvanceFileChange} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingAdvance || activeOrdersForAdvance.length === 0}>
                    {isSubmittingAdvance && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isSubmittingAdvance ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-5 w-5" />Earnings Insights</CardTitle>
          <CardDescription>Visualize your earnings from different perspectives.</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-inner bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center"><LineChartIcon className="mr-2 h-5 w-5" />Earnings Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
                        <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Line dataKey="earnings" type="monotone" stroke="var(--color-earnings)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="shadow-inner bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center"><PieChartIcon className="mr-2 h-5 w-5" />Earnings by Service Category</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
                        <PieChart>
                            <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} strokeWidth={2}>
                                {pieChartData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2 shadow-inner bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center"><UsersIcon className="mr-2 h-5 w-5" />Top 5 Clients by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                        <BarChart data={barChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
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
                    <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export Report (Soon)</Button>
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
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayedTransactions.map((txn) => (
                    <DialogTrigger asChild key={txn.id}>
                        <TableRow onClick={() => setSelectedTransaction(txn)} className="cursor-pointer">
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
                        </TableRow>
                    </DialogTrigger>
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
    </div>
  );
}
