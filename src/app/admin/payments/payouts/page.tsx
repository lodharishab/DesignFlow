
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { SendToBack, CheckCircle2, RefreshCw, CircleOff, ArrowLeft } from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { getAllPayoutRequests, type PayoutRequest } from '@/lib/transactions-db';

export default function AdminPayoutsPage(): ReactElement {
    const { toast } = useToast();
    const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);

    useEffect(() => {
      getAllPayoutRequests().then(setPendingPayouts);
    }, []);
    
    const handlePayoutStatusChange = (payoutId: string, newStatus: string) => {
        setPendingPayouts(prevPayouts => 
            prevPayouts.map(p => p.id === payoutId ? {...p, status: newStatus} : p)
        );
        toast({
            title: `Payout ${payoutId} Updated`,
            description: `Status changed to ${newStatus}.`,
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
        case 'Paid': return 'default';
        case 'Pending': return 'secondary';
        case 'Processing': return 'outline';
        case 'Failed':
        case 'Cancelled': return 'destructive';
        default: return 'outline';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <SendToBack className="mr-3 h-8 w-8 text-primary" />
                    Pending Payouts
                </h1>
                <Button variant="outline" asChild>
                    <Link href="/admin/payments"><ArrowLeft className="mr-2 h-4 w-4" />Back to Payments Dashboard</Link>
                </Button>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Manage Pending Payouts</CardTitle>
                    <CardDescription>Manage and track upcoming payouts to designers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payout ID</TableHead>
                                <TableHead>Designer</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Scheduled Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingPayouts.map((payout) => (
                            <TableRow key={payout.id}>
                                <TableCell className="font-medium">{payout.id}</TableCell>
                                <TableCell>
                                <Link href={`/admin/designers/edit/${payout.designerId}`} className="font-medium text-primary hover:underline">{payout.designerId}</Link>
                                </TableCell>
                                <TableCell className="text-right font-medium">₹{payout.amount.toLocaleString('en-IN')}</TableCell>
                                <TableCell className="text-xs">{format(payout.requestDate, 'MMM d, yyyy')}</TableCell>
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
    )
}
