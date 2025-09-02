
"use client";

import { useState, type ReactElement, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Search, Eye } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockDisputesData, type Dispute, type DisputeStatus } from './data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const disputeStatuses: DisputeStatus[] = ['Open', 'Under Review', 'Resolved (Client Favor)', 'Resolved (Designer Favor)', 'Closed'];

export default function DesignerDisputesPage(): ReactElement {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | DisputeStatus>('All');

  const filteredDisputes = useMemo(() => {
    return disputes.filter(dispute => {
      const searchMatch = !searchTerm || dispute.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' || dispute.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [disputes, searchTerm, statusFilter]);

  const getStatusBadgeVariant = (status: DisputeStatus): 'destructive' | 'secondary' | 'default' => {
    switch (status) {
      case 'Open':
        return 'secondary'; // Yellow-ish
      case 'Under Review':
        return 'secondary'; // Blue-ish
      case 'Resolved (Designer Favor)':
        return 'default'; // Green
      case 'Resolved (Client Favor)':
        return 'destructive'; // Red
      case 'Closed':
        return 'secondary'; // Gray
      default:
        return 'outline';
    }
  };
  
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5"/>Disputes Overview</CardTitle>
        <CardDescription>Review any disputes related to your orders.</CardDescription>
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
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href={`/designer/orders/${dispute.orderId}`}>{dispute.orderId}</Link>
                  </Button>
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
                  <Button variant="outline" size="sm" disabled>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </Button>
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
  );
}
