
"use client";

import { useState, type ReactElement, useMemo, ChangeEvent } from 'react';
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
    Search
} from "lucide-react";
import { format, startOfMonth, endOfMonth } from 'date-fns';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';


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
    { id: 'txn_e_old', orderId: 'ORDOLD01', date: new Date(new Date().setMonth(new Date().getMonth() - 2)), type: 'Earning', status: 'Completed', amount: 15000, description: 'Old Project Earning'},
];

const allTransactionStatuses: TransactionStatus[] = ['Completed', 'Pending', 'On Hold', 'Processing', 'Cancelled'];

export default function DesignerEarningsPage(): ReactElement {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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


  // Calculate stats for the new cards
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
