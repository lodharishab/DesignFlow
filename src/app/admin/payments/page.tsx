
"use client";

import { useState, useEffect, type ReactElement, useMemo, ChangeEvent, useCallback } from 'react';
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
    BarChart3, 
    Hourglass, 
    CircleArrowOutUpRight,
    Eye,
    ReceiptText,
    History,
    X,
    AlertTriangle,
    Send,
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
    Download,
    PieChart as PieChartIcon,
    SendToBack,
    HandCoins,
    ShieldAlert,
    Settings
} from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { getAllTransactions, type Transaction } from '@/lib/transactions-db';

type SortableKeys = 'id' | 'date' | 'type' | 'status' | 'clientName' | 'amount';

// Detail Modal Component
function TransactionDetailModal({ transaction, ledger, escrowBalance, onAction }: { transaction: Transaction; ledger: Transaction[]; escrowBalance: number, onAction: (action: string) => void; }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl flex items-center">
          <ReceiptText className="mr-3 h-6 w-6 text-primary" />
          Transaction Details
        </DialogTitle>
        <DialogDescription>
          Overview for Transaction ID: {transaction.id}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold">Order ID:</span> <Link href={`/admin/orders/details/${transaction.orderId}`} className="text-primary hover:underline">{transaction.orderId}</Link></div>
          <div><span className="font-semibold">Client:</span> {transaction.clientName}</div>
          <div><span className="font-semibold">Designer:</span> {transaction.designerName || 'N/A'}</div>
          <div><span className="font-semibold">Date:</span> {format(transaction.date, 'PPpp')}</div>
        </div>

        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-secondary/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold flex items-center"><IndianRupee className="mr-2 h-4 w-4"/>Order Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">₹{Math.abs(ledger.find(t => t.type === 'Sale')?.amount || 0).toLocaleString('en-IN')}</p>
                </CardContent>
            </Card>
             <Card className="bg-secondary/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold flex items-center"><Hourglass className="mr-2 h-4 w-4"/>Escrow Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">₹{escrowBalance.toLocaleString('en-IN')}</p>
                </CardContent>
            </Card>
        </div>

        <Separator />

        <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><History className="mr-2 h-5 w-5"/>Ledger History</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ledger.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="text-xs">{format(item.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell><Badge variant={item.type === 'Sale' ? 'default' : 'secondary'} className="capitalize">{item.type}</Badge></TableCell>
                            <TableCell><Badge variant={item.status === 'Completed' ? 'default' : 'outline'} className="capitalize">{item.status}</Badge></TableCell>
                            <TableCell className={`text-right font-medium ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.amount > 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString('en-IN')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </div>
      <DialogFooter className="border-t pt-4 flex flex-wrap justify-end gap-2">
         <DialogClose asChild>
          <Button variant="outline"><X className="mr-2 h-4 w-4" />Close</Button>
        </DialogClose>
        <Button variant="outline" onClick={() => onAction('payoutRequest')}><CircleArrowOutUpRight className="mr-2 h-4 w-4"/>Request Payout</Button>
        <Button onClick={() => onAction('refund')} variant="destructive"><AlertTriangle className="mr-2 h-4 w-4"/>Issue Full Refund</Button>
        <Button onClick={() => onAction('payout')}><Send className="mr-2 h-4 w-4"/>Release Payout</Button>
      </DialogFooter>
    </DialogContent>
  )
}

const quickLinks = [
    { href: "/admin/payments/payouts", label: "Pending Payouts", icon: SendToBack },
    { href: "/admin/payments/advances", label: "Payout Requests", icon: HandCoins },
    { href: "/admin/payments/disputes", label: "Dispute Management", icon: ShieldAlert },
    { href: "/admin/payments/reports", label: "Reports & Analytics", icon: PieChartIcon },
    { href: "/admin/payments/settings", label: "Payment Settings", icon: Settings },
];

export default function AdminPaymentsPage(): ReactElement {
  const { toast } = useToast();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    getAllTransactions().then(setAllTransactions);
  }, []);
  
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
    let sortableItems = [...allTransactions];

    sortableItems = sortableItems.filter(txn => {
      const idMatch = !filters.transactionId || txn.id.toLowerCase().includes(filters.transactionId.toLowerCase());
      const orderIdMatch = !filters.orderId || (txn.orderId || '').toLowerCase().includes(filters.orderId.toLowerCase());
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

  const handleAction = (action: string) => {
      if (!selectedTransaction) return;
      if (action === 'payout') {
          toast({
            title: "Payout Initiated (Simulated)",
            description: `Payout released for ${selectedTransaction.designerName} on order ${selectedTransaction.orderId}.`,
        });
      } else if (action === 'refund') {
           toast({
            title: "Refund Initiated (Simulated)",
            description: `Full refund issued to ${selectedTransaction.clientName} for order ${selectedTransaction.orderId}.`,
            variant: 'destructive'
        });
      }
      else if (action === 'payoutRequest') {
        toast({
            title: "Payout Requested (Simulated)",
            description: `Payout requested for ${selectedTransaction.designerName} on order ${selectedTransaction.orderId}.`,
        });
      }
      setSelectedTransaction(null);
  }

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending':
      case 'On Hold': return 'secondary';
      case 'Failed':
      case 'Refunded': return 'destructive';
      default: return 'outline';
    }
  };

   const totalRevenue = allTransactions.filter(t => t.type === 'Sale' && (t.status === 'Completed' || t.status === 'On Hold')).reduce((acc, t) => acc + t.amount, 0);
   const pendingInEscrow = allTransactions.filter(t => t.type === 'Sale' && t.status === 'On Hold').reduce((acc, t) => acc + t.amount, 0);
   const releasedPayments = allTransactions.filter(t => t.type === 'Payout' && t.status === 'Completed').reduce((acc, t) => acc + Math.abs(t.amount), 0);
   const advancesGiven = allTransactions.filter(t => t.type === 'Payout' && t.status === 'Pending').reduce((acc, t) => acc + Math.abs(t.amount), 0);

   const statCards = [
     { title: "Total Revenue", value: totalRevenue, icon: IndianRupee, trend: "+10.2%" },
     { title: "Pending in Escrow", value: pendingInEscrow, icon: Hourglass, trend: "-1.5%" },
     { title: "Released Payments", value: releasedPayments, icon: ArrowUp, trend: "+8.0%" },
     { title: "Advances Given", value: advancesGiven, icon: CircleArrowOutUpRight, trend: "0%" },
   ];
  
   const selectedLedger = useMemo(() => {
     if (!selectedTransaction) return [];
     return allTransactions.filter(t => t.orderId === selectedTransaction.orderId).sort((a,b) => b.date.getTime() - a.date.getTime());
   }, [selectedTransaction]);
   
   const selectedEscrowBalance = useMemo(() => {
     return selectedLedger.reduce((acc, curr) => acc + curr.amount, 0);
   }, [selectedLedger])
   
   const handleExportAll = useCallback(() => {
    const headers = ["Transaction ID", "Order ID", "Date", "Type", "Status", "Amount", "Payment Method", "Client", "Designer"];
    const rows = displayedTransactions.map(txn => [
      txn.id,
      txn.orderId,
      format(txn.date, "yyyy-MM-dd HH:mm:ss"),
      txn.type,
      txn.status,
      txn.amount.toString(),
      txn.paymentMethod || 'N/A',
      `"${(txn.clientName || 'N/A').replace(/"/g, '""')}"`,
      txn.designerName ? `"${txn.designerName.replace(/"/g, '""')}"` : 'N/A'
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "full_transaction_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [displayedTransactions]);

  return (
    <TooltipProvider>
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-primary" />
          Payments &amp; Revenue
        </h1>
        <Button onClick={handleExportAll}>
          <Download className="mr-2 h-4 w-4" /> Export Full Ledger (CSV)
        </Button>
      </div>
      
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
            <CardTitle>Quick Management</CardTitle>
            <CardDescription>Jump to specific financial management sections.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href} className="block">
                <Card className="h-full text-center hover:bg-primary/5 hover:shadow-lg transition-all p-6 flex flex-col items-center justify-center">
                  <link.icon className="h-8 w-8 text-primary mb-2" />
                  <p className="font-semibold text-sm">{link.label}</p>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Transactions Ledger</CardTitle>
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
                     <Dialog onOpenChange={(open) => !open && setSelectedTransaction(null)}>
                        <DialogTrigger asChild>
                             <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(txn)}>
                                <Eye className="mr-2 h-4 w-4" /> Details
                             </Button>
                        </DialogTrigger>
                        {selectedTransaction?.id === txn.id && (
                            <TransactionDetailModal 
                                transaction={selectedTransaction} 
                                ledger={selectedLedger} 
                                escrowBalance={selectedEscrowBalance} 
                                onAction={handleAction}
                            />
                        )}
                    </Dialog>
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
