
"use client";

import { useState, type ReactElement, useMemo, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
    IndianRupee, 
    ArrowDown, 
    ArrowUp, 
    Link as LinkIcon, 
    User, 
    Search, 
    CalendarDays, 
    BarChart3, 
    Banknote, 
    ArrowUpDown, 
    ChevronUp, 
    ChevronDown, 
    AlertTriangle, 
    Send,
    Hourglass, // For Escrow
    CircleArrowOutUpRight // For Advances
} from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

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

type SortableKeys = 'id' | 'date' | 'type' | 'status' | 'clientName' | 'amount';

export default function AdminPaymentsPage(): ReactElement {
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    transactionId: '',
    orderId: '',
    status: 'All',
    type: 'All',
  });
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({
    key: 'date',
    direction: 'descending',
  });

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-1 h-4 w-4" /> :
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const displayedTransactions = useMemo(() => {
    let sortableItems = [...mockTransactions];

    sortableItems = sortableItems.filter(txn => {
      const idMatch = !filters.transactionId || txn.id.toLowerCase().includes(filters.transactionId.toLowerCase());
      const orderIdMatch = !filters.orderId || txn.orderId.toLowerCase().includes(filters.orderId.toLowerCase());
      const statusMatch = filters.status === 'All' || txn.status === filters.status;
      const typeMatch = filters.type === 'All' || txn.type === filters.type;
      return idMatch && orderIdMatch && statusMatch && typeMatch;
    });

    sortableItems.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') comparison = valA - valB;
      else if (valA instanceof Date && valB instanceof Date) comparison = valA.getTime() - valB.getTime();
      else comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
      return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
    });

    return sortableItems;
  }, [filters, sortConfig]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: 'status' | 'type', value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReleasePayout = (txn: Transaction) => {
    toast({
        title: "Payout Initiated (Simulated)",
        description: `Payout of ₹${(txn.amount * 0.9).toLocaleString('en-IN')} (after 10% fee) to ${txn.designerName} for order ${txn.orderId}.`,
    });
  };

  const handleRefundClient = (txn: Transaction) => {
    toast({
        title: "Refund Initiated (Simulated)",
        description: `Full refund of ₹${txn.amount.toLocaleString('en-IN')} to ${txn.clientName} for order ${txn.orderId}.`,
        variant: 'destructive'
    });
  };

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      case 'On Hold': return 'outline';
      case 'Refunded': return 'outline';
      default: return 'secondary';
    }
  };

   const totalRevenue = mockTransactions.filter(t => t.type === 'Sale' && (t.status === 'Completed' || t.status === 'On Hold')).reduce((acc, t) => acc + t.amount, 0);
   const pendingInEscrow = mockTransactions.filter(t => t.type === 'Sale' && t.status === 'On Hold').reduce((acc, t) => acc + t.amount, 0);
   const releasedPayments = mockTransactions.filter(t => t.type === 'Payout' && t.status === 'Completed').reduce((acc, t) => acc + Math.abs(t.amount), 0);
   const advancesGiven = 0; // Placeholder for now

   const statCards = [
     { title: "Total Revenue", value: totalRevenue, icon: IndianRupee, trend: "+10.2%" },
     { title: "Pending in Escrow", value: pendingInEscrow, icon: Hourglass, trend: "-1.5%" },
     { title: "Released Payments", value: releasedPayments, icon: ArrowUp, trend: "+8.0%" },
     { title: "Advances Given", value: advancesGiven, icon: CircleArrowOutUpRight, trend: "0%" },
   ];


  return (
    <TooltipProvider>
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <BarChart3 className="mr-3 h-8 w-8 text-primary" />
        Payments & Revenue
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(stat => (
           <Card key={stat.title} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stat.value.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A detailed log of all financial transactions, including funds held in escrow.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-card">
              <div className="space-y-1"><Label htmlFor="transactionId" className="text-xs">Transaction ID</Label><div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="transactionId" name="transactionId" placeholder="txn_..." value={filters.transactionId} onChange={handleFilterChange} className="pl-9"/></div></div>
              <div className="space-y-1"><Label htmlFor="orderId" className="text-xs">Order ID</Label><div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="orderId" name="orderId" placeholder="ORD..." value={filters.orderId} onChange={handleFilterChange} className="pl-9"/></div></div>
              <div className="space-y-1"><Label htmlFor="type" className="text-xs">Type</Label><Select value={filters.type} onValueChange={(v) => handleSelectChange('type', v)}><SelectTrigger id="type"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="All">All Types</SelectItem><SelectItem value="Sale">Sale</SelectItem><SelectItem value="Payout">Payout</SelectItem><SelectItem value="Refund">Refund</SelectItem><SelectItem value="Fee">Fee</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label htmlFor="status" className="text-xs">Status</Label><Select value={filters.status} onValueChange={(v) => handleSelectChange('status', v)}><SelectTrigger id="status"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="All">All Statuses</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="On Hold">On Hold</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Failed">Failed</SelectItem><SelectItem value="Refunded">Refunded</SelectItem></SelectContent></Select></div>
           </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('id')} className="px-1 text-xs sm:text-sm -ml-2">Transaction Details {getSortIndicator('id')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('date')} className="px-1 text-xs sm:text-sm -ml-2">Date {getSortIndicator('date')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('type')} className="px-1 text-xs sm:text-sm -ml-2">Type {getSortIndicator('type')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('status')} className="px-1 text-xs sm:text-sm -ml-2">Status {getSortIndicator('status')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('clientName')} className="px-1 text-xs sm:text-sm -ml-2">User(s) {getSortIndicator('clientName')}</Button></TableHead>
                <TableHead className="text-right"><Button variant="ghost" onClick={() => requestSort('amount')} className="px-1 text-xs sm:text-sm -ml-2">Amount (INR) {getSortIndicator('amount')}</Button></TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-xs">{txn.id}<Link href={`/admin/orders/details/${txn.orderId}`} className="block text-primary/80 hover:underline">Order: {txn.orderId} <LinkIcon className="inline h-3 w-3" /></Link></TableCell>
                  <TableCell>{format(txn.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell><Badge variant={txn.type === 'Sale' ? 'default' : 'secondary'} className="capitalize">{txn.type}</Badge></TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(txn.status)} className="capitalize">{txn.status}</Badge></TableCell>
                  <TableCell><div className="text-xs space-y-0.5"><p className="flex items-center"><User className="mr-1.5 h-3 w-3"/>Client: {txn.clientName}</p>{txn.designerName && <p className="flex items-center text-muted-foreground"><User className="mr-1.5 h-3 w-3"/>Designer: {txn.designerName}</p>}</div></TableCell>
                  <TableCell className={`text-right font-medium ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => handleReleasePayout(txn)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Release Payout to Designer</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRefundClient(txn)}>
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refund to Client</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}

