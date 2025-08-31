
"use client";

import { useState, type ReactElement, useMemo } from 'react';
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
    Download
} from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';

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
    { id: 'txn_e_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 12), type: 'Earning', status: 'Completed', amount: 19999, description: 'Startup Logo & Brand Identity' },
    { id: 'txn_f_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 14), type: 'Fee', status: 'Completed', amount: -1999.90, description: 'Platform Fee (10%)' },
    { id: 'txn_p_ps01', orderId: 'ORD2945S', date: new Date(2024, 6, 14), type: 'Payout', status: 'Completed', amount: -17999.10, description: 'Payout to bank account' },
    { id: 'txn_e_vs01', orderId: 'ORD6531A', date: new Date(2024, 6, 18), type: 'Earning', status: 'On Hold', amount: 6999, description: 'Restaurant Menu Design' },
    { id: 'txn_a_vs01', orderId: 'ORD6531A', date: new Date(2024, 6, 19), type: 'Advance', status: 'Processing', amount: -2000, description: 'Advance for software' },
    { id: 'txn_e_rk01', orderId: 'ORD7361P', date: new Date(2024, 6, 20), type: 'Earning', status: 'On Hold', amount: 24999, description: 'E-commerce Website UI/UX' },
];


export default function DesignerEarningsPage(): ReactElement {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

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
        case 'Advance': return <ArrowDown className="text-orange-500"/>;
        default: return <IndianRupee/>;
    }
  }

  const lifetimeEarnings = transactions.filter(t => t.type === 'Earning').reduce((acc, t) => acc + t.amount, 0);
  const pendingPayout = transactions.filter(t => t.type === 'Earning' && t.status === 'On Hold').reduce((acc, t) => acc + t.amount * 0.9, 0); // Assuming 10% fee
  const lastPayout = transactions.find(t => t.type === 'Payout' && t.status === 'Completed')?.amount || 0;

  const statCards = [
    { title: "Lifetime Earnings", value: `₹${lifetimeEarnings.toLocaleString('en-IN')}`, icon: IndianRupee },
    { title: "Pending Payout", value: `₹${pendingPayout.toLocaleString('en-IN')}`, icon: Hourglass },
    { title: "Last Payout", value: `₹${Math.abs(lastPayout).toLocaleString('en-IN')}`, icon: ArrowDown },
  ];

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-primary" />
          Earnings &amp; Payouts
        </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map(stat => (
          <Card key={stat.title} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.title === 'Pending Payout' ? 'After platform fees' : 'Gross amount'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Transaction History</CardTitle>
                <CardDescription>A log of all your earnings, fees, and payouts.</CardDescription>
            </div>
            <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export Report (Soon)</Button>
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
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="w-12">{getTypeIcon(txn.type)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{format(txn.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <p className="font-medium">{txn.description}</p>
                    <Link href={`/designer/orders/${txn.orderId}`} className="text-xs text-primary hover:underline flex items-center">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
