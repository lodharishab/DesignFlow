
"use client";

import { useState, type ReactElement, useMemo, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, ArrowDown, ArrowUp, Link as LinkIcon, User, Search, CalendarDays } from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';

type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';
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
  { id: 'txn_Olcftg87sHjkl', orderId: 'ORD7361P', date: new Date(2024, 6, 1), type: 'Sale', status: 'Completed', amount: 24999, paymentMethod: 'Razorpay', clientName: 'Priya Sharma', designerName: 'Rohan Kapoor' },
  { id: 'txn_HghtrDEWAq789', orderId: 'ORD1038K', date: new Date(2024, 6, 5), type: 'Sale', status: 'Completed', amount: 7999, paymentMethod: 'PhonePe', clientName: 'Rajesh Kumar' },
  { id: 'txn_Nnbvcxz87Uyt', orderId: 'ORD2945S', date: new Date(2024, 5, 20), type: 'Sale', status: 'Completed', amount: 19999, paymentMethod: 'Razorpay', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_ payout_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 14), type: 'Payout', status: 'Completed', amount: -17999.10, paymentMethod: 'Bank Transfer', clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_fee_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 14), type: 'Fee', status: 'Completed', amount: -1999.90, clientName: 'Sunita Rao', designerName: 'Priya Sharma' },
  { id: 'txn_Kkjhgf56Qwe', orderId: 'ORD8872V', date: new Date(2024, 6, 8), type: 'Sale', status: 'Failed', amount: 2499, paymentMethod: 'Razorpay', clientName: 'Vikram Mehta' },
  { id: 'txn_Qoiuyt09Mnb', orderId: 'ORD6531A', date: new Date(2024, 6, 10), type: 'Sale', status: 'Completed', amount: 6999, paymentMethod: 'PhonePe', clientName: 'Anjali Iyer', designerName: 'Vikram Singh' },
  { id: 'txn_Xyz123abcDef', orderId: 'ORD4011M', date: new Date(2024, 5, 25), type: 'Sale', status: 'Completed', amount: 4999, paymentMethod: 'Razorpay', clientName: 'Mohan Das', designerName: 'Sunita Reddy' },
  { id: 'txn_BT_WEDINV_RIYA01', orderId: 'ORD9274R', date: new Date(2024, 4, 15), type: 'Sale', status: 'Completed', amount: 9999, paymentMethod: 'Bank Transfer', clientName: 'Riya Sen', designerName: 'Arjun Mehta' },
];

export default function AdminPaymentsPage(): ReactElement {
  
  const [filters, setFilters] = useState({
    transactionId: '',
    orderId: '',
    status: 'All',
    type: 'All',
  });

  const displayedTransactions = useMemo(() => {
    return mockTransactions.filter(txn => {
      const idMatch = !filters.transactionId || txn.id.toLowerCase().includes(filters.transactionId.toLowerCase());
      const orderIdMatch = !filters.orderId || txn.orderId.toLowerCase().includes(filters.orderId.toLowerCase());
      const statusMatch = filters.status === 'All' || txn.status === filters.status;
      const typeMatch = filters.type === 'All' || txn.type === filters.type;
      return idMatch && orderIdMatch && statusMatch && typeMatch;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filters]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'status' | 'type', value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      case 'Refunded': return 'outline';
      default: return 'secondary';
    }
  };

   const totalRevenue = mockTransactions.filter(t => t.type === 'Sale' && t.status === 'Completed').reduce((acc, t) => acc + t.amount, 0);
   const platformFees = mockTransactions.filter(t => t.type === 'Fee' && t.status === 'Completed').reduce((acc, t) => acc + Math.abs(t.amount), 0);
   const payouts = mockTransactions.filter(t => t.type === 'Payout' && t.status === 'Completed').reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <IndianRupee className="mr-3 h-8 w-8 text-primary" />
          Payments & Revenue
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">+10.2% from last month (example)</p>
            </CardContent>
        </Card>
         <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Fees Collected</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{platformFees.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">Represents your platform's commission.</p>
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payouts to Designers</CardTitle>
                 <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{payouts.toLocaleString('en-IN')}</div>
                 <p className="text-xs text-muted-foreground">Total amount paid out to designers.</p>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A log of all financial transactions on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-card">
              <div className="space-y-1">
                <Label htmlFor="transactionId" className="text-xs">Search Transaction ID</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="transactionId" name="transactionId" placeholder="txn_..." value={filters.transactionId} onChange={handleFilterChange} className="pl-9"/>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="orderId" className="text-xs">Search Order ID</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="orderId" name="orderId" placeholder="ORD..." value={filters.orderId} onChange={handleFilterChange} className="pl-9"/>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="type" className="text-xs">Filter by Type</Label>
                <Select value={filters.type} onValueChange={(v) => handleSelectChange('type', v)}>
                    <SelectTrigger id="type"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Payout">Payout</SelectItem>
                        <SelectItem value="Refund">Refund</SelectItem>
                        <SelectItem value="Fee">Fee</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-1">
                <Label htmlFor="status" className="text-xs">Filter by Status</Label>
                <Select value={filters.status} onValueChange={(v) => handleSelectChange('status', v)}>
                    <SelectTrigger id="status"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                </Select>
              </div>
           </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User(s)</TableHead>
                <TableHead className="text-right">Amount (INR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-xs">
                    {txn.id}
                    <Link href={`/admin/orders/details/${txn.orderId}`} className="block text-primary/80 hover:underline">
                      Order: {txn.orderId} <LinkIcon className="inline h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell>{format(txn.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={txn.type === 'Sale' ? 'default' : 'secondary'} className="capitalize">{txn.type}</Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant={getStatusBadgeVariant(txn.status)} className="capitalize">{txn.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                        <p className="flex items-center"><User className="mr-1.5 h-3 w-3"/>Client: {txn.clientName}</p>
                        {txn.designerName && <p className="flex items-center text-muted-foreground"><User className="mr-1.5 h-3 w-3"/>Designer: {txn.designerName}</p>}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
