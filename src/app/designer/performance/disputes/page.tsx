

"use client";

import { useState, type ReactElement, useMemo, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Search, Eye, FileText, IndianRupee, Calendar, User, GitCommitHorizontal, MessageSquare, History, PlusCircle, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockDisputesData, type Dispute, type DisputeStatus, type TimelineEvent, type DisputeType } from './data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { initialOrdersData, type Order } from '@/components/admin/orders/orders-table-view';
import { useToast } from '@/hooks/use-toast';

const MOCK_DESIGNER_ID = 'des002'; // For filtering orders
const disputeStatuses: DisputeStatus[] = ['Open', 'Under Review', 'Resolved (Client Favor)', 'Resolved (Designer Favor)', 'Closed'];
const disputeTypes: DisputeType[] = ['Deliverable Quality', 'Non-Delivery', 'Communication Issue', 'Scope Creep', 'Payment Issue', 'Other'];


const getStatusBadgeColor = (status: DisputeStatus): string => {
  switch (status) {
    case 'Open':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
    case 'Under Review':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
    case 'Resolved (Designer Favor)':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
    case 'Resolved (Client Favor)':
       return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
    case 'Closed':
       return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    default:
      return '';
  }
};


function DisputeDetailModal({ dispute }: { dispute: Dispute }) {
    return (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl flex items-center">
                    <ShieldAlert className="mr-3 h-6 w-6 text-primary" />
                    Dispute Details: {dispute.id}
                </DialogTitle>
                 <div className="flex justify-between items-center pt-2">
                    <DialogDescription>
                        Overview of the dispute for Order: 
                        <Link href={`/designer/orders/${dispute.orderId}`} className="text-primary hover:underline ml-1">{dispute.orderId}</Link>
                    </DialogDescription>
                    <Badge className={cn(getStatusBadgeColor(dispute.status))}>{dispute.status}</Badge>
                </div>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 py-4">
                <Card className="bg-secondary/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
                    </CardHeader>
                     <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <div><p className="font-medium text-muted-foreground">Service:</p> <p>{dispute.serviceName}</p></div>
                        <div><p className="font-medium text-muted-foreground">Price:</p> <p>₹{dispute.servicePrice.toLocaleString('en-IN')}</p></div>
                        <div><p className="font-medium text-muted-foreground">Deadline:</p> <p>{format(dispute.orderDeadline, 'PP')}</p></div>
                    </CardContent>
                </Card>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center"><User className="mr-2 h-5 w-5"/>Client's Claim</h3>
                        <p className="text-sm p-4 border rounded-md bg-background text-muted-foreground h-40 overflow-y-auto">{dispute.clientClaim}</p>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center"><GitCommitHorizontal className="mr-2 h-5 w-5"/>Your Response</h3>
                        <p className="text-sm p-4 border rounded-md bg-background text-muted-foreground h-40 overflow-y-auto">{dispute.designerResponse || <i className="text-muted-foreground/70">No response submitted yet.</i>}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Admin Notes &amp; Decision</h3>
                    <p className="text-sm p-4 border rounded-md bg-background text-muted-foreground">{dispute.adminNotes || <i className="text-muted-foreground/70">No admin notes yet.</i>}</p>
                </div>
                
                 <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center"><History className="mr-2 h-5 w-5"/>Communication Timeline</h3>
                    <div className="border rounded-md p-4 space-y-4 bg-muted/50">
                        {dispute.timeline.map((event, index) => (
                            <Card key={index} className="shadow-sm bg-background">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-semibold text-sm flex items-center">
                                            {event.actor === 'Admin' ? <ShieldAlert className="w-4 h-4 mr-2 text-primary"/> : <User className="w-4 h-4 mr-2"/>}
                                            {event.actor}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{format(event.timestamp, 'PPpp')}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{event.action}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                 </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                <Button>Contact Admin</Button>
            </DialogFooter>
        </DialogContent>
    );
}

function NewDisputeModal({ onDisputeOpened }: { onDisputeOpened: (dispute: Dispute) => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [orderId, setOrderId] = useState('');
    const [disputeType, setDisputeType] = useState<DisputeType | ''>('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    const designerOrders = useMemo(() => {
        return initialOrdersData.filter(o => o.designerId === MOCK_DESIGNER_ID && (o.status === 'In Progress' || o.status === 'Completed'));
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!orderId || !disputeType || !description) {
            toast({ title: "Error", description: "Please fill out all required fields.", variant: "destructive" });
            return;
        }
        
        setIsSubmitting(true);
        const order = designerOrders.find(o => o.id === orderId);
        if (!order) {
            toast({ title: "Error", description: "Selected order not found.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        setTimeout(() => {
            const newDispute: Dispute = {
                id: `DISP-${Math.floor(Math.random() * 900) + 100}`,
                orderId: order.id,
                serviceName: order.serviceName,
                servicePrice: order.totalAmount,
                orderDeadline: order.dueDate || new Date(),
                clientName: order.clientName,
                disputeType: disputeType as DisputeType,
                status: 'Open',
                lastUpdated: new Date(),
                clientClaim: '', // This would be the client's side in a real scenario
                designerResponse: description,
                timeline: [
                    { actor: 'Designer', action: 'Dispute opened for "'+disputeType+'".', timestamp: new Date() }
                ]
            };
            onDisputeOpened(newDispute);
            toast({ title: "Dispute Submitted", description: "Your dispute has been sent for admin review." });
            setIsSubmitting(false);
            // Reset form and close dialog is handled by DialogClose
        }, 1500);
    };

    return (
        <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Open New Dispute</DialogTitle>
                    <DialogDescription>
                        If you have an issue with an order, please provide the details below. An admin will review your case.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="dispute-order-id">Select Order*</Label>
                        <Select value={orderId} onValueChange={setOrderId} required>
                            <SelectTrigger id="dispute-order-id">
                                <SelectValue placeholder="Select an order..." />
                            </SelectTrigger>
                            <SelectContent>
                                {designerOrders.map(order => (
                                    <SelectItem key={order.id} value={order.id}>
                                        {order.id} - {order.serviceName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="dispute-type">Dispute Type*</Label>
                        <Select value={disputeType} onValueChange={(v) => setDisputeType(v as DisputeType)} required>
                             <SelectTrigger id="dispute-type">
                                <SelectValue placeholder="Select a reason..." />
                            </SelectTrigger>
                            <SelectContent>
                                {disputeTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="dispute-description">Description*</Label>
                        <Textarea 
                            id="dispute-description" 
                            placeholder="Please describe the issue in detail. What happened? What is your desired outcome?" 
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dispute-attachment">Upload Proof (Optional)</Label>
                        <Input id="dispute-attachment" type="file" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} />
                      </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Submit Dispute
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default function DesignerDisputesPage(): ReactElement {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | DisputeStatus>('All');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const filteredDisputes = useMemo(() => {
    return disputes.filter(dispute => {
      const searchMatch = !searchTerm || dispute.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' || dispute.status === statusFilter;
      return searchMatch && statusMatch;
    }).sort((a,b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }, [disputes, searchTerm, statusFilter]);

  const handleDisputeOpened = (newDispute: Dispute) => {
    setDisputes(prev => [newDispute, ...prev]);
  };

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedDispute(null)}>
        <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5"/>Disputes Overview</CardTitle>
                    <CardDescription>Review any disputes related to your orders.</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Open New Dispute</Button>
                    </DialogTrigger>
                    <NewDisputeModal onDisputeOpened={handleDisputeOpened} />
                </Dialog>
            </div>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="searchOrderId" className="text-xs">Search by Order ID</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="searchOrderId" placeholder="e.g., ORD123" className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="statusFilter" className="text-xs">Filter by Status</Label>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                        <SelectTrigger id="statusFilter"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            {disputeStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Dispute Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredDisputes.length > 0 ? filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                    <TableCell className="font-medium">{dispute.id}</TableCell>
                    <TableCell>{dispute.clientName}</TableCell>
                    <TableCell>
                        <DialogTrigger asChild>
                           <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedDispute(dispute)}>
                            {dispute.orderId}
                           </Button>
                        </DialogTrigger>
                    </TableCell>
                    <TableCell>{dispute.disputeType}</TableCell>
                    <TableCell>
                    <Badge className={cn(getStatusBadgeColor(dispute.status))}>
                        {dispute.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(dispute.lastUpdated, { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                        <DialogTrigger asChild>
                             <Button variant="outline" size="sm" onClick={() => setSelectedDispute(dispute)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </Button>
                        </DialogTrigger>
                    </TableCell>
                </TableRow>
                )) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">No disputes match your filters.</TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
        {selectedDispute && <DisputeDetailModal dispute={selectedDispute} />}
    </Dialog>
  );
}
