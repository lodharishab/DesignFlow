
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
    Hourglass, 
    CircleArrowOutUpRight,
    Eye,
    ReceiptText,
    History,
    MoreHorizontal,
    X,
    CheckCircle2, // For Approve button
    XCircle, // For Reject button
    HandCoins, // For Advance Requests section
    RefreshCw, // For Retry
    CircleOff, // For Cancel
    SendToBack, // For Pending Payouts section
    Loader2, // For Processing
    ShieldAlert // For Disputes section
} from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

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

// Mock data now includes related transactions to better simulate a ledger
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

// New interface and mock data for Advance Requests
type AdvanceRequestStatus = 'Pending' | 'Approved' | 'Rejected';
interface AdvanceRequest {
  id: string;
  designerName: string;
  designerId: string;
  amount: number;
  reason: string;
  status: AdvanceRequestStatus;
  requestDate: Date;
}

const mockAdvanceRequests: AdvanceRequest[] = [
  { id: 'ADV001', designerName: 'Rohan Kapoor', designerId: 'des002', amount: 5000, reason: 'Software subscription renewal (Adobe CC)', status: 'Pending', requestDate: new Date(2024, 6, 19) },
  { id: 'ADV002', designerName: 'Aisha Khan', designerId: 'des003', amount: 10000, reason: 'Hardware upgrade - Graphics tablet', status: 'Approved', requestDate: new Date(2024, 6, 15) },
  { id: 'ADV003', designerName: 'Vikram Singh', designerId: 'des004', amount: 3000, reason: 'Marketing materials for personal brand', status: 'Rejected', requestDate: new Date(2024, 6, 12) },
];

type PayoutStatus = 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Cancelled';
interface PendingPayout {
  id: string;
  designerName: string;
  designerId: string;
  amount: number;
  status: PayoutStatus;
  scheduledDate: Date;
  relatedOrderIds: string[];
}

const mockPendingPayouts: PendingPayout[] = [
  { id: 'PAYOUT001', designerName: 'Vikram Singh', designerId: 'des004', amount: 6299.10, status: 'Pending', scheduledDate: new Date(2024, 6, 18), relatedOrderIds: ['ORD6531A'] },
  { id: 'PAYOUT002', designerName: 'Rohan Kapoor', designerId: 'des002', amount: 15000.00, status: 'Processing', scheduledDate: new Date(2024, 6, 20), relatedOrderIds: ['ORD7361P', 'ORDXXXX1'] },
  { id: 'PAYOUT003', designerName: 'Aisha Khan', designerId: 'des003', amount: 8500.00, status: 'Failed', scheduledDate: new Date(2024, 6, 17), relatedOrderIds: ['ORDXXXX2'] },
];

// New interface and mock data for Disputes
type DisputeStatus = 'Open' | 'Under Review' | 'Resolved - Client Favored' | 'Resolved - Designer Favored';
interface Dispute {
  id: string;
  paymentId: string;
  orderId: string;
  clientName: string;
  designerName: string;
  reason: string;
  status: DisputeStatus;
  disputeDate: Date;
}

const mockDisputes: Dispute[] = [
    { id: 'DISP001', paymentId: 'txn_Olcftg87sHjkl', orderId: 'ORD7361P', clientName: 'Priya Sharma', designerName: 'Rohan Kapoor', reason: 'Deliverable not as described', status: 'Under Review', disputeDate: new Date(2024, 6, 18) },
    { id: 'DISP002', paymentId: 'txn_refund_md01', orderId: 'ORD4011M', clientName: 'Mohan Das', designerName: 'Sunita Reddy', reason: 'Did not receive full refund', status: 'Open', disputeDate: new Date(2024, 6, 19) },
    { id: 'DISP003', paymentId: 'txn_Nnbvcxz87Uyt', orderId: 'ORD2945S', clientName: 'Sunita Rao', designerName: 'Priya Sharma', reason: 'Duplicate charge reported', status: 'Resolved - Client Favored', disputeDate: new Date(2024, 6, 1) },
];


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
        <Button variant="outline" onClick={() => onAction('hold')} disabled><Hourglass className="mr-2 h-4 w-4"/>Place On Hold (Soon)</Button>
        <Button variant="outline" onClick={() => onAction('advance')} disabled><CircleArrowOutUpRight className="mr-2 h-4 w-4"/>Give Advance (Soon)</Button>
        <Button onClick={() => onAction('refund')} variant="destructive"><AlertTriangle className="mr-2 h-4 w-4"/>Issue Full Refund</Button>
        <Button onClick={() => onAction('payout')}><Send className="mr-2 h-4 w-4"/>Release Payout</Button>
      </DialogFooter>
    </DialogContent>
  )
}


export default function AdminPaymentsPage(): ReactElement {
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>(mockAdvanceRequests);
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>(mockPendingPayouts);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  
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
      setSelectedTransaction(null);
  }

  const handleAdvanceRequestStatusChange = (requestId: string, newStatus: AdvanceRequestStatus) => {
    setAdvanceRequests(prevRequests =>
      prevRequests.map(req => (req.id === requestId ? { ...req, status: newStatus } : req))
    );
    toast({
      title: `Request ${newStatus}`,
      description: `Advance request ${requestId} has been ${newStatus.toLowerCase()}.`,
    });
  };
  
  const handlePayoutStatusChange = (payoutId: string, newStatus: PayoutStatus) => {
      setPendingPayouts(prevPayouts => 
          prevPayouts.map(p => p.id === payoutId ? {...p, status: newStatus} : p)
      );
      toast({
          title: `Payout ${payoutId} Updated`,
          description: `Status changed to ${newStatus}.`,
      });
  };

  const getStatusBadgeVariant = (status: TransactionStatus | AdvanceRequestStatus | PayoutStatus | DisputeStatus) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
      case 'Paid':
      case 'Resolved - Client Favored':
      case 'Resolved - Designer Favored':
        return 'default';
      case 'Pending':
      case 'On Hold':
      case 'Open':
      case 'Under Review':
        return 'secondary';
      case 'Processing':
        return 'outline';
      case 'Failed':
      case 'Rejected':
      case 'Refunded':
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

   const totalRevenue = mockTransactions.filter(t => t.type === 'Sale' && (t.status === 'Completed' || t.status === 'On Hold')).reduce((acc, t) => acc + t.amount, 0);
   const pendingInEscrow = mockTransactions.filter(t => t.type === 'Sale' && t.status === 'On Hold').reduce((acc, t) => acc + t.amount, 0);
   const releasedPayments = mockTransactions.filter(t => t.type === 'Payout' && t.status === 'Completed').reduce((acc, t) => acc + Math.abs(t.amount), 0);
   const advancesGiven = mockAdvanceRequests.filter(r => r.status === 'Approved').reduce((acc, r) => acc + r.amount, 0);

   const statCards = [
     { title: "Total Revenue", value: totalRevenue, icon: IndianRupee, trend: "+10.2%" },
     { title: "Pending in Escrow", value: pendingInEscrow, icon: Hourglass, trend: "-1.5%" },
     { title: "Released Payments", value: releasedPayments, icon: ArrowUp, trend: "+8.0%" },
     { title: "Advances Given", value: advancesGiven, icon: CircleArrowOutUpRight, trend: "0%" },
   ];
  
   const selectedLedger = useMemo(() => {
     if (!selectedTransaction) return [];
     return mockTransactions.filter(t => t.orderId === selectedTransaction.orderId).sort((a,b) => b.date.getTime() - a.date.getTime());
   }, [selectedTransaction]);
   
   const selectedEscrowBalance = useMemo(() => {
     return selectedLedger.reduce((acc, curr) => acc + curr.amount, 0);
   }, [selectedLedger])


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

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><HandCoins className="mr-2 h-5 w-5 text-primary" />Designer Advance Requests</CardTitle>
            <CardDescription>Review and manage advance payment requests from designers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advanceRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Link href={`/admin/designers/edit/${req.designerId}`} className="font-medium text-primary hover:underline">{req.designerName}</Link>
                      <p className="text-xs text-muted-foreground truncate" title={req.reason}>{req.reason}</p>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{req.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(req.status)} className="capitalize">{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {req.status === 'Pending' ? (
                        <>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 border-green-500 hover:bg-green-50 hover:text-green-700" onClick={() => handleAdvanceRequestStatusChange(req.id, 'Approved')}>
                              <CheckCircle2 className="h-4 w-4" /><span className="sr-only">Approve</span>
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleAdvanceRequestStatusChange(req.id, 'Rejected')}>
                              <XCircle className="h-4 w-4" /><span className="sr-only">Reject</span>
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Actioned</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><SendToBack className="mr-2 h-5 w-5 text-primary" />Pending Payouts</CardTitle>
            <CardDescription>Manage and track upcoming payouts to designers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <Link href={`/admin/designers/edit/${payout.designerId}`} className="font-medium text-primary hover:underline">{payout.designerName}</Link>
                      <p className="text-xs text-muted-foreground">Due: {format(payout.scheduledDate, 'MMM d, yyyy')}</p>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{payout.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payout.status)} className="capitalize">{payout.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {payout.status === 'Failed' && (
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handlePayoutStatusChange(payout.id, 'Processing')}>
                          <RefreshCw className="h-4 w-4" /><span className="sr-only">Retry</span>
                        </Button>
                      )}
                      {payout.status === 'Pending' && (
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handlePayoutStatusChange(payout.id, 'Cancelled')}>
                          <CircleOff className="h-4 w-4" /><span className="sr-only">Cancel</span>
                        </Button>
                      )}
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handlePayoutStatusChange(payout.id, 'Paid')}>
                        <CheckCircle2 className="h-4 w-4" /><span className="sr-only">Mark as Paid</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-primary" />Payment Disputes</CardTitle>
            <CardDescription>Review and mediate payment disputes between clients and designers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Dispute ID</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                            <TableCell className="font-medium">{dispute.id}
                                <Link href={`/admin/orders/details/${dispute.orderId}`} className="block text-primary/80 hover:underline text-xs">
                                Order: {dispute.orderId}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="text-xs space-y-0.5">
                                    <p>Client: {dispute.clientName}</p>
                                    <p className="text-muted-foreground">Designer: {dispute.designerName}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{dispute.reason}</TableCell>
                             <TableCell><Badge variant={getStatusBadgeVariant(dispute.status)} className="capitalize whitespace-nowrap">{dispute.status}</Badge></TableCell>
                             <TableCell className="text-xs">{format(dispute.disputeDate, 'MMM d, yyyy')}</TableCell>
                             <TableCell className="text-right">
                                 <Button variant="outline" size="sm" disabled>
                                    <Eye className="mr-2 h-4 w-4" /> Details
                                 </Button>
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
