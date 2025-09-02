
"use client";

import { useState, type ReactElement, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { HandCoins, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { initialOrdersData, type Order, type PaymentTransaction } from '@/components/admin/orders/orders-table-view';

type PayoutRequestStatus = 'Pending' | 'Approved' | 'Rejected';
interface PayoutRequest {
  id: string;
  designerName: string;
  designerId: string;
  orderId: string; // Link to an order
  milestoneId: string; // Link to a specific milestone
  amount: number;
  reason: string;
  status: PayoutRequestStatus;
  requestDate: Date;
}

const mockPayoutRequests: PayoutRequest[] = [
  { id: 'ADV001', designerName: 'Rohan Kapoor', designerId: 'des002', orderId: 'ORD7361P', milestoneId: 'm2_7361p', amount: 5000, reason: 'Software subscription renewal (Adobe CC)', status: 'Pending', requestDate: new Date(2024, 6, 19) },
  { id: 'ADV002', designerName: 'Aisha Khan', designerId: 'des003', orderId: 'ORDXXXX2', milestoneId: 'm1_xxxx2', amount: 10000, reason: 'Hardware upgrade - Graphics tablet', status: 'Approved', requestDate: new Date(2024, 6, 15) },
  { id: 'ADV003', designerName: 'Vikram Singh', designerId: 'des004', orderId: 'ORD6531A', milestoneId: 'm1_6531a', amount: 3000, reason: 'Marketing materials for personal brand', status: 'Rejected', requestDate: new Date(2024, 6, 12) },
];


export default function AdminPayoutRequestsPage(): ReactElement {
    const { toast } = useToast();
    const router = useRouter();
    const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(mockPayoutRequests);
    const [orders, setOrders] = useState<Order[]>(initialOrdersData);

    const handlePayoutRequestStatusChange = (requestId: string, newStatus: PayoutRequestStatus) => {
        const request = payoutRequests.find(req => req.id === requestId);
        if (!request) return;

        // Update the request status
        setPayoutRequests(prevRequests =>
            prevRequests.map(req => (req.id === requestId ? { ...req, status: newStatus } : req))
        );

        if (newStatus === 'Approved') {
            // Find and update the corresponding order and milestone
            const orderIndex = orders.findIndex(o => o.id === request.orderId);
            if (orderIndex !== -1) {
                const updatedOrders = [...orders];
                const orderToUpdate = { ...updatedOrders[orderIndex] };

                // Update milestone status
                if (orderToUpdate.milestones) {
                    const milestoneIndex = orderToUpdate.milestones.findIndex(m => m.id === request.milestoneId);
                    if (milestoneIndex !== -1) {
                        orderToUpdate.milestones[milestoneIndex].status = 'Paid';
                    }
                }
                
                // Add payment transaction record
                const newPayment: PaymentTransaction = {
                    id: `payout_${request.id}`,
                    date: new Date(),
                    type: 'Payout',
                    status: 'Completed',
                    amount: -request.amount, // Payouts are negative amounts
                    description: `Payout approved: ${request.reason}`
                };
                
                if (!orderToUpdate.payments) {
                    orderToUpdate.payments = [];
                }
                orderToUpdate.payments.push(newPayment);

                updatedOrders[orderIndex] = orderToUpdate;
                setOrders(updatedOrders);
            }
        }

        toast({
            title: `Request ${newStatus}`,
            description: `Payout request ${requestId} has been ${newStatus.toLowerCase()}.`,
        });
    };

    const getStatusBadgeVariant = (status: PayoutRequestStatus) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending': return 'secondary';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <HandCoins className="mr-3 h-8 w-8 text-primary" />
                    Designer Payout Requests
                </h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/payments"><ArrowLeft className="mr-2 h-4 w-4" />Back to Payments Dashboard</Link>
                </Button>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Manage Payout Requests</CardTitle>
                    <CardDescription>Review and manage milestone-based payment requests from designers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>Designer</TableHead>
                                <TableHead>Related Order</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payoutRequests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.id}</TableCell>
                                <TableCell>
                                <Link href={`/admin/designers/edit/${req.designerId}`} className="font-medium text-primary hover:underline">{req.designerName}</Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/admin/orders/details/${req.orderId}`} className="text-xs text-primary hover:underline">{req.orderId}</Link>
                                </TableCell>
                                <TableCell className="text-right font-medium">₹{req.amount.toLocaleString('en-IN')}</TableCell>
                                <TableCell className="text-xs text-muted-foreground" title={req.reason}>{req.reason}</TableCell>
                                <TableCell className="text-xs">{format(req.requestDate, 'MMM d, yyyy')}</TableCell>
                                <TableCell>
                                <Badge variant={getStatusBadgeVariant(req.status)} className="capitalize">{req.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                {req.status === 'Pending' ? (
                                    <>
                                    <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 border-green-500 hover:bg-green-50 hover:text-green-700" onClick={() => handlePayoutRequestStatusChange(req.id, 'Approved')}>
                                        <CheckCircle2 className="h-4 w-4" /><span className="sr-only">Approve</span>
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handlePayoutRequestStatusChange(req.id, 'Rejected')}>
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
        </div>
    )
}
