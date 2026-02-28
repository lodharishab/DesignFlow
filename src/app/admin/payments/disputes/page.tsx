
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Eye } from "lucide-react";
import { format } from 'date-fns';
import Link from 'next/link';
import { getAllDisputes, type Dispute } from '@/lib/disputes-db';

export default function AdminDisputesPage(): ReactElement {
    const [disputes, setDisputes] = useState<Dispute[]>([]);

    useEffect(() => {
      getAllDisputes().then(setDisputes);
    }, []);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
        case 'Resolved - Client Favored':
        case 'Resolved - Designer Favored':
            return 'default';
        case 'Open':
        case 'Under Review':
            return 'secondary';
        default:
            return 'outline';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <ShieldAlert className="mr-3 h-8 w-8 text-primary" />
                    Payment Disputes
                </h1>
                 <Button variant="outline" asChild>
                    <Link href="/admin/payments"><ArrowLeft className="mr-2 h-4 w-4" />Back to Payments Dashboard</Link>
                </Button>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Manage Disputes</CardTitle>
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
                                            <p>Client: {dispute.clientName || 'N/A'}</p>
                                            <p className="text-muted-foreground">Service: {dispute.serviceName || 'N/A'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{dispute.disputeType}</TableCell>
                                    <TableCell><Badge variant={getStatusBadgeVariant(dispute.status)} className="capitalize whitespace-nowrap">{dispute.status}</Badge></TableCell>
                                    <TableCell className="text-xs">{format(dispute.lastUpdated, 'MMM d, yyyy')}</TableCell>
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
    )
}
